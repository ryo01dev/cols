'use strict';

const Koa = require('koa');
const serve = require('koa-static');

const app = new Koa();

app.use(serve('./static'));
const server = app.listen(process.env.PORT || 3000);
