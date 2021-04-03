// import mongoose from 'mongoose';
// const { Schema } = mongoose;

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function (next) {
    const user = this;
    // mau cek apakah password sdh diubah?
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
})

module.exports = mongoose.model('User', userSchema)
    
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