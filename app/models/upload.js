const mongoose = require('mongoose')
const { Schema, model } = require('mongoose')

const uploadSchema = new Schema({
    // title: {
    //     type: String,
    //     required:true
    // },
    //url
    imageUrl: {
        type: String,
        required: true
    },
    // author: {
    //   type:Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true
    // }
}, {
    timestamps: true
})

module.exports = model('Upload', uploadSchema)
