import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHanlder from "../utils/utilityClass.js";
import { nodeCache } from "../app.js";

export const myOrders = TryCatch(async (req,res,next) => {
    const {id:user} = req.query;
    let orders = [];
    if(nodeCache.has(`my-orders-${user}`)) orders = JSON.parse(nodeCache.get(`my-orders-${user}`)!);
    else{
        orders = await Order.find({user});
        nodeCache.set(`my-orders-${user}`, JSON.stringify(orders));
    }
    return res.status(200).json({success: true, orders});
});

export const allOrders = TryCatch(async (req,res,next) => {
    let orders = [];
    if(nodeCache.has(`all-orders`)) orders = JSON.parse(nodeCache.get(`all-orders`)!);
    else{
        orders = await Order.find().populate("user", "name");
        nodeCache.set(`all-orders`, JSON.stringify(orders));
    }
    return res.status(200).json({success: true, orders});
});

export const getSingleOrder = TryCatch(async (req,res,next) => {
    const {id} = req.params;
    let order;
    if(nodeCache.has(`order-${id}`))
        order = JSON.parse(nodeCache.get(`order-${id}`)!);
    else{
        order = await Order.findById(id).populate("user", "name");
        if(!order) return next(new ErrorHanlder("Order Not Found", 404));
        nodeCache.set(`order-${id}`, JSON.stringify(order));
    }
    return res.status(200).json({success: true, order});
});

export const newOrder = TryCatch(async (req:Request<{},{},NewOrderRequestBody>,res,next) => {
    const { shippingInfo, orderItems,user,subtotal,tax,shippingCharges,discount,total } = req.body;
    if(!shippingInfo || !orderItems || !user || !subtotal || !tax || !total){
        return next(new ErrorHanlder("Please Enter all Fields", 400));
    }
    const order = await Order.create({shippingInfo, orderItems,user,subtotal,tax,shippingCharges,discount,total});
    await reduceStock(orderItems);
    invalidateCache({product:true, order:true, admin:true, userId:user, productId:order.orderItems.map(i => String(i.productId))});
    return res.status(201).json({success: true, message: "Order Placed Successfully"});
});

export const processOrder = TryCatch(async (req,res,next) => {
    const {id} = req.params;
    const order = await Order.findById(id);
    if(!order) return next(new ErrorHanlder("Order Not Found", 404));
    switch(order.status){
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered";
    }
    await order.save();
    invalidateCache({product:false, order:true, admin:true, userId:order.user, orderId:String(order._id)});
    return res.status(201).json({success: true, message: "Order processed Successfully"});
});

export const deleteOrder = TryCatch(async (req,res,next) => {
    const {id} = req.params;
    const order = await Order.findById(id);
    if(!order) return next(new ErrorHanlder("Order Not Found", 404));
    
    await order.deleteOne();
    invalidateCache({product:false, order:true, admin:true, userId:order.user, orderId:String(order._id)});
    return res.status(201).json({success: true, message: "Order Deleted Successfully"});
});