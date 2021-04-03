// import mongoose from 'mongoose';
// const { Schema } = mongoose;

const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const categorySchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    itemId:[{
        type:ObjectId,
        ref: 'Item'
    }]
});

module.exports = mongoose.model('Category', categorySchema)
    
    // title:  String, // String is shorthand for {type: String}
    // author: String,
    // body:   String,
    // comments: [{ body: String, date: Date }],
    // date: { type: Date, default: Date.now },
    // hidden: Boolean,
    // meta: {
    //   votes: Number,
    //   favs:  Number
    // }
//   });