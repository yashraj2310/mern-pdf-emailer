import 'dotenv/config'; // Loads .env file variables into process.env
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Import router (ensure the path is correct and includes .js extension)
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection (Optional)
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI, {

    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.error('MongoDB Connection Error:', err));
} else {
    console.warn('MONGO_URI not found in .env. Skipping database connection. Data will not be logged.');
}

// API Routes
app.use('/api', apiRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('MERN PDF Emailer Backend is Running (ESM Mode)!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});