const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.onllh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const userCollection = client.db("carpentoDB").collection("users");
    const productCollection = client.db("carpentoDB").collection("products");

    // collect all products from database
    app.get("/product", async (req, res) => {
      const products = await productCollection.find({}).toArray();
      res.send(products);
    });

    // collect single products from database by searching object id
    app.get("/product/:productId", async (req, res) => {
      const productId = req.params.productId;
      const searchId = { _id: ObjectId(productId) };
      const result = await productCollection.findOne(searchId);
      res.send(result);
    });

    // send user to the database in this api end point
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
        expiresIn: "1d",
      });
      res.send({ result, token });
    });
    console.log("mongodb connect");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Carpento Server app listening on port ${port}`);
});
