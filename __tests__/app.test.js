const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Book = require('../lib/models/Book');

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should add new book', async () => {
    const res = await request(app)
      .post('/api/v1/books')
      .send({
        title: '48 Laws of Power',
        author: 'Robert Greene',
        year_released: 1998,
        category: 'self help',
      });

    expect(res.body).toEqual({
      id: expect.any(String),
      title: '48 Laws of Power',
      author: 'Robert Greene',
      year_released: 1998,
      category: 'self help',
    });
  });

  it('should get all books', async () => {
    const newBook = await Book.insert({
      title: 'Thinking fast and slow',
      author: 'Daniel Kahnenman',
      year_released: 2011,
      category: 'psychology'
    });
    const res = await request(app).get('/api/v1/books');
    expect(res.body).toEqual([newBook]);
  });

  it('should get book by id', async () => {
    const singleBook = await Book.insert({
      title: 'color of law',
      author: 'richard rothstein',
      year_released: 2017,
      category: 'sociology'
    });
    const res = await request(app).get(`/api/v1/books/${singleBook.id}`);

    expect(res.body).toEqual(singleBook);
  });

  it('should update existing book', async () => {
    const newBook = { title: 'power of habit',
      author: 'charles duhigg',
      year_released: 2011,
      category: 'psychology',
    };
    const bookToUpdate = await Book.insert(newBook);

    const res = await request(app).patch(`/api/v1/books/${bookToUpdate.id}`).send({ title: 'laws of nature',
      author: 'robert greene',
      year_released: 2019,
      category: 'psychology', });

    const expectedBook = {
      id: expect.any(String),
      title: 'laws of nature',
      author: 'robert greene',
      year_released: 2019,
      category: 'psychology',
    };

    expect(res.body).toEqual(expectedBook);

    expect(await Book.bookById(bookToUpdate.id)).toEqual(expectedBook);
  });
  it('should delete a book', async () => {
    const newBook = await Book.insert({
      title: 'power of habit',
      author: 'charles duhigg',
      year_released: 2011,
      category: 'psychology',
    });
    const res = await request(app).delete(`/api/v1/books/${newBook.id}`);

    expect(res.body).toEqual(newBook);
    expect(await Book.bookById(newBook.id)).toBeNull();
  });

});
