class UpdateStrings {
    updateBookQuery = (uri, publisher = null, isbn = null) => {
        var publisherIns = "";
        var isbnIns = "";

        if (publisher != null) {
            publisherIns = `<http://purl.org/ontology/bibo/${uri}> dc:publisher "${publisher}" .`
        }
        if (isbn != null) {
            isbnIns = `<http://purl.org/ontology/bibo/${uri}> bibo:isbn "${isbn}" .`
        }

        return `PREFIX bibo: <http://purl.org/ontology/bibo/>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX dc0: <http://purl.org/dc/terms/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        
        DELETE DATA {${publisherIns}
                     ${isbnIns}};
        INSERT DATA {${publisherIns}
                     ${isbnIns}} `;
    };

}

module.exports = UpdateStrings;