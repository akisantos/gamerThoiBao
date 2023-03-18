const userDB = {
    users : require('../models/users.json'),
    setUsers: function (data) { this.users = data}
}


const AccountDAO = require('../DAO/AccountDAO');
const bcrypt = require('bcrypt');

const handleNewUser = async (req,res)=>{
    const {user, pwd} = req.body;

    if (!user || !pwd) return res.status(404).json({msg:'usrname and password are required.'});
    //check for duplicate username in db

    // const duplicate = userDB.users.find(person => person.username === user);
    const duplicate = await AccountDAO.findDuplicate(user);
    console.log(duplicate[0].length);
    if (duplicate[0].length>0) return res.sendStatus(409);
    try {
        //encrypt the pass
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //store the new user
        const newUser = {
            '_login': user,
            '_role': 2023,
            '_password': hashedPwd,
            '_active': 1,
        };

        userDB.setUsers([...userDB.users, newUser]);

        const addedAcc = await AccountDAO.registerNewAccount(newUser);
        console.log(addedAcc)

        res.status(201).json({'success': `New user ${user} created`})
    }catch (err){
        res.status(500).json({ 'msg': err.message})
    }
}

module.exports = {handleNewUser};