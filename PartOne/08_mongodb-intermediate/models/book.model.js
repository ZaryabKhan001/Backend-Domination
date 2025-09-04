import { Schema, model } from 'mongoose';

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Book Price must be a positive number'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
      required: true,
    },
  },
  { timestamps: true }
);

const Book = model('Book', bookSchema);

export default Book;
