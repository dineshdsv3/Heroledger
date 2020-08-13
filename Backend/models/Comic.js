const mongoose = require('mongoose')

const comicSchema = mongoose.Schema(({
    comicId: {
        type: String,
        required: true,
        trim: true
    },
    comicName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    IssueNum: {
        type: String,
        required: true,
        trim: true
    },
    ticker: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    fullDescription: {
        type: String,
        required: true,
    },
    USDPrice: {
        type: Number,
        required: true,
        trim: true
    },
    ETHPrice: {
        type: String,
        required: true,
        trim: true
    },
    grade: {
        type: String,
        required: true,
        trim: true
    },
    gradeId: {
        type: String,
        required: true,
        trim: true
    },
    gradeInfo: {
        type: String,
        required: true,
        trim: true
    },
    totalShares: {
        type: String,
        required: true,
        trim: true
    },
    outstandingShares: {
        type: String,
        required: true,
        trim: true
    },
    pricePerShare: {
        type: String,
        required: true,
        trim: true
    },
    investmentType: {
        type: String,
        required: true,
        trim: true
    },
    votingType: {
        type: String,
        required: true,
        trim: true
    },
    hash: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: String,
        required: true,
        trim: true
    }
}))

const Comic = mongoose.model('comic', comicSchema)

module.exports = Comic