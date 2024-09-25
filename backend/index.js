const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const pnlRoutes = require("./Routes/PnLRoutes.js");
const plansRouter = require('./Routes/plansRouter');

const stockRoutes = require('./Routes/stockRoutes.js');
const userRoutes = require('./Routes/userRoutes.js');

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

app.use('/auth', AuthRouter);

app.use('/api/pnl', pnlRoutes);

app.use('/api/plans', plansRouter);

app.use('/api/stocks', stockRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})