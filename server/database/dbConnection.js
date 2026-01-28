import mongoose from "mongoose";
export const connection  = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName : "MERN_AUTHENTICATION",
    }).then(()=>{
        console.log("connected to database");
    }).catch(err=>{
        console.log(`some error occured while connecting with database  `,err)
    })
}