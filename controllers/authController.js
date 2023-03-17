

const AccountDAO = require('../DAO/AccountDAO');

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
    
    if (!user || !pwd) return res.status(404);

    const foundUser = userDB.users.find(person => person.username === user);

    if (!foundUser){
        return res.status(401);//Unauthorized  
    } 

    //evaluate pass
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match){
        const roles = Object.values(foundUser.roles);

        //create JWTs
        const accessToken = jwt.sign(
            { "UserInfo":{
                "username": foundUser.username},
                "roles": roles
            
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s'}
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
        res.header('Authorization', 'Bearer '+ accessToken);
        res.status(200).json({ accessToken });
    }else{
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const loginGet = (req, res) =>{
    res.render('login');
}

// const logoutGet = (req, res) =>{
//     res.clearCookie('jwt',{httpOnly: true});
//     res.redirect('/')
// }

module.exports = { handleLogin,loginGet }