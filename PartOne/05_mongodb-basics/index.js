const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');

const app = express();
const port = process.env.PORT || 3001;

dotenv.config();

//* Db connection
// const connectDb = async () => {
//   try {
//     const connect = await mongoose.connect(process.env.MONGODB_URI);
//     if (connect.connection) {
//       console.log('DB Connected Successfully');
//     }
//   } catch (error) {
//     console.log(`DB Connection Failed ${error}`);
//     process.exit(1);
//   }
// };
// connectDb();

//* User schema
// const userSchema = new mongoose.Schema(
//   {
//     name: String,
//     email: String,
//     age: Number,
//     isActive: Boolean,
//     tags: [String],
//   },
//   { timestamps: true }
// );

// const User = mongoose.model('User', userSchema);

// const runQueryExample = async () => {
//   try {
//     const newUser = await User.create({
//       name: 'Zaryab',
//       email: 'zaryabz043@gmail.com',
//       age: 22,
//       isActive: true,
//       tags: ['developer', 'designer'],
//     });
//   } catch (error) {
//     console.log('Error creating User', error);
//   }
// };
// runQueryExample();

//* get all users
// const allUsers = await User.find({});

//* get all users who are active
// const allUsers = await User.find({isActive: true});

//* first user which is active
// const allUsers = await User.findOne({isActive: true});

//* update one user
// db.users.updateOne(
//   { email: "zaryab@example.com" },
//   { $set: { name: "New Name" } }
// )

//* update many users
// db.users.updateMany(
//   { role: "guest" },
//   { $set: { name: "Updated Guest" } }
// )

//* delete one
// db.users.deleteOne(
// { email: "zaryab@example.com" }
// )

//* delete many
// db.users.deleteMany(
//   { role: "guest" }
// )

app.listen(port, () => {
  console.log(`App is listening on Port: ${port}`);
});
