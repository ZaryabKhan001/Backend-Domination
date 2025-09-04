import Book from '../models/book.model.js';
import Author from '../models/author.model.js';

export const handleCreateAuthor = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const newAuthor = await Author.create({
      name: name,
      bio: bio,
      books: [],
    });

    if (!newAuthor) {
      return res.status(500).json({
        success: false,
        message: 'Failed in creating Author',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Author Created Successfully',
      data: newAuthor,
    });
  } catch (error) {
    console.log('Author Creation Failed', error);
    return res.status(500).json({
      success: false,
      message: 'Author Creation Failed',
    });
  }
};

export const handleCreateBook = async (req, res) => {
  try {
    const { title, price } = req.body;
    const { id } = req.params;
    const newBook = await Book.create({
      title: title,
      price: price,
      author: id,
    });

    if (!newBook) {
      return res.status(500).json({
        success: false,
        message: 'Failed in creating Book',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Book Created Successfully',
      data: newBook,
    });
  } catch (error) {
    console.log('Book Creation Failed', error);
    return res.status(500).json({
      success: false,
      message: 'Book Creation Failed',
    });
  }
};

// get book with book author details
export const handleFetchBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id).populate('author');

    if (!book) {
      return res.status(500).json({
        success: false,
        message: 'Failed in fetching Book',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Fetched Book Successfully',
      data: book,
    });
  } catch (error) {
    console.log('Book Fetch Failed', error);
    return res.status(500).json({
      success: false,
      message: 'Book Fetch Failed',
    });
  }
};
