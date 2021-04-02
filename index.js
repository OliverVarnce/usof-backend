require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require("./src/middlewares/errorHandler");
const paginate = require('express-paginate');

const authRouter = require('./src/routes/auth');
const usersRouter = require('./src/routes/users');
const postRouter = require('./src/routes/post');
const categoryRouter = require('./src/routes/category');
const commentRouter = require('./src/routes/comment');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(paginate.middleware(10, 50));

app.use('/api/auth/', authRouter);
app.use('/api/users/', usersRouter);
app.use('/api/posts/', postRouter);
app.use('/api/categories/', categoryRouter);
app.use('/api/comments/', commentRouter);


app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server started at http://localhost:${PORT}`));
