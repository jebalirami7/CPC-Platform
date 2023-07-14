const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

const contest = require('./Routes/contest');
const problem = require('./Routes/problem');
const example = require('./Routes/example');
const submission = require('./Routes/submission');
const tag = require('./Routes/tag');
const user = require('./Routes/user');

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");
  req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
    req.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});



app.use("/contest", contest);
app.use('/problem', problem);
app.use('/example', example);
app.use('/submission', submission);
app.use('/tag', tag);
app.use('/user', user);

app.use((req, res, next) => {
  const error = new Error("NOT FOUND");
  error.status = 404;
  next(error);
});


app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message,
  });
});


module.exports = app;