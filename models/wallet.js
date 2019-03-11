const Joi = require('joi');
const mongoose = require('mongoose');

const Wallet = mongoose.model('Wallet', new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}).pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
}));

function validateWallet(Wallet) {
    const schema = {
        amount: Joi.number().min(0).required(),
        user: Joi.objectId().required(),
        isActive: Joi.boolean()
    };
    return Joi.validate(Wallet, schema);
}

function validateWalletUpdate(Wallet) {
    const schema = {
        amount: Joi.number().min(0).required(),
        isActive: Joi.boolean()
    };
    return Joi.validate(Wallet, schema);
}

exports.Wallet = Wallet;
exports.validate = validateWallet;
exports.validateWalletUpdate=validateWalletUpdate;