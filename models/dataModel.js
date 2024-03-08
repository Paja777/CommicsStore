const mongoose = require('mongoose')

const Schema = mongoose.Schema

const dataSchema = new Schema({

    title: {
        type: String,
        required: true
    }, 
    price: {
        type: String,
        required: true
    },
    soldMon: {
        type: Number,
        required: true
    },
    soldYr: {
        type: String,
        required: true
    },
    M$: {
        type: String,
        required: true
    },
    Y$: {
        type: String,
        required: true
    },
});


module.exports = mongoose.model('Data', dataSchema)