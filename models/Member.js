// import mongoose from 'mongoose';
// const { Schema } = mongoose;

const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    phoneNumber : {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Member', memberSchema)
    
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