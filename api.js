const express = require('express');
const app = express();
app.use(express.json());
let students = [];
let idCounter = 1;
// Create student
app.post('/students', (req, res) => {
    const student = { id: idCounter++, ...req.body };
    students.push(student);
    res.status(201).json(student);
});
// Get all students
app.get('/students', (req, res) => {
    res.json(students);
});
// Get student by ID
app.get('/students/:id', (req, res) => {
    const student = students.find(s => s.id == req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
});
// Delete student
app.delete('/students/:id', (req, res) => {
    students = students.filter(s => s.id != req.params.id);
    res.json({ message: 'Student deleted' });
});
// Start server
app.listen(4000, () => console.log('Server running on port 4000'));
//http://localhost:3000/students
//{
  "name": "Yazhini",
  "age": 21,
  "grade": "A"
}//
app.delete('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    students = students.filter(s => s.id !== id);
    res.json({ message: 'deleted' });
});