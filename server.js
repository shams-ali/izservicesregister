/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

require('dotenv').config();
const express = require('express');
const path = require('path');
const proxy = require('express-http-proxy');

const app = express();
const PORT = process.env.PORT || 8080;
const API_SERVER_URL = process.env.API_SERVER_URL;

app.use(express.static(path.join(__dirname, 'build')));

app.use('/api', proxy(API_SERVER_URL));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

app.listen(PORT, (err) => console.warn(err || `listening on ${ PORT }`));

