const mongoose = require('./db.js');
const Schema = mongoose.Schema;

//账户实体
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String },
    nickname: { type: String },
    status: { type: Number, default: 1 },
    is_deleted: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
