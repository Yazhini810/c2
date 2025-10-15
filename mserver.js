/*
HOW TO RUN BACKEND:

1️⃣ Make sure MongoDB is running (mongod)
2️⃣ Run the server: node server.js
3️⃣ Open: http://localhost:4000
*/

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

mongoose.connect('mongodb://127.0.0.1:27017/studentdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✓ MongoDB Connected Successfully'))
.catch(err => console.error('✗ MongoDB Connection Error:', err.message));

const Student = mongoose.model('Student', new mongoose.Schema({
    name: String,
    age: Number
}));

app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/students', async (req, res) => {
    try {
        const s = new Student(req.body);
        await s.save();
        res.json(s);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/students/:id', async (req, res) => {
    try {
        const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!s) return res.status(404).json({ error: 'Student not found' });
        res.json(s);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/students/:id', async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Student not found' });
        res.json({ message: 'deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(4000, () => {
    console.log('✓ Server running on http://localhost:4000');
});
