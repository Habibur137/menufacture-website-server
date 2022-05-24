const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(cors());

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unathorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbiden access" });
    }
    req.decoded = decoded;
    next();
  });
};

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
    const orderCollection = client.db("carpentoDB").collection("orders");
    const reviewCollection = client.db("carpentoDB").collection("reviews");

    const verifyAdmin = async (req, res, next) => {
      const requester = req.decoded?.email;
      const requesterAccount = await userCollection.findOne({
        email: requester,
      });
      if (requesterAccount.role === "admin") {
        next();
      } else {
        return res.status(403).send({ message: "forbiden access" });
      }
    };

    // collect all products from database==========================================
    app.get("/product", async (req, res) => {
      const products = await productCollection.find({}).toArray();
      res.send(products);
    });

    // add a  product to database==========================================
    app.post("/product", verifyJWT, async (req, res) => {
      const product = req.body;
      console.log(product);
      const addedProducts = await productCollection.insertOne(product);
      res.send(addedProducts);
    });

    // collect single products from database by searching object id ================
    app.get("/product/:productId", verifyJWT, async (req, res) => {
      const productId = req.params.productId;
      const searchId = { _id: ObjectId(productId) };
      const result = await productCollection.findOne(searchId);
      res.send(result);
    });

    // update a product after buying some amount =========================================
    app.put("/product/:productId", verifyJWT, async (req, res) => {
      const id = req.params.productId;
      const updatedProduct = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: updatedProduct,
      };
      const products = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(products);
    });

    // order place post api end point ================================================
    app.post("/order", verifyJWT, async (req, res) => {
      const orderInfo = req.body;
      console.log(orderInfo);
      const result = await orderCollection.insertOne(orderInfo);
      res.send(result);
    });

    // collect all order  api end point ================================================
    app.get("/order", verifyJWT, async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.send(result);
    });

    // collect  order specific email id  api end point==========================================
    app.get("/order/:email", verifyJWT, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const buyerEmail = req.params.email;
      if (decodedEmail === buyerEmail) {
        const result = await orderCollection.find({ buyerEmail }).toArray();
        res.send(result);
      } else {
        return res.status(403).send({ message: "forbiden access" });
      }
    });

    // collect single  order  api end point ================================================
    app.get("/order/:email/:orderId", verifyJWT, async (req, res) => {
      const orderId = req.params.orderId;
      const searchById = { _id: ObjectId(orderId) };
      const result = await orderCollection.findOne(searchById);
      res.send(result);
    });

    // reviews place post api end point ================================================
    app.post("/review", verifyJWT, async (req, res) => {
      const reviewInfo = req.body;
      const result = await reviewCollection.insertOne(reviewInfo);
      res.send(result);
    });

    // collect all reviews from database==========================================
    app.get("/review", async (req, res) => {
      const reviews = await reviewCollection.find({}).toArray();
      res.send(reviews);
    });

    // collect all users from database==========================================
    app.get("/user", verifyJWT, async (req, res) => {
      const users = await userCollection.find({}).toArray();
      res.send(users);
    });

    // send user to the database in this api end point ==========================
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

    // make an admin  in this api end point ==========================
    app.put("/user/admin/:email", verifyJWT, verifyAdmin, async (req, res) => {
      const email = req.params.email;
      const filter = { email };
      const updateDoc = {
        $set: { role: "admin" },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    // admin chaking ================================================
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email });
      const isAdmin = user.role === "admin";
      res.send({ admin: isAdmin });
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
