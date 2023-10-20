const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { createYoga } = require('graphql-yoga');
const schema = require("./graphql/schema");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const path = require("path");
require('dotenv').config();

const routes = require('./routes/routes')

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['POST', 'PUT'],
  allowedHeaders: ['Authorization', 'Content-type'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname)));
app.use(routes);

app.use(
  '/graphql',
  createYoga({
    schema: schema,
    graphqlEndpoint: '/graphql',
    landingPage: false,
    cors: {
      credentials: true,
      origin: [process.env.CLIENT_URL]
    }
  }
));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(result => {
    app.listen(process.env.PORT);
    console.log('Server started on port ' + process.env.PORT);
  })