const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(
      'mongodb+srv://zaryabzubair_db_user:CzseBq98mMnRDj3h@cluster0.zff7etw.mongodb.net/'
    );
    if (connect.connection) {
      console.log('DB Connected Successfully');
    }
  } catch (error) {
    console.log(`DB Connection Failed ${error}`);
    process.exit(1);
  }
};
connectDb();

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    age: Number,
    isActive: Boolean,
    tags: [String],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
