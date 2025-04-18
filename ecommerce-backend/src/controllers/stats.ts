import { nodeCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/products.js";
import { User } from "../models/user.js";
import { calculatePercentage, getChartData, getInventories } from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
    let stats = {};
    if(nodeCache.has("admin-stats")) stats = JSON.parse(nodeCache.get("admin-stats")!);
    else {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today
        };
        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth()-1, 1),
            end: new Date(today.getFullYear(), today.getMonth(), 0)
        };

        const thisMonthProductsPromise = Product.find({
            createdAt: {
                $gte: thisMonth.start, $lte: thisMonth.end
            }
        });
        const lastMonthProductsPromise = Product.find({
            createdAt: {
                $gte: lastMonth.start, $lte: lastMonth.end
            }
        });

        const thisMonthUserPromise = User.find({
            createdAt: {
                $gte: thisMonth.start, $lte: thisMonth.end
            }
        });
        const lastMonthUsersPromise = User.find({
            createdAt: {
                $gte: lastMonth.start, $lte: lastMonth.end
            }
        });

        const thisMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: thisMonth.start, $lte: thisMonth.end
            }
        });
        const lastMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: lastMonth.start, $lte: lastMonth.end
            }
        });

        const lastSixMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: sixMonthsAgo, $lte: today
            }
        });

        const latestTransactionsPromise = Order.find({}).limit(4).select(["orderItems","discount","total","status"]);

        const [thisMonthProducts, thisMonthUsers, thisMonthOrders, lastMonthProducts, lastMonthUsers, lastMonthOrders, productsCount, usersCount, allOrders, lastSixMonthOrders,categories,femaleUsersCount,latestTransaction] = await Promise.all([
            thisMonthProductsPromise,
            thisMonthUserPromise,
            thisMonthOrdersPromise,
            lastMonthProductsPromise,
            lastMonthUsersPromise,
            lastMonthOrdersPromise,
            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total"),
            lastSixMonthOrdersPromise,
            Product.distinct("category"),
            User.countDocuments({gender: "female"}),
            latestTransactionsPromise
        ]);

        const thisMonthRevenue = thisMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
        const lastMonthRevenue = lastMonthOrders.reduce((total, order) => total + (order.total || 0), 0);

        const changePercent = {
            revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
            product: calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
            user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
            order: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length)
        };

        const revenue = allOrders.reduce((total, order) => total + (order.total || 0), 0);
        const count = {
            revenue,
            user: usersCount,
            product: productsCount,
            order: allOrders.length
        };

        const orderMonthCounts = getChartData({length:6,today,docArr:lastSixMonthOrders});
        const orderMonthlyRevenue = getChartData({length:6,today,docArr:lastSixMonthOrders,property:"total"});

        const categoryCount = await getInventories({categories, productsCount});

        const userRatio = {
            male: usersCount - femaleUsersCount,
            female: femaleUsersCount
        };

        const modifiedLatestTransaction = latestTransaction.map(i => ({
            _id: i._id,
            discount: i.discount,
            amount: i.total,
            quantity: i.orderItems.length,
            status: i.status
        }));

        stats = {
            categoryCount,
            changePercent,
            count,
            chart: {
                order: orderMonthCounts,
                revenue: orderMonthlyRevenue
            },
            userRatio,
            modifiedLatestTransaction,
        };
        nodeCache.set("admin-stats", JSON.stringify(stats));
    }
    return res.status(200).json({success:true, stats});
});

