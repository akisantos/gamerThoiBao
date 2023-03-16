const userDB = {
    users : require('../models/users.json'),
    setUsers: function (data) { this.users = data}
}

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();
const fsPromises = require('fs').promises;

const handleLogin = async (req,res) => {
    const {user, pwd} = req.body;

    if (!user || !pwd) return res.status(404).json({msg:'usrname and password are required.'});

    const foundUser = userDB.users.find(person => person.username === user);

    if (!foundUser) return res.sendStatus(401); //Unauthorized  

    //evaluate pass
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match){
        //create JWTs
        const accessToken = jwt.sign(
            { "username": foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '60m'}
        );

        const refreshToken = jwt.sign(
            { "username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        );

        //Saving refresh token with current user
        const otherUsers = userDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = {...foundUser, refreshToken};
        userDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname,'..','models','users.json'),
            JSON.stringify(userDB.users)
        );
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000})
        res.json({ accessToken})
    }else{
        res.sendStatus(401);
    }
}

module.exports = { handleLogin }