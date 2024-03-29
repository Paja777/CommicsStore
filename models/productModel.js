const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({

    category: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }, 
    image: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    
});


module.exports = mongoose.model('Product', productSchema)