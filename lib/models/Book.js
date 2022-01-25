const pool = require('../utils/pool');


module.exports = class Book {
  id;
  title;
  author;
  year_released;
  category;

  constructor(row){
    this.id = row.id;
    this.title = row.title;
    this.author = row.author;
    this.year_released = row.year_released;
    this.category = row.category;
  }

  static async insert({ title, author, year_released, category }) {

    const { rows } = await pool.query(`INSERT INTO books
  (title, author, year_released, category)
  VALUES ($1, $2, $3, $4)
  RETURNING *`, [title, author, year_released, category]
    );
    return new Book(rows[0]);

  }

  static async getAllBooks(){
    const { rows } = await pool.query('SELECT * FROM books');
    return rows.map((row) => new Book(row));
  }


  static async bookById(id){
    const { rows } = await pool.query(`SELECT * FROM books
      WHERE id=$1
      RETURNING *`, [id]);

    return new Book(rows[0]);
  }

  static async updateBook(id, { title, author, year_released, category }){
    const { rows } = await pool.query(`UPDATE books
      SET title=$1, author=$2, year_released=$3, category=$4)
     WHERE id=$5
     RETURNING *`, [id, title, author, year_released, category]);
    if(!rows[0]) return null;
    
    return new Book(rows[0]);
  }

  static async deleteBook(id){
    const { rows } = await pool.query(`DELETE FROM books
      WHERE id=$1
      RETURNING *`, [id]);

    return new Book(rows[0]);
  }
};
