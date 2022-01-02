var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema ({
    content: { type: String },
    likes: { type: Number, default: 0, required: 0 },
    articleId: String,
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

module.exports = mongoose.model('Comment', commentSchema);