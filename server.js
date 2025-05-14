const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./utils/connectDB.js');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const blogRoutes = require('./routes/blogRoutes.js');
// payment 
// const paymentRoutes = require('./routes/paymentRoutes'); 

const cors = require('cors');





const app = express();

// dotenv.config();
app.use(express.json());


const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') }); 


app.use(cors({
  origin: 'https://statuesque-vacherin-b43544.netlify.app', // ✅ NO trailing slash!
  credentials: true,
}));
  
app.get('/',(req,res)=>{
    res.send('<center><h1>.......</h1></center>');

});



// Authentication Route
app.use('/api/auth', require('./routes/authRoutes'));
// Products Route
app.use('/api/products', productRoutes);
// Cart endpoint
app.use('/api/user', require('./routes/cartRoutes'));
// Order endpoint
app.use('/api/orders', require('./routes/orderRoutes'));
// Review endpoint
app.use('/api/products', reviewRoutes);
// Category endpoints
app.use('/api/categories',categoryRoutes);
// Blog endpoints
app.use('/api/blogs', blogRoutes);
// Payment routes
// app.use('/api/payment', paymentRoutes); 

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    connectDB();
    console.log(`server is listening at port no (${port})`);
    
})