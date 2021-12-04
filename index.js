const { MongoClient } = require('mongodb');
const express = require('express');
const ObjectId = require('mongodb').ObjectId
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;


// dRggtV8DxwiEehVF
app.use(cors());
app.use(express.json())

async function run() {


    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.39aol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('jerins-parlour');
        const serviceCollection = database.collection("services");
        const bookingCollection = database.collection("bookService");
        const usersCollection = database.collection("users");
        const reviewsCollection = database.collection("userReview");

        // get service api
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const options = {
                projection: { _id: 0 },
            };
            const singleService = await serviceCollection.findOne(query, options)
            res.send(singleService);
        });

        // post api on book
        app.post('/book', async (req, res) => {
            const bookService = req.body;
            const result = await bookingCollection.insertOne(bookService);
            res.send(result);
        });

        // get book apu
        app.get('/book', async (req, res) => {
            const book = bookingCollection.find({});
            const bookService = await book.toArray();
            res.send(bookService)
        });
        // get book item with email
        app.get('/book/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const book = bookingCollection.find(query);
            const bookService = await book.toArray();
            res.send(bookService)
        });

        // user feedback
        app.get('/review', async (req, res) => {
            const result = await reviewsCollection.find({}).toArray();
            res.send(result);
        })
        // post feedback
        app.post('/review', async (req, res) => {
            const userFeedback = await reviewsCollection.insertOne(req.body);
            res.send(userFeedback);
        })

        // save user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: "admin" } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });


        // update status
        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body.status;
            const filter = { _id: id }
            const result = await bookingCollection.updateOne(filter, {
                $set: { status: updateStatus },
            })
            console.log(updateStatus);
            res.send(result);
        });

        // update





    }
    finally {

    }

}


run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello jerins parlur')
})

app.listen(port, () => {
    console.log("my server is runningin port 5000")
})