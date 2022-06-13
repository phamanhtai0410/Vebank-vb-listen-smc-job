'use strict';

const fs = require('fs');
const path = require("path");
const Conf = require('../config');
const mongoose = require('mongoose');
const {Supply} = require("../models/LedingAct");


let handleActionLendings = async function(msg) {
    let data={}, timeNow, dateNow;
    dateNow = new Date();
    timeNow = parseInt(Date.now() / 1000);
    data = {
        tx_hash: msg.meta.txID,
        block_number: msg.meta.blockNumber,
        block_timestamp: msg.meta.blockTimestamp,
        reserve: msg.returnValues.reserve.toLowerCase(),
        user: msg.returnValues.user.toLowerCase(),
        on_behalf_of: msg.returnValues.onBehalfOf.toLowerCase(),
        amount: msg.returnValues.amount,
        referral_code: msg.returnValues.referralCode,
        created_at: dateNow,
        updated_at: dateNow
    };
    try{
      await mongoose.connect(
        'mongodb://vb-lending-write:nKQSdP7hfwHK6VWP@ec2-54-254-59-167.ap-southeast-1.compute.amazonaws.com:27017/vb-lending', 
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );

        let newSupply = new Supply(data);
        newSupply.save(function(err) {
          if (err) throw err;
          console.log('Supply successfully saved.');
        });
    } catch (err) {
        console.log("err: ", err)
        throw err
    }
    
}

let msg1 = {
    address: '0xca7cf7e0fd4e071ca672b8bf5d52672667b72c16',
    meta: {
      blockID: '0x00be5c716c74be012f89974a8800831c6e1232f08affc1c545e38263c3910bc0',
      blockNumber: 12475505,
      blockTimestamp: 1654786400,
      txID: '0xed3267c41dfc817f828306648a5bff9b860973e0597b4ee4c6dd982d1c9c7ed3',
      txOrigin: '0x4c22c624d4f28837dc32311b22384f14d9176583',
      clauseIndex: 0
    },
    removed: false,
    returnValues:  {
      '0': '0x033BBC923A9378600C6b52Fa9aADA608c4cC7ECE',
      '1': '0x4c22c624D4f28837dC32311b22384F14d9176583',
      '2': '0x4c22c624D4f28837dC32311b22384F14d9176583',
      '3': '2000000',
      '4': '0',
      reserve: '0x033BBC923A9378600C6b52Fa9aADA608c4cC7ECE',
      user: '0x4c22c624D4f28837dC32311b22384F14d9176583',
      onBehalfOf: '0x4c22c624D4f28837dC32311b22384F14d9176583',
      amount: '2000000',
      referralCode: '0'
    },
    event: 'Supply',
    signature: '0x2b627736bca15cd5381dcf80b0bf11fd197d01a037c52b927a881a10fb73ba61',
    raw: {
      data: '0x0000000000000000000000004c22c624d4f28837dc32311b22384f14d917658300000000000000000000000000000000000000000000000000000000001e8480',
      topics: [
        '0x2b627736bca15cd5381dcf80b0bf11fd197d01a037c52b927a881a10fb73ba61',
        '0x000000000000000000000000033bbc923a9378600c6b52fa9aada608c4cc7ece',
        '0x0000000000000000000000004c22c624d4f28837dc32311b22384f14d9176583',
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      ]
    }
  }


let main = async function() {
  await handleActionLendings(msg1);
  console.log("done")
};
main();