export const getPieCharts = TryCatch(async (req, res, next) => {
    let charts;
    if(nodeCache.has("admin-pie-chart")) charts = JSON.parse(nodeCache.get("admin-pie-chart")!);
    else {
        const [processingOrder,shippedOrder,deliveredOrder,categories,productsCount,outOfStock,allOrders,allUsers,adminUsers,customerUsers] = await Promise.all([
            Order.countDocuments({status: "Processing"}),
            Order.countDocuments({status: "Shipped"}),
            Order.countDocuments({status: "Delivered"}),
            Product.distinct("category"),
            Product.countDocuments(),
            Product.countDocuments({stock: 0}),
            Order.find({}).select(["total","discount","subtotal","tax","shippingCharges"]),
            User.find({}).select(["dob"]),
            User.countDocuments({role: "admin"}),
            User.countDocuments({role: "user"})
        ]);

        const orderFullfillment = {
            processing: processingOrder,
            shipped: shippedOrder,
            delivered: deliveredOrder
        };

        const productCategories = await getInventories({categories, productsCount});

        const stockAvailability = {
            inStock: productsCount - outOfStock,
            outOfStock
        };

        const totalGrossIncome = allOrders.reduce((prev, order) => prev + (order.total || 0), 0);
        const discount = allOrders.reduce((prev, order) => prev + (order.discount || 0), 0);
        const productionCost = allOrders.reduce((prev, order) => prev + (order.shippingCharges || 0), 0);
        const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
        const marketingCost = Math.round(totalGrossIncome * (30 / 100));
        const netMargin = totalGrossIncome - discount - productionCost - burnt - marketingCost;
        const revenueDistribution = {
            netMargin,
            discount,
            productionCost,
            burnt,
            marketingCost
        };

        const usersAgeGroup = {
            teen: allUsers.filter(i => i.age < 20).length,
            adult: allUsers.filter(i => i.age >=20 && i.age < 40).length,
            old: allUsers.filter(i => i.age >= 20).length
        };

        const adminCustomer = {
            admin: adminUsers,
            customer: customerUsers

        };

        charts = {
            orderFullfillment,
            productCategories,
            stockAvailability,
            revenueDistribution,
            usersAgeGroup,
            adminCustomer
        }

        nodeCache.set("admin-pie-chart", JSON.stringify(charts));
    }
    return res.status(200).json({success:true, charts});
});

export const getBarCharts = TryCatch(async (req, res, next) => {
    let charts;
    const key = "admin-bar-chart";
    if(nodeCache.has(key)) charts = JSON.parse(nodeCache.get(key)!);
    else {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
;
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const sixMonthProductsPromise = Product.find({
            createdAt: {
                $gte: sixMonthsAgo, $lte: today
            }
        });
        const sixMonthUsersPromise = User.find({
            createdAt: {
                $gte: sixMonthsAgo, $lte: today
            }
        }).select("createdAt");
        const twelveMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: twelveMonthsAgo, $lte: today
            }
        });

        const [products,users,orders] = await Promise.all([
            sixMonthProductsPromise,
            sixMonthUsersPromise,
            twelveMonthOrdersPromise
        ]);

        const productCounts = getChartData({length:6, docArr:products, today});
        const userCounts = getChartData({length:6, docArr:users, today});
        const orderCounts = getChartData({length:12, docArr:orders, today});

        charts = {
            users: userCounts,
            products: productCounts,
            orders: orderCounts
        };
        nodeCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({success: true, charts});
});

export const getLineCharts = TryCatch(async (req, res, next) => {
    let charts;
    const key = "admin-line-chart";
    if(nodeCache.has(key)) charts = JSON.parse(nodeCache.get(key)!);
    else {
        const today = new Date();
;
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const baseQuery = {
            createdAt: {
                $gte: twelveMonthsAgo, $lte: today
            }
        };

        const [products,users,orders] = await Promise.all([
            Product.find(baseQuery).select("createdAt"),
            User.find(baseQuery).select("createdAt"),
            Order.find(baseQuery).select(["createdAt", "discount", "total"])
        ]);

        const productCounts = getChartData({length:12, docArr:products, today});
        const userCounts = getChartData({length:12, docArr:users, today});
        const discount = getChartData({length:12, docArr:orders, today, property: "discount"});

        const revenue = getChartData({length:12, docArr:orders, today, property: "total"});

        charts = {
            users: userCounts,
            products: productCounts,
            discount,
            revenue
        };
        nodeCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({success: true, charts});
});