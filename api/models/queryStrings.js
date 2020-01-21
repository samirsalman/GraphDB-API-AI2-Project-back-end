class QueryStrings {
  allQuery = (year = null) => {
    var yearString = "";
    if (year !== null) {
      var splitting = year.toString().split("-");
      var year1 = splitting[0];
      var year2 = splitting[1];
      yearString = `FILTER ((xsd:integer (?year) >= ${year1}) && (xsd:integer(?year) <= ${year2})) . `;
    }
    return `PREFIX bibo: <http://purl.org/ontology/bibo/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dc0: <http://purl.org/dc/terms/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    
    select ?book ?title ?name ?year ?isbn where { 
      ?book  a   bibo:Document .
        ?book bibo:isbn ?isbn .
        ?book dc:title ?title .
        
        OPTIONAL{
        ?book dc:date ?year .
        ?book dc0:creator ?authors .
        ?authors foaf:name ?name .
        }
        ${yearString}
    }`;
  };

  searchByISBNQuery = (isbn, orderBy = null, year = null) => {
    var orderedString = "";
    var yearString = "";
    if (orderBy !== null) {
      orderedString = `ORDER BY ?${orderBy}`;
    }
    if (year !== null) {
      var splitting = year.toString().split("-");
      var year1 = splitting[0];
      var year2 = splitting[1];
      yearString = ` && (xsd:integer (?year) >= ${year1}) && (xsd:integer(?year) <= ${year2}) `;
    }

    return `PREFIX bibo: <http://purl.org/ontology/bibo/>
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
          FILTER ((regex(?isbn, "${isbn}", "i")) ${yearString}) .
         
      } ${orderedString}`;
  };

  searchByTitleQuery = (title, orderBy = null, year = null) => {
    var orderedString = "";
    var yearString = "";

    if (orderBy !== null) {
      orderedString = `ORDER BY ?${orderBy}`;
    }

    if (year !== null) {
      var splitting = year.toString().split("-");
      var year1 = splitting[0];
      var year2 = splitting[1];
      yearString = `&& (xsd:integer (?year) >= ${year1}) && (xsd:integer(?year) <= ${year2}) `;
    }
    return `PREFIX bibo: <http://purl.org/ontology/bibo/>
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
          FILTER ((regex(?title, "${title}", "i")) ${yearString}) .
         
      } ${orderedString}`;
  };

  searchByAuthorQuery = (author, orderBy = null, year = null) => {
    var orderedString = "";
    var yearString = "";

    if (orderBy !== null) {
      orderedString = `ORDER BY ?${orderBy}`;
    }
    if (year !== null) {
      var splitting = year.toString().split("-");
      var year1 = splitting[0];
      var year2 = splitting[1];
      yearString = `&& (xsd:integer (?year) >= ${year1}) && (xsd:integer(?year) <= ${year2}) `;
    }
    return `PREFIX bibo: <http://purl.org/ontology/bibo/>
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
          FILTER ((regex(?name, "${author}", "i")) ${yearString}) .
          
      }${orderedString}`;
  };
}

module.exports = QueryStrings;
