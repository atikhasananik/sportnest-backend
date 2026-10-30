import express from "express";
import cors from "cors";
import { MongoClient as mongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const client = new mongoClient(process.env.MONGODB_URI);
const mongodbConnect = async () => {
  await client.connect();
  console.log("connect successful...!");
  return client;
};

const mongodbClientDatabase = await mongodbConnect();
const sportnest = mongodbClientDatabase.db("sportnest");
const sportsCollections = sportnest.collection("sports");

app.get("/", (req, res) => {
  res.send("hello world ");
});

app.get("/all-sports", async (req, res) => {
  const result = await sportsCollections.find().toArray();
  console.log(result);
  res.send(result);
});

app.get("/get-sports/:id", async (req, res) => {
  const id = req?.params?.id;

  const docLength = await sportsCollections.countDocuments({});

  if (docLength < id) {
    const result = await sportsCollections.find().toArray();
    res.send(result);
    return;
  }

  const result = await sportsCollections.find({}).limit(Number(id)).toArray();

  console.log(result);
  res.send(result);
});

app.listen(PORT, () => {
  console.log("server running..");
});
