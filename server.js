const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meal_system'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

app.get('/api/meals', (req, res) => {
    const { year, month } = req.query;
    const sql = `SELECT * FROM meals WHERE YEAR(meal_date) = ? AND MONTH(meal_date) = ?`;
    db.query(sql, [year, month], (err, results) => {
        if (err) throw err;
        const meals = {};
        results.forEach(row => {
            const day = new Date(row.meal_date).getDate();
            if (!meals[day]) {
                meals[day] = {};
            }
            meals[day] = {
                breakfast: row.breakfast,
                lunch: row.lunch,
                dinner: row.dinner
            };
        });
        res.json(meals);
    });
});

app.post('/api/meals', (req, res) => {
    const { year, month, day, meal, isChecked } = req.body;
    const meal_date = `${year}-${month}-${day}`;
    const sql = `
        INSERT INTO meals (user_id, meal_date, ${meal}) VALUES (1, ?, ?)
        ON DUPLICATE KEY UPDATE ${meal} = ?
    `;
    db.query(sql, [meal_date, isChecked, isChecked], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Meals updated successfully' });
    });
});

app.post('/api/meals/toggle-all', (req, res) => {
    const { year, month, active } = req.body;
    
    const sql = `
        UPDATE meals 
        SET breakfast = ?, lunch = ?, dinner = ? 
        WHERE user_id = 1 AND YEAR(meal_date) = ? AND MONTH(meal_date) = ?
    `;

    db.query(sql, [active, active, active, year, month], (err, result) => {
        if (err) throw err;

        if (result.affectedRows === 0) {
            // No rows were updated, so we need to insert them.
            // This is a simplified approach. A more robust solution would be to
            // get all days in the month and insert them one by one.
            const daysInMonth = new Date(year, month, 0).getDate();
            let insertSql = 'INSERT INTO meals (user_id, meal_date, breakfast, lunch, dinner) VALUES ';
            const values = [];
            for (let day = 1; day <= daysInMonth; day++) {
                insertSql += '(1, ?, ?, ?, ?),';
                const meal_date = `${year}-${month}-${day}`;
                values.push(meal_date, active, active, active);
            }
            insertSql = insertSql.slice(0, -1); // remove last comma
            db.query(insertSql, values, (err, result) => {
                if (err) throw err;
                res.json({ message: 'All meals for the month updated successfully' });
            });
        } else {
            res.json({ message: 'All meals for the month updated successfully' });
        }
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 