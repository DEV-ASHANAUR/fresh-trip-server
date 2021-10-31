//dependencis
const express = require('express');
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
const en = require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
//middleware
app.use(cors());
app.use(express.json());

//variable
const port = process.env.PORT || 5000;

// Connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.88ouu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // create database
    const database = client.db('fresh-trip');
    // create service collection
    const serviceCollection = database.collection('service');
    // create order collection
    const orderCollection = database.collection('order');
    //create message collection 
    const messageCollection = database.collection('message');
    //get service
    app.get('/service',async(req,res)=>{
        const cursor = serviceCollection.find({});
        const result = await cursor.toArray();
        res.json(result);
    });
    //get service by id
    app.get('/service/:id',async(req,res)=>{
        const id = req.params.id;
        // console.log('request id is:',id);
        const query = { _id: ObjectId(id) };
        const service = await serviceCollection.findOne(query);
        res.json(service);
    });
    //add service
    app.post('/service',async(req,res)=>{
        const data = req.body;
        const result = await serviceCollection.insertOne(data);
        res.json(result);
    });
    //add order
    app.post('/order',async(req,res)=>{
        const data = req.body;
        const result = await orderCollection.insertOne(data);
        res.json(result);
    });
    //get all order
    app.get('/myorder',async(req,res)=>{
        const cursor = orderCollection.find({});
        const allorder = await cursor.toArray();
        res.json(allorder);
    });
    //get my order
    app.get('/myorder/:email',async(req,res)=>{
        const email = req.params.email;
        // console.log('request id is:',id);
        const cursor = orderCollection.find({email:email});
        const myorder = await cursor.toArray();
        res.json(myorder);
    });
    //update status
    app.put('/order/:id',async(req,res)=>{
        const id = req.params.id;
        const itemData = req.body;
        const filter = { _id:ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            name:itemData.name,
            email:itemData.email,
            phone:itemData.phone,
            address:itemData.address,
            service_id:itemData.service_id,
            destination:itemData.destination,
            duration:itemData.duration,
            price:itemData.price,
            status:itemData.status
          },
        };
        const result = await orderCollection.updateOne(filter, updateDoc, options);
        res.json(result);
      })
    //delete order
    app.delete('/order/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await orderCollection.deleteOne(query);
        res.json(result);
    });
    //store message
    app.post('/message',async(req,res)=>{
        const data = req.body;
        const result = await messageCollection.insertOne(data);
        res.json(result);
    });
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//home page
app.get('/',(req,res)=>{
    res.send('hello from home page');
})
// start server
app.listen(port,()=>{
    console.log(`listenig at ${port}`);
});

