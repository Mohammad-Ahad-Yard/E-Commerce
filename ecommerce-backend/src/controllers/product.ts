import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../middlewares/error.js";
import { BaseQuery, NewProductsRequestBody, SearchRequestQuery } from "../types/types.js";
import { Product } from "../models/products.js";
import ErrorHanlder from "../utils/utilityClass.js";
import { rm } from "fs";
import { nodeCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
// import { faker } from "@faker-js/faker";

export const newProduct = TryCatch(async (req: Request<{}, {}, NewProductsRequestBody>, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if(!photo){
        return next(new ErrorHanlder("Please Add Photo", 400));
    }
    if(!name || !price || !stock || !category){
        rm(photo.path, () => {
            console.log("Deleted!");
        });
        return next(new ErrorHanlder("Please Enter All Fields", 400));
    }
    await Product.create({name, price, stock, category:category.toLowerCase(),photo:photo?.path});
    invalidateCache({product:true, admin: true});
    return res.status(201).json({success: true, message: "Product Created Successfully!"});
});

export const getLatestProducts = TryCatch(async (req, res, next) => {
    let products;
    if(nodeCache.has("latest-products")){
        products = JSON.parse(nodeCache.get("latest-products") as string);
    }
    else {
        products = await Product.find({}).sort({createdAt: -1}).limit(10);
        nodeCache.set("latest-products", JSON.stringify(products));
    }
    return res.status(200).json({success: true, products});
});

export const getAllCategories = TryCatch(async (req, res, next) => {
    let categories;
    if(nodeCache.has("categories")){
        categories = JSON.parse(nodeCache.get("categories")!);
    }
    else{
        categories = await Product.distinct("category");
        nodeCache.set("categories", JSON.stringify(categories));
    }
    return res.status(200).json({success: true, categories});
});

export const getAdminProducts = TryCatch(async (req, res, next) => {
    let products;
    if(nodeCache.has("all-products")){
        products = JSON.parse(nodeCache.get("all-products")!);
    }
    else{
        products = await Product.find({});
        nodeCache.set("all-products", JSON.stringify(products));
    }
    return res.status(200).json({success: true, products});
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    let product;
    if(nodeCache.has(`product-${id}`)){
        product = JSON.parse(nodeCache.get(`product-${id}`)!);
    }
    else{
        product = await Product.findById(id);
        nodeCache.set(`product-${id}`, JSON.stringify(product));
    }
    if(!product) return next(new ErrorHanlder("Product Not Found", 404));
    return res.status(200).json({success: true, product});
});

export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);

    if(!product){
        return next(new ErrorHanlder("Invalid Product ID", 404));
    }
    
    if(photo){
        rm(product.photo, () => {
            console.log("Old Photo Deleted!");
        });
        product.photo = photo.path;
    }

    if(name) product.name = name;
    if(price) product.price = price;
    if(stock) product.stock = stock;
    if(category) product.category = category;

    await product.save();

    invalidateCache({product:true, admin: true, productId:String(product._id)});

    return res.status(200).json({success: true, message: "Product Updated Successfully!"});
});

export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product) return next(new ErrorHanlder("Product Not Found", 404));
    rm(product.photo, () => {
        console.log("Product Photo Deleted!");
    });
    await Product.deleteOne();
    invalidateCache({product:true, admin: true, productId:String(product._id)});
    return res.status(200).json({success: true, message: "Product Deleted Successfully"});
});

export const getAllProducts = TryCatch(async (req:Request<{},{},{},SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);

    const baseQuery:BaseQuery = {};
    if(search) baseQuery.name = { $regex: search, $options: "i" };
    if(price) baseQuery.price = { $lte: Number(price) };
    if(category) baseQuery.category = category;

    const [products, filteredOnyProducts] = await Promise.all([
        Product.find(baseQuery).sort(sort && {price: sort === "asc" ? 1 : -1}).limit(limit).skip(skip),
        Product.find(baseQuery)
    ]);

    const totalPage = Math.ceil(filteredOnyProducts.length / limit);

    return res.status(200).json({success: true, products, totalPage});
});

// const generateRandomProducts = async (count:number=10) => {
//     const products = [];
//     for(let i = 0; i<count; i++){
//         const product = {
//             name: faker.commerce.productName(),
//             photo: "uploads\\ab4ada91-97f6-42fa-8e49-755c3cfbac41.bmp",
//             price: faker.commerce.price({min:1500,max:80000,dec:0}),
//             stock: faker.commerce.price({min:0,max:100,dec:0}),
//             category: faker.commerce.department(),
//             createdAt: new Date(faker.date.past()),
//             updateAt: new Date(faker.date.recent()),
//             _v: 0
//         }
//         products.push(product);
//     }
//     await Product.create(products);
//     console.log("created");
// }

// generateRandomProducts(40);

// const deleteRandomProducts = async (count:number=10) => {
//     const products = await Product.find({}).skip(2);
//     for(let i=0; i<products.length; i++){
//         const product = products[i];
//         await product.deleteOne();
//     }
//     console.log({success: true});
// }
// deleteRandomProducts(38);