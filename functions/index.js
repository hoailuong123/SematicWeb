const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { DataFactory } = require("n3");
const { namedNode, literal, defaultGraph, quadToString } = DataFactory;

admin.initializeApp();

exports.getDataFromFirestore = functions.https.onRequest(async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection("posts").get();

        const data = snapshot.docs.map((doc) => doc.data());

        // Convert data to N-Triples format
        let nTriplesData = '';
        data.forEach((docData, index) => {
            const subject = namedNode(`https://console.firebase.google.com/u/0/project/tiktokclone-1602/firestore/data/~2Fposts~2FUbV2iTN6GQX1zSoahtTy~2Flikes${index}`);
            Object.entries(docData).forEach(([key, value]) => {
                const predicate = namedNode(`https://console.firebase.google.com/u/0/project/tiktokclone-1602/firestore/data/~2Fposts~2FUbV2iTN6GQX1zSoahtTy~2Fcomments${key}`);
                const object = literal(value.toString());
                const quad = quadToString(namedNode(''), predicate, object, defaultGraph());
                nTriplesData += quad + '\n';
            });
        });

        return res.status(200).send(nTriplesData);
    } catch (error) {
        console.error("Error getting data from Firestore:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

exports.createCollection = functions.https.onRequest(async (req, res) => {
    try {
        await admin.firestore().collection('triples').add({
            subject: 'https://console.firebase.google.com/u/0/project/tiktokclone-1602/firestore/data/~2Fposts~2FeacU4DpW6s3Nn26oSGnk',
            predicate: 'https://console.firebase.google.com/u/0/project/tiktokclone-1602/firestore/data/~2Fposts~2FeacU4DpW6s3Nn26oSGnk~2Flikes~2FJKLXdk1gmQSDZo8sQkVAwMfHgnh2',
            object: 'https://console.firebase.google.com/u/0/project/tiktokclone-1602/firestore/data/~2Fposts~2FeacU4DpW6s3Nn26oSGnk~2Flikes~2FJKLXdk1gmQSDZo8sQkVAwMfHgnh2'
        });
        return res.status(200).send('Collection created successfully');
    } catch (error) {
        console.error('Error creating collection: ', error);
        return res.status(500).send('Internal Server Error');
    }
});
