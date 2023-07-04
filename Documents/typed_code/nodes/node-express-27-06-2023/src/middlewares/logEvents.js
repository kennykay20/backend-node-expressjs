const path = require("path");
const fs = require("fs");
const fsPromise = require("fs").promises;
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "dd-MM-yyyy\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromise.mkdir(path.join(__dirname, '..', 'logs'));
    }
    await fsPromise.appendFile(
      path.join(__dirname, '..', 'logs', logName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

const loggerParams = (req, res, next) => {
    console.log(`${req.method} \t ${req.path}`);
    logEvents(`${req.method} \t ${req.headers.origin} \t${req.url}`, "reqLog.txt");
    next();
}

module.exports = {loggerParams, logEvents};
