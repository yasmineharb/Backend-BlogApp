const mongoose = require('mongoose')

const Article = mongoose.model('Article' , {
    title : {
        type: String
    },
    idAuthor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
    },
    description : {
        type: String
    },
    date : {
        type: String,
        default: Date.now
    },
    content : {
        type: String
    },
    image : {
        type: String
    },
    tags : {
        type: Array
    },
    comments: [
        {
            idAuthor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Author',
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
})

module.exports = Article; 