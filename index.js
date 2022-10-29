require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { connectToServer } = require("./db/connectDB");
const port = process.env.PORT || 5000;
const app = require("./app/app");
const { verifyJWT } = require("./middleware/verifyToken");

connectToServer((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log(`Carpento Server app listening on port ${port}`);
    });
  } else {
    console.log(err);
  }
});

// async function run() {
//   try {
//     await client.connect();

//     const orderCollection = client.db("carpentoDB").collection("orders");
//     const paymentCollection = client.db("carpentoDB").collection("payments");
//     const profileCollection = client.db("carpentoDB").collection("profiles");

//     // create payment intent
//     app.post("/create-payment-intent", verifyJWT, async (req, res) => {
//       const { paybleAmount } = req.body;
//       const amount = paybleAmount * 100;
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: amount,
//         currency: "usd",
//         payment_method_types: ["card"],
//       });
//       res.send({
//         clientSecret: paymentIntent.client_secret,
//       });
//     });

//     app.patch("/order/:id", async (req, res) => {
//       const id = req.params.id;
//       const payment = req.body;
//       const filter = { _id: ObjectId(id) };
//       const updateDoc = {
//         $set: {
//           paid: true,
//           transactionId: payment.transactionId,
//         },
//       };
//       const result = await paymentCollection.insertOne(payment);
//       const updatedOrder = await orderCollection.updateOne(filter, updateDoc);
//       res.send(result);
//     });

//     // update a user profile  ========================================================
//     app.put("/profile/:email", verifyJWT, async (req, res) => {
//       const email = req.params.email;
//       console.log(email);
//       const updatedInfo = req.body;
//       const filter = { email };
//       const options = { upsert: true };
//       const updateDoc = {
//         $set: updatedInfo,
//       };
//       const result = await profileCollection.updateOne(
//         filter,
//         updateDoc,
//         options
//       );
//       res.send(result);
//     });

//     console.log("mongodb connect");
//   } finally {
//     // await client.close();
//   }
// }
// run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("health route");
});
