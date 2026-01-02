import Book from '../models/book.model.js';

export const getAllBooks = async (req, res) => {
  try {
    const allbooks = await Book.find({});
    if (allbooks && allbooks.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'All books fetched Successfully',
        data: allbooks,
      });
    }
    if (allbooks && allbooks.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No Books found in DB',
      });
    }
  } catch (error) {
    console.log('Error in fetching all books', error);
    return res.status(500).json({
      success: false,
      message: 'Error in fetching all books',
    });
  }
};

export const getBook = async (req, res) => {
  const { id } = await req.params;
  try {
    const book = await Book.find({ _id: id });
    if (book && book.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Book fetched successfully',
        data: book,
      });
    }
    return res.status(404).json({
      success: false,
      message: 'No book Found',
    });
  } catch (error) {
    console.log('Error in fetching book', error);
    return res.status(500).json({
      success: false,
      message: 'Error in fetching book',
    });
  }
};

export const addNewBook = async (req, res) => {
  try {
    const { title, author, year } = req.body;
    const newBook = await Book.create({ title, author, year });
    if (newBook) {
      console.log('Book created successfully');
      return res.status(200).json({
        success: true,
        message: 'Book created successfully',
        data: newBook,
      });
    }
    return res.status(404).json({
      success: false,
      message: 'Book creation failed',
    });
  } catch (error) {
    console.log('Error in book creation', error);
    return res.status(500).json({
      success: false,
      message: 'Error in book creation',
    });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = await req.params;
    const bookData = req.body;
    const updatedBook = await Book.findByIdAndUpdate(id, bookData, {
      new: true,
    });
    if (updatedBook) {
      return res.status(200).json({
        success: true,
        message: 'Book Updated Successfully',
        data: updatedBook,
      });
    }
    return res.status(404).json({
      success: false,
      message: 'Book Updated failed. Maybe book is not present in DB.',
    });
  } catch (error) {
    console.log('Error in book updation', error);
    return res.status(500).json({
      success: false,
      message: 'Error in book updation',
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = await req.params;
    const deletedBookId = await Book.findByIdAndDelete(id);
    if (deletedBookId) {
      return res.status(200).json({
        success: true,
        message: 'Book Deleted Successfully',
      });
    }
    return res.status(404).json({
      success: false,
      message: 'Book Deletion failed',
    });
  } catch (error) {
    console.log('Error in book deletion', error);
    return res.status(500).json({
      success: false,
      message: 'Error in book deletion',
    });
  }
};
