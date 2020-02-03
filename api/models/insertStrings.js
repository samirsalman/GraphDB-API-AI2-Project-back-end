const md5Hash = require("blueimp-md5");

class InsertStrings {
  /*Update Book with these: title, authors, publisher, year (optional), isbn (optional)*/
  insertBookQuery = (
    title,
    author = null,
    publisher = null,
    year = null,
    isbn = null
  ) => {
    var authorsConc = "";
    var publisherIns = "";
    var isbnIns = "";

    if (author !== null) {
      for (var i = 0; i < author.lenght; i++) {
        authorsConc += author[i].name;
        console.log("AUTORE:", author[i]);
      }
    }

    var uriDocument = md5Hash(
      title.toString() + authorsConc.toString() + year.toString()
    );

    var authorString = "";

    author.map(el => {
      authorString += `<http://purl.org/ontology/bibo/${uriDocument}>  dc0:creator <http://purl.org/ontology/bibo/${el.authUri}> . `;
    });

    if (publisher !== null) {
      publisherIns = `<http://purl.org/ontology/bibo/${uriDocument}> dc0:publisher "${publisher.toString()}" .`;
    }
    if (isbn !== null) {
      isbnIns = `<http://purl.org/ontology/bibo/${uriDocument}> bibo:isbn "${isbn}" .`;
    }

    return `PREFIX bibo: <http://purl.org/ontology/bibo/>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX dc0: <http://purl.org/dc/terms/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        
        INSERT DATA
              { 
                  <http://purl.org/ontology/bibo/${uriDocument}>          rdf:type bibo:Book .
                  ${authorString}
                  <http://purl.org/ontology/bibo/${uriDocument}>          dc:title "${title.toString()}" .
                  ${publisherIns}
                  <http://purl.org/ontology/bibo/${uriDocument}>          dc:date "${year}" .
                  ${isbnIns}
              }`;
  };



  /*Update Article with these: title, authors (optional), journalTitle(optional), year (optional), issn (optional)*/
  insertArticleQuery = (
    title,
    author = null,
    year = null,
    issn = null,
    journal = null
  ) => {
    var authorsConc = "";
    var issnIns = "";
    var journalIns = "";

    if (author !== null) {
      for (var i = 0; i < author.lenght; i++) {
        authorsConc += author[i].name;
        console.log("AUTORE:", author[i]);
      }
    }

    var uriDocument = md5Hash(
      title.toString() + authorsConc.toString() + year.toString()
    );

    var authorString = "";

    author.map(el => {
      authorString += `<http://purl.org/ontology/bibo/${uriDocument}>  dc0:creator <http://purl.org/ontology/bibo/${el.authUri}> . `;
    });

    if (issn !== null) {
      issnIns = `<http://purl.org/ontology/bibo/${uriDocument}> bibo:issn "${issn}" .`;
    }
    if (journal !== null) {
      journalIns = `<http://purl.org/ontology/bibo/${uriDocument}> bibo:journaltitle "${journal}" .`;
    }

    return `PREFIX bibo: <http://purl.org/ontology/bibo/>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX dc0: <http://purl.org/dc/terms/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        
        INSERT DATA
              { 
                  <http://purl.org/ontology/bibo/${uriDocument}>          rdf:type bibo:Article .
                  ${authorString}
                  <http://purl.org/ontology/bibo/${uriDocument}>          dc:title "${title.toString()}" .
                  <http://purl.org/ontology/bibo/${uriDocument}>          dc:date "${year}" .
                  ${issnIns}
                  ${journalIns}
              }`;
  };



  /*Update InProceedings with these: title, authors (optional), publisher (optional), year (optional), isbn (optional), bookTitle (optional), editor (optional)*/
  insertInProceedingsQuery = (
    title,
    author = null,
    publisher = null,
    year = null,
    isbn = null,
    bookTitle = null,
    editor = null
  ) => {
    var authorsConc = "";
    var publisherIns = "";
    var isbnIns = "";
    var bookTitleIns = "";
    var editorIns = "";

    if (author !== null) {
      for (var i = 0; i < author.lenght; i++) {
        authorsConc += author[i].name;
        console.log("AUTORE:", author[i]);
      }
    }

    var uriDocument = md5Hash(
      title.toString() + authorsConc.toString() + year.toString()
    );

    var authorString = "";

    author.map(el => {
      authorString += `<http://purl.org/ontology/bibo/${uriDocument}>  dc0:creator <http://purl.org/ontology/bibo/${el.authUri}> . `;
    });

    if (publisher !== null) {
      publisherIns = `<http://purl.org/ontology/bibo/${uriDocument}> dc0:publisher "${publisher.toString()}" .`;
    }
    if (isbn !== null) {
      isbnIns = `<http://purl.org/ontology/bibo/${uriDocument}> bibo:isbn "${isbn}" .`;
    }
    if (bookTitle !== null) {
      bookTitleIns = `<http://purl.org/ontology/bibo/${uriDocument}> bibo:booktitle "${bookTitle}" .`;
    }
    if (editor !== null) {
      editorIns = `<http://purl.org/ontology/bibo/${uriDocument}> dc0:editor "${editor}" .`;
    }

    return `PREFIX bibo: <http://purl.org/ontology/bibo/>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX dc0: <http://purl.org/dc/terms/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        
        INSERT DATA
              { 
                  <http://purl.org/ontology/bibo/${uriDocument}>          rdf:type bibo:InProceedings .
                  ${authorString}
                  <http://purl.org/ontology/bibo/${uriDocument}>          dc:title "${title.toString()}" .
                  ${publisherIns}
                  <http://purl.org/ontology/bibo/${uriDocument}>          dc:date "${year}" .
                  ${isbnIns}
                  ${bookTitleIns}
                  ${editorIns}
              }`;
  };

  insertAuthorQuery = (name, uri) => {
    console.log(name);

    return `PREFIX bibo: <http://purl.org/ontology/bibo/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX dc0: <http://purl.org/dc/terms/>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      INSERT DATA
            {
                <http://purl.org/ontology/bibo/${uri}> rdf:type foaf:Person .
              <http://purl.org/ontology/bibo/${uri}> rdf:type owl:NamedIndividual .
                <http://purl.org/ontology/bibo/${uri}> foaf:name "${name.toString()}" .
            }`;
  };
}

module.exports = InsertStrings;
