import Product from "../models/Product.js";
import OrderModel from "../models/order.js";

export const getData = async (req, res) => {
  try {
    // total products
    const totalProducts = await Product.countDocuments();

    // total stock
    const stockResult = await Product.aggregate([
      { $group: { _id: null, totalStock: { $sum: "$stock" } } }
    ]);
    const totalStock = stockResult[0]?.totalStock || 0;

    // orders today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const ordersToday = await OrderModel.countDocuments({
      orderDate: { $gte: startOfDay, $lte: endOfDay }
    });

    // total revenue
    const revenueResult = await OrderModel.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);
    const revenue = revenueResult[0]?.totalRevenue || 0;

    // out of stock products
    const outOfStock = await Product.find({ stock: 0 })
      .select("name stock")
      .populate("categoryId", "categoryName");

    // highest sale product
    const highestSale = await OrderModel.aggregate([
      { $group: { _id: "$product", totalSold: { $sum: "$quantity" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },
      {
        $project: {
          name: "$product.name",
          category: "$category.categoryName",
          totalSold: "$totalSold"
        }
      }
    ]);
    const highestSaleProduct = highestSale[0] || { message: "No sale data available" };

    // low stock products
    const lowStock = await Product.find({ stock: { $gt: 0, $lt: 5 } })
      .select("name stock")
      .populate("categoryId", "categoryName");

    // response
    const dashboardData = {
      totalProducts,
      totalStock,
      ordersToday,
      revenue,
      outOfStock,
      highestSaleProduct,
      lowStock
    };

    return res.status(200).json({ success: true, dashboardData });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ success: false, message: "Error fetching dashboard summary" });
  }
};
