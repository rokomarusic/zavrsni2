const express = require('express');
const app = express();
const db = require('./db')
const path = require('path');
const pg = require('pg');
const cors = require('cors');

const homeRouter = require('./routes/home.routes');
const adminRouter = require('./routes/admin.routes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );



app.use('/', homeRouter);
app.use('/admin', adminRouter);

app.listen(process.env.PORT || 3001, () => console.log("listening at 3001"));
