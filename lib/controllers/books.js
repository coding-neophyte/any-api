const { Router } = require('express');
const Book = require('../models/Book');

module.exports = Router().post('/', async (req, res, next) => {
  try{
    const book = await Book.insert({
      title: req.body.title,
      author: req.body.author,
      year_released: req.body.year_released,
      category: req.body.category,
    });

    res.send(book);
  }catch(error){
    next(error);
  }

})
  .get('/', async (req, res, next) => {
    try{
      const getBooks = await Book.getAllBooks();
      res.send(getBooks);
    }catch(error){
      next(error);
    }
  })

  .get('/:id', async (req, res, next) => {
    try{
      const { id } = req.params;
      const singleBook = await Book.bookById(id);

      res.send(singleBook);
    }catch(error){
      next(error);
    }

  })
  .patch('/:id', async (req, res, next) => {
    try{
      const { id } = req.params;
      const existingBook = await Book.bookById(id);

      if(!existingBook) return res.status(404).json({
        message: 'book not found'
      });

      const updatedBook = await Book.updateBook(existingBook.id, {
        title: req.body.title,
        author: req.body.author,
        year_released: req.body.year_released,
        category: req.body.category,
      });

      res.send(updatedBook);
    }catch(error){
      next(error);
    }
  })
  .delete('/:id', async (req, res, next) => {
    try{
      const { id } = req.params;
      const deletedBook = await Book.deleteBook(id);

      res.send(deletedBook);
    }catch(error){
      next(error);
    }
  });
