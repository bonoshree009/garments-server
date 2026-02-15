const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o1xwxs0.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});


  
    //user api
 async function run() {
  try {
    await client.connect();
    console.log("✅ MongoDB Connected");

    const database = client.db("garmentsdb");
    const usersCollection = database.collection("users"); // সঠিক variable name

    // ===============================
    // POST /users - Save new user
    // ===============================
    app.post('/users', async (req, res) => {
      try {
        const newUser = req.body;
        const email = newUser.email;

        const existingUser = await usersCollection.findOne({ email }); // Correct name

        if (existingUser) {
          return res.status(200).json({ message: 'User already exists' });
        }

        const result = await usersCollection.insertOne(newUser);
        res.status(201).json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // ===============================
    // GET /users - Get all users
    // ===============================
    app.get('/users', async (req, res) => {
      try {
        const cursor = usersCollection.find(); // Correct name
        const result = await cursor.toArray();
        res.send(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });


    // ===============================
    // 🔹 2. Get User by Email
    // ===============================
    app.get("/users/:email", async (req, res) => {
  const email = req.params.email;
  const user = await usersCollection.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});
   
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => res.send('Users server is running'));
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
