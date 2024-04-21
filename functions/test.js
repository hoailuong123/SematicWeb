const $rdf = require('rdflib');
const fs = require('fs');

class RDFManager {
    LIKE_NAME = 'likes';
    COMMENT_NAME = 'comments';
    constructor(filename) {
        this.filename = filename;
        this.graph = $rdf.graph();
        this.FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
        this.EX = $rdf.Namespace('http://example.org/');
    }

    loadData() {
        if (fs.existsSync(this.filename)) {
            console.log(`File ${this.filename} exists. Loading data...`);
            const existingData = fs.readFileSync(this.filename, 'utf-8');
            $rdf.parse(existingData, this.graph, 'http://example.org/', 'text/turtle');
        } else {
            console.log(`File ${this.filename} does not exist. Creating a new file...`);
            this.saveData(); // Save empty graph
        }
    }

    saveData() {
        const data = $rdf.serialize(undefined, this.graph, 'http://example.org/', 'text/turtle');
        fs.writeFileSync(this.filename, data, 'utf-8');
        console.log(`RDF data written to ${this.filename}`);
    }

    addRecord(topicID) {
        const topic = this.EX(topicID);
        
        // Check if the topic already exists
        const existingData = this.graph.statementsMatching(topic, null, null);
        if (existingData.length > 0) {
            // topic exists
            console.error('topic is already exist');
            return false;
        }
        
        // Add the record
        this.graph.add(topic, this.FOAF(this.LIKE_NAME), $rdf.literal(0));
        this.graph.add(topic, this.FOAF(this.COMMENT_NAME), $rdf.literal(0));
        this.saveData();
    }

    updateLikes(topicID) {
        if (!topicID) {
            console.error('topicID not set. Please input the topicID.');
            return;
        }
        const topic = this.EX(topicID);
        let currentLikes = this.getLikes(topicID);
        if (currentLikes === null) {
            currentLikes = 1; // If age information not found, set age to 1
        } else {
            currentLikes++; // Increment the current age
        }
        this.graph.removeMany(topic, this.FOAF(this.LIKE_NAME), null);
        this.graph.add(topic, this.FOAF(this.LIKE_NAME), $rdf.literal(currentLikes));
        this.saveData();
    }

    updateComments(topicID) {
        if (!topicID) {
            console.error('topicID not set. Please input the topicID.');
            return;
        }
        const topic = this.EX(topicID);
        let currentComments = this.getComments(topicID);
        if (currentComments === null) {
            currentComments = 1;
        } else {
            currentComments++;
        }
        this.graph.removeMany(topic, this.FOAF(this.COMMENT_NAME), null);
        this.graph.add(topic, this.FOAF(this.COMMENT_NAME), $rdf.literal(currentComments));
        this.saveData();
    }

    getLikes(topicID) {
        const topic = this.EX(topicID);
        const likeStatements = this.graph.statementsMatching(topic, this.FOAF(this.LIKE_NAME), null);
        if (likeStatements.length > 0) {
            return parseInt(likeStatements[0].object.value);
        } else {
            return null;
        }
    }

    getComments(topicID) {
        const topic = this.EX(topicID);
        const commentStatements = this.graph.statementsMatching(topic, this.FOAF(this.COMMENT_NAME), null);
        if (commentStatements.length > 0) {
            return parseInt(commentStatements[0].object.value);
        } else {
            return null;
        }
    }
}

// Usage
const rdfManager = new RDFManager('user123.ttl');
rdfManager.loadData(); // Load or create data

rdfManager.addRecord('topic1');
console.log('topic1 likes:', rdfManager.getLikes('topic1'));
console.log('topic1 comments:', rdfManager.getComments('topic1'));
rdfManager.updateComments('topic1');
rdfManager.updateComments('topic1');
rdfManager.updateComments('topic1');
rdfManager.updateComments('topic1');
rdfManager.updateLikes('topic1');
rdfManager.updateLikes('topic1');
rdfManager.updateLikes('topic1');
console.log('topic1 likes:', rdfManager.getLikes('topic1'));
console.log('topic1 comments:', rdfManager.getComments('topic1'));

rdfManager.addRecord('topic4');
