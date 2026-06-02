import Supplier from "../models/Supplier.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, supplierId, categoryId } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      supplierId,
      categoryId,
    });
    await newProduct.save();

    return res
      .status(201)
      .json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};  

export const getProducts = async (req, res) => {
  try {

    const pipeline_product = {
      $lookup : {
        from : "categories", 
        localField  : "categoryId",
        foreignField : "_id",
        as : "product-category"
      }
    }
    const products = await Product.pipeline([pipeline_product]);
    const suppliers = await Supplier.find();
    const categories = await Category.find();
    return res.status(200).json({ success: true, products, suppliers, categories });
  } catch (error) {
    console.error("Error fetching suppliers & categories", error);  
    return res
      .status(500) 
      .json({ success: false, message: "Server error in getting suppliers & categories" });
  } 
};   