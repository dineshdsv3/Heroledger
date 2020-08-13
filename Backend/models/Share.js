const mongoose = require('mongoose');

const shareSchema = mongoose.Schema(({
    collectibleId: {
        type: Number,
        required: true,
    },
    collectibleName: {
        type: String,
        required: true
    },
    totalShares: {
        type: Number,
        required: true
    },
    outstandingShares: {
        type: Number,
        required: true
    },
    sharesAllocation: mongoose.Schema.Types.Mixed
}))

const Share = mongoose.model('share', shareSchema)

module.exports = Share;