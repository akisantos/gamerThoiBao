const verifyRoles = (...allowedRoles)=>{
    return (req, res, next) =>{
        if (!req?.roles) return res.sendStatus(401);
        const roleArrays = [...allowedRoles]

        console.log(roleArrays)
        console.log(req.roles)
    }
}