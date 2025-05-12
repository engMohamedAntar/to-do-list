//userModel.js
const mongoose= require('mongoose');
const bcrypt= require('bcrypt');

const userSchema= new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  passwordChangedAt: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
   type: String,
   enum: ['admin', 'user'],
   default: 'user',
  }
},{timestamps:true});

userSchema.pre('save', async function(next) {
  this.password= await bcrypt.hash(this.password, 12);
  next();
}); 

module.exports= mongoose.model('User', userSchema);