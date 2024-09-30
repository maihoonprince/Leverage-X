const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const plansRouter = require('./Routes/plansRouter');

const stockRoutes = require('./Routes/stockRoutes.js');
const userRoutes = require('./Routes/userRoutes.js');

const watchList1Routes = require('./Routes/watchList1Routes.js');
const watchList2Routes = require('./Routes/watchList2Routes.js');

const pnlRoute = require('./Routes/pnlRoute.js');

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

app.use('/auth', AuthRouter);

app.use('/api/plans', plansRouter);

app.use('/api/stocks', stockRoutes);

app.use('/api/users', userRoutes);

app.use('/api/watchlist1', watchList1Routes);
app.use('/api/watchlist2', watchList2Routes);

app.use('/api', pnlRoute);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})