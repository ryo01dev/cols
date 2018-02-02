'use strict';

const Koa = require('koa');
const serve = require('koa-static');

const app = new Koa();

app.use(serve('./static'));
const server = app.listen(process.env.PORT || 3000);

const io = require('socket.io').listen(server);

io.on('connection', (socket) => {//to each one client.
    console.log("connected. socket id:", socket.id);

    socket.on('color', (msg) => {
        console.log("color:", msg);
        socket.broadcast.emit('color', msg);
    });

});
