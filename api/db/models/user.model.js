const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const jwtSecret = '7yhgdyuolkas98y3798dhi783h879908hj';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    sessions: [{
        token: {
            type: String,
            required: true
        },
        expireTime: {
            type: Number,
            required: true
        }
    }],
    email: {
        type: String,
        required: false,
        minlength: 5
    }
});

// Instance Methods

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    // return the document except the password and sessions (these shouldn't be made available)
    return _.omit(userObject, ['password', 'sessions']);
}

UserSchema.methods.generateAccessAuthToken = function () {
    const user = this;
    return new Promise((resolve, reject) => {
        // Create the JSON Web Token and return that
        jwt.sign({ _id: user._id.toHexString() }, jwtSecret, { expiresIn: "15m" }, (err, token) => {
            if (!err) {
                resolve(token);
            } else {
                // there is an error
                reject('Access token failed to generate');
            }
        })
    })
}

UserSchema.methods.generateRefreshAuthToken = function () {
    // This method simply generates a 64byte hex string - it doesn't save it to the database. saveSessionToDatabase() does that.
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (!err) {
                // no error
                let token = buf.toString('hex');
                return resolve(token);
            } else {
                // there is an error
                reject('Refresh token failed to generate');
            }
        })
    })
}

UserSchema.methods.createSession = function () {
    let user = this;

    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken);
    }).then((refreshToken) => {
        // saved to database successfully
        // now return the refresh token
        return refreshToken;
    }).catch((err) => {
        return Promise.reject('Failed to save session to database.\n' + err);
    })
}

/* MODEL METHODS (static methods) */

UserSchema.statics.findByIdAndToken = function (_id, token) {
    // finds user by id and token
    // used in auth middleware (verifySession)

    const User = this;

    return User.findOne({
        _id,
        'sessions.token': token
    });
}

UserSchema.statics.getJWTSecret = () => {
    return jwtSecret;
}

UserSchema.statics.findByCredentials = function (username, password) {
    let User = this;
    return User.findOne({ username }).then((user) => {
        if (!user) return Promise.reject();

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                }
                else {
                    reject(err);
                }
            })
        })
    })
}

UserSchema.statics.hasRefreshTokenExpired = (expireTime) => {
    let secondsSinceEpoch = Date.now() / 1000;
    if (expireTime > secondsSinceEpoch) {
        // is valid
        return false;
    } else {
        // has expired
        return true;
    }
}

/* MIDDLEWARE */
// This runs before anything is saved
UserSchema.pre('save', function (next) {
    let user = this;
    let costFactor = 10;

    // if the password field has been edited/changed 
    if (user.isModified('password')) {

        // Generate salt and hash password
        bcrypt.genSalt(costFactor, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
});

/* HELPER METHODS */
let saveSessionToDatabase = (user, refreshToken) => {
    // Save session to database
    return new Promise((resolve, reject) => {
        let expireTime = generateRefreshTokenExpireTime();

        user.sessions.push({ 'token': refreshToken, expireTime });

        user.save().then(() => {
            // saved session successfully
            return resolve(refreshToken);
        }).catch((err) => {
            reject(err);
        });
    })
}

let generateRefreshTokenExpireTime = () => {
    let daysUntilExpire = "10";
    let secondsUntilExpire = ((daysUntilExpire * 24) * 60) * 60;
    return ((Date.now() / 1000) + secondsUntilExpire);
}

const User = mongoose.model('User', UserSchema);

module.exports = { User }