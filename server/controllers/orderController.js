

import Product from "../models/product.js";
import Order from "../models/order.js";

const addOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // check stock
    if (quantity > product.stock) {
      return res.status(400).json({ success: false, message: "Not enough stock available" });
    }

    // reduce stock
    product.stock -= quantity;
    await product.save();

    // calculate total price safely
    const totalPrice = product.price * quantity;

    // create order
    const orderObject = new Order({
      customer: userId,
      product: productId,
      quantity,
      totalPrice,
      orderDate: Date.now(),
    });

    await orderObject.save();

    return res.status(200).json({ success: true, message: "Order added successfully", order: orderObject });
  } catch (error) {
    console.error("Error adding order", error);
    res.status(500).json({ success: false, message: "An error occurred while adding the order." });
  }
};
const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    let query = {};
    if (req.user.role === "customer"){
      query = {customer: userId}
    }
    const orders = await Order.find(query).populate({path: "product", populate: 
      {
        path:"categoryId",
        select: "categoryName"
      }, select: "name price"}).populate("customer", "name email"); 
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching orders." });
  }
}

export { addOrder, getOrders };
