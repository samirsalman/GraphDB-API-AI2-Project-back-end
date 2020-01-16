class QueryDocument {
  constructor(uri, title, year, authors, isbn) {
    this.uri = uri;
    this.title = title;
    this.year = year;
    this.authors = authors;
    this.isbn = isbn;
  }
}

module.exports = QueryDocument;
