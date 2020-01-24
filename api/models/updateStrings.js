class UpdateStrings {
    updateBookQuery = (uri, publisher = null, isbn = null) => {
        var publisherIns = "";
        var isbnIns = "";
        var publisherDel = "";
        var isbnDel = "";

        if (publisher !== null) {
            publisherDel = `<http://purl.org/ontology/bibo/${uri}> dc0:publisher ?pub .`
            publisherIns = `<http://purl.org/ontology/bibo/${uri}> dc0:publisher "${publisher}" .`
        }
        if (isbn !== null) {
            isbnDel = `<http://purl.org/ontology/bibo/${uri}> bibo:isbn ?isbn .`
            isbnIns = `<http://purl.org/ontology/bibo/${uri}> bibo:isbn "${isbn}" .`
        }

        return `PREFIX bibo: <http://purl.org/ontology/bibo/>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX dc0: <http://purl.org/dc/terms/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        
        DELETE {${publisherDel}
                     ${isbnDel}
        } WHERE {
            ${publisherDel}
            ${isbnDel}
        };
        INSERT DATA {${publisherIns}
                     ${isbnIns}} `;
    };



    updateArticleQuery = (uri, journalTitle = null, issn = null) => {
        var journalTitleIns = "";
        var issnIns = "";
        var journalTitleDel = "";
        var issnDel = "";

        if (journalTitle !== null) {
            journalTitleDel = `<http://purl.org/ontology/bibo/${uri}> bibo:journaltitle ?journal .`
            journalTitleIns = `<http://purl.org/ontology/bibo/${uri}> bibo:journaltitle "${journalTitle}" .`
        }
        if (issn !== null) {
            issnDel = `<http://purl.org/ontology/bibo/${uri}> bibo:issn ?issn .`
            issnIns = `<http://purl.org/ontology/bibo/${uri}> bibo:issn "${issn}" .`
        }

        return `PREFIX bibo: <http://purl.org/ontology/bibo/>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX dc0: <http://purl.org/dc/terms/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        
        DELETE {
            ${journalTitleDel}
            ${issnDel}
        } WHERE {
            ${journalTitleDel}
            ${issnDel}
        };
        INSERT DATA {
            ${journalTitleIns}
            ${issnIns}
        } `;
    };



    updateInProceedingsQuery = (uri, bookTitle = null, isbn = null, publisher = null, editor = null) => {
        var bookTitleIns = "";
        var isbnIns = "";
        var publisherIns = "";
        var editorIns = "";
        var bookTitleDel = "";
        var isbnDel = "";
        var publisherDel = "";
        var editorDel = "";

        if (bookTitle !== null) {
            bookTitleDel = `<http://purl.org/ontology/bibo/${uri}> bibo:booktitle ?booktitle .`
            bookTitleIns = `<http://purl.org/ontology/bibo/${uri}> bibo:booktitle "${bookTitle}" .`
        }
        if (isbn !== null) {
            isbnDel = `<http://purl.org/ontology/bibo/${uri}> bibo:isbn ?isbn .`
            isbnIns = `<http://purl.org/ontology/bibo/${uri}> bibo:isbn "${isbn}" .`
        }
        if (publisher !== null) {
            publisherDel = `<http://purl.org/ontology/bibo/${uri}> dc0:publisher ?pub .`
            publisherIns = `<http://purl.org/ontology/bibo/${uri}> dc0:publisher "${publisher}" .`
        }
        if (editor !== null) {
            editorDel = `<http://purl.org/ontology/bibo/${uri}> dc0:editor ?editor .`
            editorIns = `<http://purl.org/ontology/bibo/${uri}> dc0:editor "${editor}" .`
        }

        return `PREFIX bibo: <http://purl.org/ontology/bibo/>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX dc0: <http://purl.org/dc/terms/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        
        DELETE {
            ${bookTitleDel}
            ${isbnDel}
            ${publisherDel}
            ${editorDel}
        } WHERE {
            ${bookTitleDel}
            ${isbnDel}
            ${publisherDel}
            ${editorDel}
        };
        INSERT DATA {
            ${bookTitleIns}
            ${isbnIns}
            ${publisherIns}
            ${editorIns}
        } `;
    };
}

module.exports = UpdateStrings;