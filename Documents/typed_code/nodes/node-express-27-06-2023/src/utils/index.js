const jwt = require('jsonwebtoken');

const jwtShortAccessToken = async (userId, role, secret) => {
    return jwt.sign(
        {
            "UserInfo": {
                "userId": userId,
                "roles": role
            }
        },
        secret,
        {
            expiresIn: '3600s' //5mins or 300
        }
    )
}

const jwtLongAccessToken = async (userId, role, secret) => {
    return jwt.sign(
        {
            "UserInfo": {
                "userId": userId,
                "roles": role
            }
        },
        secret,
        {
            expiresIn: '365d' //1yr
        }
    )
}

const jwtRefreshToken = async (userId, role, secret) => {
    return jwt.sign(
        {
            "UserInfo": {
                "userId": userId,
                "roles": role
            }
        },
        secret,
        {
            expiresIn: '1d'
        }
    )
}

const jwtVerifyToken = async (token, refreshSecret, accessSecret) => {

    let isAccessToken = false;
    const verify = jwt.verify(token, refreshSecret, (err, decoded) => {
        if(err || !decoded?.username) return res.sendStatus(403); //forbiddem invalid token
        const accessToken = jwt.sign(
            {

            },
            accessSecret,
            {
                expiresIn: '3600s'
            }
        )
        return accessToken;
    });
    return verify;
}

module.exports = { jwtShortAccessToken, jwtRefreshToken, jwtVerifyToken };