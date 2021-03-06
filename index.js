const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jr39v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("Hitting Database");
    const database = client.db("tourGalaxyDB");
    const tourCollection = database.collection("tours");
    const orderCollection = database.collection("orders");
    const blogCollection = database.collection("blogs");
    const feedbacksCollection = database.collection("feedbacks");

    // GET ALL TOURS API
    app.get("/tours", async (req, res) => {
      const cursor = tourCollection.find({});
      const tours = await cursor.toArray();
      res.send(tours);
    });
    // GET ALL ORDERS API
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });
    // GET ALL Blogs API
    app.get("/blogs", async (req, res) => {
      const cursor = blogCollection.find({});
      const blogs = await cursor.toArray();
      res.send(blogs);
    });
    // GET ALL Feedbacks API
    app.get("/feedbacks", async (req, res) => {
      const cursor = feedbacksCollection.find({});
      const feedbacks = await cursor.toArray();
      res.send(feedbacks);
    });
    //GET SINGLE DATA API
    app.get("/tours/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tour = await tourCollection.findOne(query);
      res.send(tour);
    });
    //GET MY OREDERS API
    app.get("/myorders/:email", async (req, res) => {
      const result = await orderCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });
    //ADD TOURS API
    app.post("/tours", async (req, res) => {
      const tour = req.body;
      const result = await tourCollection.insertOne(tour);
      res.json(result);
    });
    //ADD ORDERS API
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });
    //UPDATE STATUS API
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const updatedStatus = req.body;
      console.log(updatedStatus);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          tourstatus: updatedStatus.tourstatus,
        },
      };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    //DELETE API
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Tour Galaxy Server");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
