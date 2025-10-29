import { Schema, model } from 'mongoose';

const postSearchSchema = new Schema({});

const PostSearch = model('PostSearch', postSearchSchema);

export default PostSearch;
