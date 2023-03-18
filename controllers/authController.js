

const AccountDAO = require('../DAO/AccountDAO');
const AccountSchema = require('../models/Account')

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

    // const foundUser = userDB.users.find(person => person.username === user);
    const foundUser = await AccountDAO.findDuplicate(user);

    if (foundUser[0].length == 0){
        return res.status(401);//Unauthorized  
    } 

    const foundAccount = foundUser[0][0];

    //evaluate pass
    const match = await bcrypt.compare(pwd, foundAccount._password);
    if (match){
        const roles = Object.values(foundAccount._role);

        //create JWTs
        const accessToken = jwt.sign(
            { "UserInfo":{
                "username": foundAccount._username},
                "roles": roles
            
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s'}
        );

        const refreshToken = jwt.sign(
            { "username": foundAccount.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        );

        //Saving refresh token with current user
        const otherUsers = userDB.users.filter(person => person.username !== foundAccount.username);
        const currentUser = {...foundUser, refreshToken};
        console.log(currentUser);
        // userDB.setUsers([...otherUsers, currentUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname,'..','models','users.json'),
        //     JSON.stringify(userDB.users)
        // );
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