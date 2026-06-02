import Mongoose  from "mongoose";

const connectDB = async () =>{
    try{
        await  Mongoose.connect(process.env.MONGO_URI) ;
        console.log('connected to database');
     } catch (error) {
        console.error('conection fail', error.message);
        process.exit(1);
     }
}
export default connectDB;