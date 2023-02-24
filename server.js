const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.static("./public"));

app.all("*", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  if (req.method.toLowerCase() == "options") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get("/download", (req, res) => {
  try {
    const filepath = __dirname + "/public/测试.pdf";
    fs.readFile(filepath, (err, data) => {
      // res.writeHead(200, {
      //   "Content-Type": "application/octet-stream",
      //   "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(
      //     "测试.pdf"
      //   )}`,
      // });
      res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename=${encodeURIComponent(
          "测试.pdf"
        )}`,
      });
      res.end(data);
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.listen(8001, () => {
  console.log("http://localhost:8001 is running");
});
