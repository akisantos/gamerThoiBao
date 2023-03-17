const userDB = {
    users : require('../models/users.json'),
    setUsers: function (data) { this.users = data}
}


const path = require('path');
require('dotenv').config();
const fsPromises = require('fs').promises;

const handleLogout = async (req,res) => {
    const {user, pwd} = req.body;

    if (!user || !pwd) return res.status(404).json({msg:'usrname and password are required.'});

    const foundUser = userDB.users.find(person => person.username === user);

    if (!foundUser) {
        res.clearCookie('jwt',{httpOnly: true});
        res.redirect('/login');
    }

    const otherUsers = userDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken:''};
    userDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
        path.join(__dirname,'..','models', 'users.json'),
        JSON.stringify(userDB.users)
    );

    res.clearCookie('jwt',{httpOnly: true});
    res.sendStatus(204);

}

module.exports = { handleLogout }