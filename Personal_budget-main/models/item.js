const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { type: String, required: [true, 'Category name is required'] },
    budget: { type: Number, required: [true, 'Budget is required'], default: 0 },
    expense: { type: Number, default: 0 },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    month: { type: String, required: [true, 'Month is required'] },
}, { timestamps: true });

module.exports = mongoose.model('Item', categorySchema);
