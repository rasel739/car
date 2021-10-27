const express = require('express');
const { MongoClient } = require("mongodb");
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
app.use(cors());
app.use(express.json());

require('dotenv').config()

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qcx2i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
    
    try {
        await client.connect();

        const database = client.db('carMeachanic');

        const servicesCollection = database.collection('services');

        app.get('/services', async (req, res) => {
            
            const cursor = servicesCollection.find({});

            const service = await cursor.toArray()

            res.send(service);
        })

        //get signle service

        app.get('/services/:id', async (req, res) => {
            
            const id = req.params.id;

            const query = { _id: ObjectId(id) }
            
            const service = await servicesCollection.findOne(query);
            console.log('Service',id)
            res.json(service);


        })
        app.post('/services', async (req, res) => {
          
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            // console.log(result)

            res.json(result);
        })
        //Delete api

        app.delete('/services/:id', async (req, res) => {

            const id = req.params.id;

            const query = { _id: ObjectId(id) };

            const result = await servicesCollection.deleteOne(query);

            res.json(result);

        })

        console.log('Connected Database')
    } finally {
        // await client.close()    
    }

}
run().catch(console.dir)

app.get('/',(req, res)=> {
    
    res.send('Welcome to MongoDB Server')
})

app.listen(port, () => {
    
    console.log('Running on Server');
})