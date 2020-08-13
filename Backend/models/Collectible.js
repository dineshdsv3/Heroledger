const mongoose = require('mongoose')

const collectibleSchema = mongoose.Schema(({
    collectibleId: {
        type: String,
        required: true,
        trim: true
    },
    collectibleName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    comicNames: {
        type: Array,
        required: true,
        trim: true
    },
    IssueNum: {
        type: Array,
        required: true,
        trim: true
    },
    ticker: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: Array,
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
        type: Array,
        required: true,
        trim: true
    },
    gradeId: {
        type: Array,
        required: true,
        trim: true
    },
    gradeInfo: {
        type: Array,
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
    },
    isAvailable: {
        type: Boolean,
        required: true,
        trim: true
    },
    ownerAddress: {
        type: String,
        required: true,
        trim: true
    },
    transactionHistory: {
        type: Array
    }
}))

const Collectible = mongoose.model('collectible', collectibleSchema)

module.exports = Collectible