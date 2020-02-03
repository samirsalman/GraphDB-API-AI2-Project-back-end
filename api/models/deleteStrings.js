class DeleteStrings {
    /*Update every triple that contain this uri*/
    deleteQuery = (uri) => {

        return `PREFIX bibo: <http://purl.org/ontology/bibo/>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX dc0: <http://purl.org/dc/terms/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        
        DELETE WHERE{ <http://purl.org/ontology/bibo/${uri}> ?p ?o };
        DELETE WHERE { ?s ?p <http://purl.org/ontology/bibo/${uri}>} `;
    };
}



module.exports = DeleteStrings;