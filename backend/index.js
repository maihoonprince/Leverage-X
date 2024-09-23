const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const pnlRoutes = require("./Routes/PnLRoutes.js");
const plansRouter = require('./Routes/plansRouter')

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());

app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);

app.use('/api/pnl', pnlRoutes);

app.use('/api/plans', plansRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})