const mongoose = require('./db.js');
const Schema = mongoose.Schema;

//账户实体
const pictureSchema = new mongoose.Schema({
    filename: { type: String },
    filepath: { type: String },
    is_deleted: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const pictureModel = mongoose.model('picture', pictureSchema);
module.exports = pictureModel;
