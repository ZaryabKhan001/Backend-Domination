import { Schema, model } from 'mongoose';

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: [100, 'Book Title cannot be more than 100 characters'],
    },
    author: {
      type: String,
      required: [true, 'Book Author is required'],
    },
    year: {
      type: Number,
      required: [true, 'Publication year is required'],
      max: [new Date().getFullYear(), 'Year cannot be a future value'],
    },
  },
  { timestamps: true }
);

const Book = model('Book', bookSchema);
export default Book;
