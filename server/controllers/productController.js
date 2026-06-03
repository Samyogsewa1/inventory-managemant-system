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

  
    const products = await Product.find({ isDeleted: false }).populate("categoryId", "categoryName").populate ("supplierId", "name");
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

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, supplierId, categoryId } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, stock, supplierId, categoryId },
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error updating product", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (existingProduct.isDeleted) {
      return res
        .status(400)
        .json({ success: false, message: "Product is already deleted" });
    }

    await Product.findByIdAndUpdate(id, { isDeleted: true });

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error in deleting product" });
  }
};
