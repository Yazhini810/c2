import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("MongoDB connection error:", err))

const UserSchema = new mongoose.Schema({ name: String })
const User = mongoose.model("User", UserSchema)

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: "No token provided" })
  const token = authHeader.split(" ")[1]
  if (token !== process.env.ACCESS_TOKEN)
    return res.status(403).json({ error: "Invalid token" })
  next()
}

app.get("/", (req, res) => res.send("Server running"))

app.post("/add", verifyToken, async (req, res) => {
  try {
    const { name } = req.body
    const newUser = new User({ name })
    await newUser.save()
    res.json({ message: "User added successfully" })
  } catch (err) {
    res.status(500).json({ error: "Error adding user" })
  }
})

app.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    await User.findByIdAndDelete(id)
    res.json({ message: "User deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" })
  }
})

app.get("/users", verifyToken, async (req, res) => {
  const users = await User.find()
  res.json(users)
})

app.listen(5000, () =>
  console.log("Server running at http://localhost:5000")
)
