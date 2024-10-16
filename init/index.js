const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

let mongo_url ="mongodb://127.0.0.1:27017/airbnb";

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log("some error to connect DB",err);
})
async function main() {
    await mongoose.connect(mongo_url)
    
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj, owner: "670b71b3755dd5bf478281b3"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialize");

}

initDB();