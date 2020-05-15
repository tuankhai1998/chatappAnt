const exspress = require('express');
const socketio = require('socket.io');
const http = require('http');

const router = require('./Router');
const { addUser, removeUser, getUserInRoom, getUserByID } = require('./user.js')
const fs = require('fs');

const PORT = process.env.PORT || 5000;

const app = exspress();
const server = http.createServer(app);
const io = socketio(server);



// connection the new user 

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        const { user, error } = addUser({ id: socket.id, name, room });
        let listUser = getUserInRoom(room);
        if (error) {
            return callback(error);
        }

        socket.emit('message', { user: 'admin', id: `${socket.id}`, text: `Hello ${user.name}, Welcome to the room ${user.room}` });
        io.in(room).emit('handleUser', getUserInRoom(room));

        socket.broadcast.to(user.room).emit('message', { user: `${user.name}`, id: `${socket.id}`, text: `${user.name}, has joined!` });

        socket.join(user.room);
        callback({ user, listUser });
    })


    // event handler on client 
    socket.on('sendMessage', (message, sticker, callback) => {
        const user = getUserByID(socket.id);
        if (message === "") {
            io.to(user.room).emit('message', { user: user.name, id: user.id, sticker });
        }
        else {
            io.to(user.room).emit('message', { user: user.name, id: user.id, text: message });
        }
        callback();
    })

    socket.on('sendImage', (base64, callback) => {
        const user = getUserByID(socket.id);
        fs.writeFile('writer.txt', base64, function (err) {
            //Kiểm tra nếu có lỗi thì xuất ra lỗi
            if (err)
                throw err;
            else //nếu không thì hiển thị nội dung ghi file thành công
                console.log('Ghi file thanh cong!');
        })
        socket.emit('imgMessage', base64)
        // callback();  
    })


    socket.on('disconnect', () => {
        const user = getUserByID(socket.id);
        socket.broadcast.to(user.room).emit('message',
            {
                user: `${user.name}`,
                id: `${socket.id}`,
                text: `${user.name}, has disconnected`
            }
        );
        removeUser(socket.id);
        socket.broadcast.to(user.room).emit('handleUser', getUserInRoom(user.room));
    })
})


app.use(router);

server.listen(PORT, () => {
    console.log(`server has started on port ${PORT}`)
});