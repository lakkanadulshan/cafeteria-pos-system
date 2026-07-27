const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
    res.json({ message: "Cafeteria POS API is running" });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/menu', require('./routes/menuRouter.js'));
app.use('/api/categories', require('./routes/categoryRoutes.js'));
app.use('/api/orders', require('./routes/orderRoutes.js'));
app.use('/api/users', require('./routes/userRoutes.js'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});