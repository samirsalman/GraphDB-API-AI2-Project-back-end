class QueryDocument {
  constructor(uri, title, year, authors, isbn, issn, edit, journ, pub, booktitle, type) {
    this.uri = uri;
    this.title = title;
    this.year = year;
    this.authors = authors;
    this.isbn = isbn;
    this.issn = issn;
    this.edit = edit;
    this.journ = journ;
    this.pub = pub;
    this.booktitle = booktitle;
    this.type = type;
  }
}

module.exports = QueryDocument;
