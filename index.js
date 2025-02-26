const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors');
require('dotenv').config()
const app = express()
app.use(cors());
const port = process.env.PORT || 5000

// coffey-store         pfojOsTVaOEoQQVg

console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ejjfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const coffeyCollection = client.db("coffeyShopBD").collection("coffey");
    const userCollection = client.db("coffeyShopBD").collection("users");

    app.post('/coffey', async (req, res) => {
      const newCoffey = req.body;
      console.log(newCoffey);
      const result = await coffeyCollection.insertOne(newCoffey);
      res.send(result);
    })

    app.get('/coffey', async (req, res) => {
      const cursor = coffeyCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/coffey/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await coffeyCollection.findOne(query);
      res.send(result);
    })

    app.put('/coffey/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id : new ObjectId(id)};
      const options = { upsert: true };
      const updateCoffey = req.body;
      const Coffey = {
        $set: {
          email : updateCoffey.email,
          chef : updateCoffey.chef,
          supplier : updateCoffey.supplier,
          category : updateCoffey.category,
          taste : updateCoffey.taste,
          details : updateCoffey.details,
          photo : updateCoffey.photo
        },
      };
      const result = await coffeyCollection.updateOne(filter, Coffey, options);
      res.send(result);
    })

    app.delete('/coffey/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeyCollection.deleteOne(query)
      res.send(result);
    })


    // users related api
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      console.log('creating new user', newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);


app.use(express.json());
app.get('/', (req, res) => {
  res.send('Welcome To out coffey Shop');
})

app.listen(port, () => {
  console.log(`Coffey Shop on port ${port}`)
})