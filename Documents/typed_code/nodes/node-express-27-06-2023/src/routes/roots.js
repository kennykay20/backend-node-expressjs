const express = require('express');
const rootRouter = express.Router();
const path = require('path');

rootRouter.get("^/$|/index(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
  });
  
  rootRouter.get("/tutoria", (req, res) => {
    res.send("tutorial page");
  });
  
  rootRouter.get("/tutoria/:id", (req, res) => {
    console.log(req.params);
    const { id } = req.params;
  
    res.send("tutorial page per id " + id);
  });

module.exports = rootRouter