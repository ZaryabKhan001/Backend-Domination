import { Schema, model } from 'mongoose';

const postSearchSchema = new Schema(
  {
    postId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

postSearchSchema.index({ content: 'text' });
postSearchSchema.index({ createdAt: -1 });

const PostSearch = model('PostSearch', postSearchSchema);

export default PostSearch;
