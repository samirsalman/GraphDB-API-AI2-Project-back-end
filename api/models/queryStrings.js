class QueryStrings {
  allQuery = (orderBy = null, year = null, type = null) => {
    var typeDoc = "Document";
    var orderedString = "";

    if (type !== null) {
      typeDoc = type.toString();
    }

    if (orderBy !== null) {
      if (orderBy === "year") {
        orderedString = `ORDER BY DESC(?${orderBy})`;
      } else {
        orderedString = `ORDER BY (?${orderBy})`;
      }
    }

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
    
    select ?book ?type ?title ?name ?year ?isbn ?pub ?issn ?edit ?journ ?booktitle where { 
      ?book  a   bibo:${typeDoc} .
      ?book a ?type .
      ?book dc:title ?title .

      
      OPTIONAL{
        ?book dc:date ?year .
        ?book dc0:creator ?authors .
        ?authors foaf:name ?name .
        OPTIONAL {  ?book dc0:publisher ?pub .}
        OPTIONAL { ?book bibo:booktitle ?booktitle .}
        OPTIONAL { ?book bibo:journaltitle ?journ .}
        OPTIONAL {?book dc0:editor ?edit .}
        OPTIONAL {?book bibo:isbn ?isbn .}
        OPTIONAL {?book bibo:issn ?issn .}
        }

        FILTER NOT EXISTS{
          ?subtype ^a ?book.
          ?subtype rdfs:subClassOf ?type .
          filter(?subtype != ?type) .
        }
        ${yearString}
        FILTER(?type = bibo:Article || ?type = bibo:Book || ?type = bibo:InProceedings) .
    } ${orderedString}`;
  };

  searchByISBNQuery = (isbn, orderBy = null, year = null, type = null) => {
    var orderedString = "";
    var yearString = "";
    var typeDoc = "Document";
    var filterString = "";

    if (orderBy !== null) {
      if (orderBy === "year") {
        orderedString = `ORDER BY DESC(?${orderBy})`;
      } else {
        orderedString = `ORDER BY (?${orderBy})`;
      }
    }
    if (year !== null) {
      var splitting = year.toString().split("-");
      var year1 = splitting[0];
      var year2 = splitting[1];
      yearString = ` && (xsd:integer (?year) >= ${year1}) && (xsd:integer(?year) <= ${year2}) `;
    }
    if (type !== null) {
      typeDoc = type.toString();
      filterString = `FILTER NOT EXISTS { 
        ?book rdf:type ?c . 
        ?c rdfs:subClassOf+ bibo:${typeDoc} .
        FILTER (?c != bibo:${typeDoc}) .
      }`;
    }

    return `PREFIX bibo: <http://purl.org/ontology/bibo/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX dc0: <http://purl.org/dc/terms/>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      
      select ?book ?type ?title ?name ?year ?isbn ?pub ?issn ?edit ?journ ?booktitle where { 
        ?book  a   bibo:${typeDoc} .
          ?book a ?type .
          ?book dc:title ?title .

          
          OPTIONAL{
            ?book dc:date ?year .
            ?book dc0:creator ?authors .
            ?authors foaf:name ?name .
            OPTIONAL {  ?book dc0:publisher ?pub .}
            OPTIONAL { ?book bibo:booktitle ?booktitle .}
            OPTIONAL { ?book bibo:journaltitle ?journ .}
            OPTIONAL {?book dc0:editor ?edit .}
            OPTIONAL {?book bibo:isbn ?isbn .}
            OPTIONAL {?book bibo:issn ?issn .}
            }

            FILTER NOT EXISTS{
              ?subtype ^a ?book.
              ?subtype rdfs:subClassOf ?type .
              filter(?subtype != ?type) .
          }

          FILTER ((regex(?isbn, "${isbn}", "i")) ||(regex(?issn, "${isbn}", "i"))  ${yearString}) .
          FILTER(?type = bibo:Article || ?type = bibo:Book || ?type = bibo:InProceedings) .
         
      } ${orderedString}`;
  };

  searchByTitleQuery = (title, orderBy = null, year = null, type = null) => {
    var orderedString = "";
    var yearString = "";
    var typeDoc = "Document";
    var filterString = "";
    var typeIsNull = "";
    var filterTypeNull = "";

    if (orderBy !== null) {
      if (orderBy === "year") {
        orderedString = `ORDER BY DESC(?${orderBy})`;
      } else {
        orderedString = `ORDER BY (?${orderBy})`;
      }
    }

    if (year !== null) {
      var splitting = year.toString().split("-");
      var year1 = splitting[0];
      var year2 = splitting[1];
      yearString = `&& (xsd:integer (?year) >= ${year1}) && (xsd:integer(?year) <= ${year2}) `;
    }
    if (type !== null) {
      typeDoc = type.toString();
      filterString = `FILTER NOT EXISTS { 
        ?book rdf:type ?c . 
        ?c rdfs:subClassOf+ bibo:${typeDoc} .
        FILTER (?c != bibo:${typeDoc}) .
      }`;
    } else if (type === null) {
      typeIsNull = `?book a ?type .`;
      filterTypeNull = `FILTER NOT EXISTS{
          ?subtype ^a ?book.
          ?subtype rdfs:subClassOf ?type .
          filter(?subtype != ?type) .
      }`;
    }
    return `PREFIX bibo: <http://purl.org/ontology/bibo/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX dc0: <http://purl.org/dc/terms/>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      
      select ?book ?type ?title ?name ?year ?isbn ?pub ?issn ?edit ?journ ?booktitle where { 
          ?book  a   bibo:${typeDoc} .
          ${typeIsNull}
          ?book dc:title ?title .
        
          OPTIONAL{
            ?book dc:date ?year .
            ?book dc0:creator ?authors .
            ?authors foaf:name ?name .
            OPTIONAL {  ?book dc0:publisher ?pub .}
            OPTIONAL { ?book bibo:booktitle ?booktitle .}
            OPTIONAL { ?book bibo:journaltitle ?journ .}
            OPTIONAL {?book dc0:editor ?edit .}
            OPTIONAL {?book bibo:isbn ?isbn .}
            OPTIONAL {?book bibo:issn ?issn .}
            }
            
            FILTER NOT EXISTS{
              ?subtype ^a ?book.
              ?subtype rdfs:subClassOf ?type .
              filter(?subtype != ?type) .
          }
            
          FILTER ((regex(?title, "${title}", "i")) ${yearString}) .
          FILTER(?type = bibo:Article || ?type = bibo:Book || ?type = bibo:InProceedings) .
         
      } ${orderedString}`;
  };

  searchByAuthorQuery = (author, orderBy = null, year = null, type = null) => {
    var orderedString = "";
    var yearString = "";
    var typeDoc = "Document";
    var filterString = "";

    if (orderBy !== null) {
      if (orderBy === "year") {
        orderedString = `ORDER BY DESC(?${orderBy})`;
      } else {
        orderedString = `ORDER BY (?${orderBy})`;
      }
    }
    if (year !== null) {
      var splitting = year.toString().split("-");
      var year1 = splitting[0];
      var year2 = splitting[1];
      yearString = `&& (xsd:integer (?year) >= ${year1}) && (xsd:integer(?year) <= ${year2}) `;
    }
    if (type !== null) {
      typeDoc = type.toString();
      filterString = `FILTER NOT EXISTS { 
        ?book rdf:type ?c . 
        ?c rdfs:subClassOf+ bibo:${typeDoc} .
        FILTER (?c != bibo:${typeDoc}) .
      }`;
    }
    return `PREFIX bibo: <http://purl.org/ontology/bibo/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX dc0: <http://purl.org/dc/terms/>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      
      select ?book ?type ?title ?name ?year ?isbn ?pub ?issn ?edit ?journ ?booktitle where { 
        ?book  a   bibo:${typeDoc} .
          ?book a ?type .
          ?book dc:title ?title .

          
          OPTIONAL{
            ?book dc:date ?year .
            ?book dc0:creator ?authors .
            ?authors foaf:name ?name .
            OPTIONAL {  ?book dc0:publisher ?pub .}
            OPTIONAL { ?book bibo:booktitle ?booktitle .}
            OPTIONAL { ?book bibo:journaltitle ?journ .}
            OPTIONAL {?book dc0:editor ?edit .}
            OPTIONAL {?book bibo:isbn ?isbn .}
            OPTIONAL {?book bibo:issn ?issn .}
            }

            FILTER NOT EXISTS{
              ?subtype ^a ?book.
              ?subtype rdfs:subClassOf ?type .
              filter(?subtype != ?type) .
          }

          FILTER ((regex(?name, "${author}", "i")) ${yearString}) .
          FILTER(?type = bibo:Article || ?type = bibo:Book || ?type = bibo:InProceedings) .
          
      }${orderedString}`;
  };

  replaceTitleString = str => {
    return str
      .replace("/", " ")
      .replace("\\", " ")
      .replace(":", " ")
      .replace("-", " ")
      .replace("[", " ")
      .replace("]", " ")
      .replace("{", " ")
      .replace("}", " ")
      .replace("(", " ")
      .replace(")", " ");
  };

  searchRelated = (title, uri) => {
    var titleParts = title.split(" ");
    var filtering = "";
    for (var j = 0; j < titleParts.length; j++) {
      if (j !== titleParts.length - 1 && titleParts[j].length > 3) {
        filtering += `(regex(?title, "${this.replaceTitleString(
          titleParts[j]
        )}", "i")) ||`;
      } else if (j === titleParts.length - 1 && titleParts[j].length > 3) {
        filtering += `(regex(?title, "${this.replaceTitleString(
          titleParts[j]
        )}", "i"))`;
      }
    }

    return `PREFIX bibo: <http://purl.org/ontology/bibo/>
  PREFIX dc: <http://purl.org/dc/elements/1.1/>
  PREFIX dc0: <http://purl.org/dc/terms/>
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>

  select ?book ?type ?title ?name ?year ?isbn ?pub ?issn ?edit ?journ ?booktitle where { 
      ?book a bibo:Document .
      ?book a ?type .
      ?book dc:title ?title .
      
      OPTIONAL{
        ?book dc:date ?year .
        ?book dc0:creator ?authors .
        ?authors foaf:name ?name .
        OPTIONAL {  ?book dc0:publisher ?pub .}
        OPTIONAL { ?book bibo:booktitle ?booktitle .}
        OPTIONAL { ?book bibo:journaltitle ?journ .}
        OPTIONAL {?book dc0:editor ?edit .}
        OPTIONAL {?book bibo:isbn ?isbn .}
        OPTIONAL {?book bibo:issn ?issn .}
        }

        FILTER NOT EXISTS{
          ?subtype ^a ?book.
          ?subtype rdfs:subClassOf ?type .
          filter(?subtype != ?type) .
      }
      
      FILTER (${filtering}) .
      FILTER (?book != <http://purl.org/ontology/bibo/${uri}>) .

  } `;
  };
}

module.exports = QueryStrings;
