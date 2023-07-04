const path = require("path");
const express = require("express");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 32001;
const { loggerParams } = require("./middlewares/logEvents");
const CORS = require('cors');
const corsOptions = require("./middlewares/corsHandler");
const errorHandler = require("./middlewares/errorHandler");
const credentials = require('./middlewares/credentials');
const rootRouter = require('./routes/roots');
const subdirRouter = require('./routes/subdir');
const empRouter = require('./routes/api/employees');
const userRouter = require('./routes/api/users');
const registerRouter = require("./routes/api/register");
const loginRouter = require("./routes/api/login");
const logoutRouter = require("./routes/api/logout");
const refreshTkRouter = require("./routes/api/refreshtoken");
const verifyJWT = require('./middlewares/verifyJWT');
const cookieParser = require('cookie-parser');
const rolesRouter = require("./routes/api/roles_user");
//const { json } = require("body-parser");

// custom middle logger
app.use(loggerParams);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross origin resource sharing
app.use(CORS(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// built-in for static files, for pages that have static file(s)
app.use(express.static(path.join(__dirname, "/public")));
app.use('/subdir', express.static(path.join(__dirname, "/public")));

app.use('/', rootRouter);
app.use('/subdir', subdirRouter);
app.use('/api/user/register', registerRouter);
app.use('/api/user/login', loginRouter);
app.use('/api/user/refreshtk', refreshTkRouter);
app.use('/api/user/logout', logoutRouter);

app.use(verifyJWT);
app.use('/api/employees', empRouter);
app.use('/api/users', userRouter);
app.use('/api/users/roles', rolesRouter);



//Route Handler
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("Attempted to loan a hello.html page");
    next();
  },
  (req, res) => {
    res.send("Hello Page!");
  }
);

app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')) { 
        res.json({ error: '404 Not Found!'});
    } else {
        res.type('txt').send("404 Not Found!");
    }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
