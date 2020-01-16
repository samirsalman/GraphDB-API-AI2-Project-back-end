class QueryStrings {
  allQuery = `PREFIX bibo: <http://purl.org/ontology/bibo/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dc0: <http://purl.org/dc/terms/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    
    select ?book ?title ?name ?year ?isbn where { 
      ?book  a   bibo:Document .
        ?book bibo:isbn ?isbn .
        ?book dc:title ?title .
        
        OPTIONAL{
        ?book dc:date ?year .
        ?book dc0:creator ?authors .
        ?authors foaf:name ?name .
        }
    }`;
}

module.exports = QueryStrings;
