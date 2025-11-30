const mongoose = require("mongoose")
const data = require("./data.js")
const Listing = require('../models/listing.js')


main()
.then(()=>{
    console.log("Connection is established")
})
.catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}


async function insertdata(){
    await Listing.deleteMany({})
    const datu =data.data.map((data)=>({...data,owner:"6912d828ad89a25dd26ad96b"}))
    await Listing.insertMany(datu)
    .then(()=>{
        console.log("data is inserted")
    })
    .catch((err)=>{
        console.log(err)
    })
}

insertdata()