const bycrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");


// 1. import mongoose 
const mongoose = require("mongoose");

// 2. create Schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

userSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        // 암호화       
        bycrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
                return next(err)
            };
            bycrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});

userSchema.methods.comparePassword = function (plainPassword, callback) {
    console.log("cp1");
    bycrypt.compare(plainPassword, this.password, function (err, isMatched) {
        if (err) return callback(err),
            console.log("cp2");
        callback(null, isMatched);
    });
}

userSchema.methods.generateToken = function (callback) {

    const user = this;
    // jwt 이용해서 토큰 생성
    const token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    user.save(function (err, user) {
        if (err) return callback(err);
        callback(null, user);
    })

};

userSchema.statics.findByToken = function (token, callback) {
    const user = this;

    // 1. 토큰 decode
    jwt.verify(token, 'secretToken', function (err, decoded) {
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return callback(err);
            callback(null, user);
        })
    })
}

// 3. wrap by model and export
const User = mongoose.model('User', userSchema);

module.exports = { User };