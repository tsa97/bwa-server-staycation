// import mongoose from 'mongoose';
// const { Schema } = mongoose;

const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
    nameBank : {
        type: String,
        required: true
    },
    nomorRekening : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    imageUrl : {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Bank', bankSchema)
    
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