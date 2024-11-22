const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

// Initialize the app
const app = express();
app.use(bodyParser.json());
app.use(cors());  // Enable CORS to allow Angular app to communicate with the backend

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Default XAMPP MySQL username
    password: '',  // Default XAMPP MySQL password is empty
    database: 'college_grades'  // Name of your database
});

// Connect to MySQL
db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// POST route for submitting grades
app.post('/grades', (req, res) => {
    const { name, math, science, english, history, geography } = req.body;
    const total = math + science + english + history + geography;
    const percentage = (total / 500) * 100;

    // SQL query to insert grades into the database
    const sql = 'INSERT INTO grades (name, math, science, english, history, geography, percentage) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, math, science, english, history, geography, percentage], (err, result) => {
        if (err) {
            console.error('Error inserting grades:', err);
            return res.status(500).send('Error saving grades');
        }
        res.send('Grades inserted successfully');
    });
});

// GET route to fetch all students' grades and calculate the topper
app.get('/grades', (req, res) => {
    // SQL query to fetch all student grades and percentages
    const sql = 'SELECT * FROM grades ORDER BY percentage DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching grades:', err);
            return res.status(500).send('Error fetching grades');
        }

        // Find the topper (first record in sorted array)
        const topper = results[0] || null;
        res.json({ students: results, topper });
    });
});

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
