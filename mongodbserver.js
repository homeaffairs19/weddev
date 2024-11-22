const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection URI with correct credentials and database name
const uri = 'mongodb+srv://pandeyharsh190902:Satwikpandey%4003@cluster0.vmrwa.mongodb.net/studentGrades?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define the student schema and model
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    math: { type: Number, required: true },
    science: { type: Number, required: true },
    english: { type: Number, required: true },
    history: { type: Number, required: true },
    geography: { type: Number, required: true },
    totalPercentage: { type: Number, required: true }
});

const Student = mongoose.model('Student', studentSchema);

// Route to submit grades (POST request)
app.post('/grades', (req, res) => {
    const grades = req.body;
    const total = grades.math + grades.science + grades.english + grades.history + grades.geography;
    const totalPercentage = (total / 500) * 100;

    // Create a new student record
    const newStudent = new Student({
        name: grades.name,
        math: grades.math,
        science: grades.science,
        english: grades.english,
        history: grades.history,
        geography: grades.geography,
        totalPercentage: totalPercentage
    });

    // Save the new student record to the database
    newStudent.save()
        .then(() => {
            res.status(201).json({ message: 'Grades submitted successfully' });
        })
        .catch(err => {
            console.error('Error saving grades:', err);
            res.status(500).json({ error: 'Error saving grades' });
        });
});

// Route to get all students and the topper (GET request)
app.get('/grades', (req, res) => {
    Student.find()
        .then(students => {
            if (students.length === 0) {
                return res.status(200).json({ students: [], topper: null });
            }

            // Find the topper (student with the highest totalPercentage)
            const topper = students.reduce((prev, current) => (prev.totalPercentage > current.totalPercentage) ? prev : current);

            res.status(200).json({ students: students, topper: topper });
        })
        .catch(err => {
            console.error('Error fetching students:', err);
            res.status(500).json({ error: 'Error fetching students' });
        });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
