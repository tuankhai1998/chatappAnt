const users = [];

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existringUser = users.find((user) => {
        user.room === room && user.name === name
    })


    if (existringUser) {
        return { error: 'UserName is taken' }
    }

    const user = { id, name, room };

    users.push(user);

    return { user };

}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1);
    }
}

const getUserByID = (id) => {
    const index = users.findIndex((user) => user.id === id);
    return users[index]
}

const getUserInRoom = (room) => {
    return users.filter((user) => user.room === room)
}


module.exports = { addUser, removeUser, getUserInRoom, getUserByID, users };