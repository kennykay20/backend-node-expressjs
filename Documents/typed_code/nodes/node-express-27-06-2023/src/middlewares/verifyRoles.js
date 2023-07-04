const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req?.roles) return res.sendStatus(401);
        const headers = req.headers;
        console.log('headers:: ', headers);
        const ip = headers['x-forwarded-for'];
        console.log('ip:: ', ip);
        const rolesArray = [...allowedRoles];
        console.log('rolesArray ', rolesArray);
        console.log('req.roles ', req.roles);
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if(!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles;