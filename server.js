const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;
require("dotenv").config();
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// var ObjectId = require("mongodb").ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xkom1i8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const notesCollection = client.db("notesTaker").collection("notes");

     app.get("/article/:id", async (req, res) => {
       const id = req.params.id;
       console.log("sdasd");
       const query = { _id: ObjectId(id) };

       const result = await notesCollection.findOne(query);

       res.send(result);
     });
    app.get("/", (req, res) => {
      res.send("hello");
    });
    app.get("/notes", async (req, res) => {
      const query = req.query;
      console.log(query);

      const cursor = notesCollection.find(query);

      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/note", async (req, res) => {
      const data = req.body;

      console.log(data);
      const result = await notesCollection.insertOne(data);

      res.send(result);
    });

    app.delete("/note/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };

      const result = await notesCollection.deleteOne(query);

      res.send(result);
    });

   

    console.log("connected");
  } finally {
  }
}

run().catch(console.log);

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
