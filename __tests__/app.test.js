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


});
