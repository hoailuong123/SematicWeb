const $rdf = require('rdflib');
const fs = require('fs');

// Define namespaces
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const EX = $rdf.Namespace('http://example.org/');

// Create a new RDF store
const store = $rdf.graph();

// Define the filename
const rdfFilename = 'data.rdf';

// Check if the file exists, if not, create it
if (!fs.existsSync(rdfFilename)) {
    fs.writeFileSync(rdfFilename, '', 'utf-8');
}

// Load existing RDF data from a file
const rdfData = fs.readFileSync(rdfFilename, 'utf-8');

// Parse RDF data
$rdf.parse(rdfData, store, 'http://example.org/', 'text/turtle', (err, success) => {
    if (err) {
        console.error('Error parsing RDF data:', err);
    } else {
        console.log('RDF data parsed successfully!');
    }
});

// Function to add a like or comment
function addLikeOrComment(user, topic, action) {
    const subject = EX(user);
    const predicate = action === 'like' ? FOAF('likes') : FOAF('comments');
    const object = EX(topic);
    store.add($rdf.st(subject, predicate, object));
}

// Function to delete a like or comment
function deleteLikeOrComment(user, topic, action) {
    const subject = EX(user);
    const predicate = action === 'like' ? FOAF('likes') : FOAF('comments');
    const object = EX(topic);
    store.remove($rdf.st(subject, predicate, object));
}

// Function to count the total likes or comments for a user on a topic
function countTotalLikesOrComments(user, topic) {
    const userNode = EX(user);
    const topicNode = EX(topic);
    const likeStatements = store.match(userNode, FOAF('likes'), topicNode);
    const commentStatements = store.match(userNode, FOAF('comments'), topicNode);
    return likeStatements.length + commentStatements.length;
}

// Function to save RDF data to a file
function saveRdfToFile() {
    const rdfSerializer = new $rdf.Serializer(store);
    const rdfString = rdfSerializer.statementsToN3(store.statements);
    fs.writeFileSync(rdfFilename, rdfString, 'utf-8');
}

// Example usage
addLikeOrComment('user1', 'topic1', 'like');
addLikeOrComment('user2', 'topic1', 'comment');
addLikeOrComment('user1', 'topic1', 'like');

console.log('Total interact of user1 for topic1:', countTotalLikesOrComments('user1', 'topic1'));
// console.log('Total interact of user1 for topic:', countTotalLikesOrComments('topic1', 'comment'));

// Save changes to file
saveRdfToFile();
