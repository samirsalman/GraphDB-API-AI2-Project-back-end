const md5Hash = require("blueimp-md5");

class InsertStrings {
  insertBook = (
    title,
    author = null,
    publisher = null,
    year = null,
    isbn = null
  ) => {
    var authorsConc;
    var publisherIns = "";
    var isbnIns = "";

    //TODO definire se autore è obbligatorio come campo
    if (author !== null) {
      for (i = 0; i < author.lenght; i++) {
        var uri = md5Hash(Math.random() * 66464654649494949797979464566);

        authorsConc += author[i].toString();
      }
    }

    var uriDocument = md5Hash(
      title.toString() + authorsConc.toString() + year.toString()
    );

    if (publisher !== null) {
      publisherIns = `<http://purl.org/ontology/bibo/${uriDocument}> dc:publisher "${publisher.toString()}" .`;
    }
    if (isbn !== null) {
      isbnIns = `<http://purl.org/ontology/bibo/${uriDocument}> bibo:isbn "${isbnIns}" .`;
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
                  <http://purl.org/ontology/bibo/${uriDocument}>          dc:creator "" .
                  <http://purl.org/ontology/bibo/${uriDocument}>          dc:title "${title.toString()}" .
                  ${publisherIns}
                  <http://purl.org/ontology/bibo/${uriDocument}>          dc:date "" .
                  ${isbnIns}
              }`;
  };

  insertAuthor = name => {


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
                <http://purl.org/ontology/bibo/${uri}> foaf:Name "${name.toString()}" .
            }`;
  };


}



module.exports = InsertStrings;
