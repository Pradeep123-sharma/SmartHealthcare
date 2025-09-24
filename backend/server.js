const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./src/app');

dotenv.config({ path: './backend/.env' });

const PORT = process.env.PORT || 5000;

console.log(process.env.DATABASE_URL);
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
.catch(err => {
    console.error('Database connection error:', err);
});