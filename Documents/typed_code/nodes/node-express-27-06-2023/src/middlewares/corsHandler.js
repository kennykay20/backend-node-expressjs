const allowedOrigins = require('../config/allowedOrigins');

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = corsOptions;
