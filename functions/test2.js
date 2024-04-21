const firebase = require('firebase/app');
require('firebase/firestore');
const rdf = require('rdflib');
const fs = require('fs');

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase config here
};

firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = firebase.firestore();

// Initialize RDF store
const store = rdf.graph();

// Function to convert Firestore data to RDF
function convertToRDF(data) {
  data.forEach((docData, index) => {
    const subject = rdf.sym(`http://example.org/resource${index}`);
    Object.entries(docData).forEach(([key, value]) => {
      const predicate = rdf.sym(`http://example.org/${key}`);
      const object = rdf.lit(value.toString());
      store.add(subject, predicate, object);
    });
  });
}

// Function to save RDF data to file
function saveRDFToFile() {
  const rdfContent = rdf.serialize(undefined, store, 'http://example.org/', 'application/rdf+xml');
  fs.writeFileSync('data.rdf', rdfContent, 'utf-8');
}

// Get data from Firestore and convert to RDF
firestore.collection('data').get().then(snapshot => {
  const data = snapshot.docs.map(doc => doc.data());
  convertToRDF(data);
  saveRDFToFile();
  console.log('Data converted to RDF and saved to file.');
}).catch(error => {
  console.error('Error retrieving data from Firestore:', error);
});
