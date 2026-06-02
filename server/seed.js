import bcrypt from "bcrypt";
import user from "./models/user.js";
import connectDB from "./db/connection.js";

const register = async () => {
    try {
        connectDB();
        const hashPassword = await bcrypt.hash('admin', 10);
        const newUser = new user({
            name: 'admin',
            email: 'admin@gmail.com',
            password: hashPassword,
            address: 'user address',
            role: "admin"
        });
        await newUser.save();
        console.log('User registered successfully');
    } catch (error) {
        console.log(error);


    }
}
register();