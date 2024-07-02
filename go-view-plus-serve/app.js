const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const config = require('./config')
const { verifyToken } = require('./utils/index')

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true })); // 解析 application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const apiGoviewSysRouter = require('./routes/sys');
const apiGoviewProjectRouter = require('./routes/project');
const apiGoviewDataSourcetRouter = require('./routes/dataSource');
const apiGoviewCustomComponentRouter = require('./routes/cusComponent');

app.use('/api/goview/sys', apiGoviewSysRouter);
app.use('/api/goview/project', apiGoviewProjectRouter);
app.use('/api/goview/dataSource', verifyToken, apiGoviewDataSourcetRouter);
app.use('/api/goview/cusComponent', verifyToken, apiGoviewCustomComponentRouter);

app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.listen(config.port, () => {
    console.log(` app listening on port ${config.port}`)
  })
  
module.exports = app;
