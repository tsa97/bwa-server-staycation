// import mongoose from 'mongoose';
// const { Schema } = mongoose;

const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    imageUrl : {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Image', imageSchema)
    
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