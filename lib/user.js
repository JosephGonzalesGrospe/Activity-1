const mongoose = require('mongoose');

var user = {};

mongoose.connect('mongodb://localhost/users')
    .then(() => console.log('Connected to the MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

 const User = mongoose.model('User', new mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    password: String
}));

 user.getOne = async function(phone, cb) {
    await User.findOne({ phone: phone }, (err, res) => {
        if(err) return cb(err);
        cb(res)
    });
 }

 user.createOne = async function(user,cb) {
    const _user = new User({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        password: user.password
    });
    await _user.save((err,res) => {
        if(err) return cb(err);
        cb(res);
    });
 }

 user.editOne = async function(phone, user, cb) {
     const _phone = phone;
    const _user = await User.updateOne({ phone: _phone}, {$set: user});
    cb(_user)
 }

 user.deleteOne = async function(phone, cb) {
    const _phone = phone;
    await User.deleteMany({ phone: _phone}, (err, res) => {
       if(err) return cb(err);
       cb(res)
    });
 }

//  user.createOne(userObj, res=>{
//     console.log(res)
//  })

 module.exports = user;

 