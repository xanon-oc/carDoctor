const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// mongoDB
const uri = "mongodb://0.0.0.0:27017";
// const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.25nqiwd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollections = client.db("carDoctor").collection("services");
    const bookingCollections = client.db("carDoctor").collection("bookings");

    app.post("/uploadServices", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await bookingCollections.insertOne(data);
      res.send(result);
    });

    app.get("/all-services", async (req, res) => {
      const result = await serviceCollections.find().toArray();
      res.send(result);
    });

    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollections.findOne(query);
      res.send(result);
    });

    app.patch("/update-service/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      console.log(updatedData);
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: updatedData.status,
        },
      };
      const result = await bookingCollections.updateOne(query, updatedDoc);
      res.send(result);
    });

    app.delete("/service-data/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollections.deleteOne(query);
      res.send(result);
    });

    // bookings

    app.get("/bookings", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = {
          email: req.query.email,
        };
      }
      const result = await bookingCollections.find(query).toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("THE CAR SERvER IS RUNNING");
});

app.listen(port, () => {
  console.log(`THE SERVER IS HITTING ON PORT: ${port}`);
});
