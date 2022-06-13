const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let BaseActionLending = {
    tx_hash: {type: String, default: '', trim: true},
    block_number: {type: Number, default: 0},
    block_timestamp: {type: Number, default: 0},
    reserve: {type: String, default: '', trim: true},
    user: {type: String, default: '', trim: true},
    on_behalf_of: {type: String, default: '', trim: true},
    amount: {type: Number, default: '', trim: true},
    referral_code: {type: Number, default: '', trim: true},
    created_at: {type: Date, default: new Date()},
    updated_at: {type: Date, default: new Date()},
}

let Supply = new Schema(BaseActionLending, { collection: "supply", versionKey: false});
let Withdraw = new Schema(BaseActionLending, { collection: "withdraw", versionKey: false});
let Borrow = new Schema(BaseActionLending, { collection: "borrow", versionKey: false});
let Repay = new Schema(BaseActionLending, { collection: "repay", versionKey: false});

module.exports.Supply = mongoose.model("Supply", Supply);
module.exports.Borrow = mongoose.model("Borrow", Borrow);
module.exports.Repay = mongoose.model("Repay", Repay);
module.exports.Withdraw = mongoose.model("Withdraw", Withdraw);