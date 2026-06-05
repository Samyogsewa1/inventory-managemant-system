import User from "../models/User.js";
import bcrypt from "bcrypt";

export const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      address,
      role
    });
    await newUser.save();

    return res
      .status(201)
      .json({ success: true, message: "User added successfully" });
  } catch (error) {
    console.error("Error adding user", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error in getting users" });
  }
};


// ✅ Added deleteUser to match frontend
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error in deleting user" });
  }
};
