const mongoose = require('./db.js');
const Schema = mongoose.Schema;

//账户实体
const exampleSchema = new mongoose.Schema({
    title: { type: String },
    subtitle: { type: String },
    cover: { type: String },
    content: { type: String },
    type: { type: String },
    publish_date: { type: Number, default: Date.now() },
    is_deleted: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const exampleModel = mongoose.model('example', exampleSchema);
module.exports = exampleModel;
