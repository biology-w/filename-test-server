const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const serveIndex = require("serve-index");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/files", serveIndex("files"));
app.use("/files", express.static("./files"));

app.use("/upload", express.static("./upload"));

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

// app.get("/download", (req, res) => {
//   try {
//     const filepath = __dirname + "/public/测试.pdf";
//     fs.readFile(filepath, (err, data) => {
//       // res.writeHead(200, {
//       //   "Content-Type": "application/octet-stream",
//       //   "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(
//       //     "测试.pdf"
//       //   )}`,
//       // });
//       res.writeHead(200, {
//         "Content-Type": "application/octet-stream",
//         "Content-Disposition": `attachment;name=${encodeURIComponent(
//           "魏军伟"
//         )}; filename*=UTF-8''${encodeURIComponent("测试-第二那个.pdf")};`,
//       });
//       res.end(data);
//     });
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// });

app.post("/fileUpload", multer({ dest: "./tmp/" }).any(), function (req, res) {
  const files = req.files;
  const body = req.body;
  if (files.length === 0) {
    res.redirect("/upload/");
    return;
  }
  let completeCount = 0;
  files.forEach((file) => {
    if (!fs.existsSync(`files/${body.platform}`)) {
      fs.mkdirSync(`files/${body.platform}`);
    }

    if (!fs.existsSync(`files/${body.platform}/${body.version}`)) {
      fs.mkdirSync(`files/${body.platform}/${body.version}`);
    }
    fs.rename(
      file.path,
      `files/${body.platform}/${body.version}/${file.originalname}`,
      function (err) {
        completeCount += 1;
        if (files.length <= completeCount) {
          res.redirect("/upload/");
        }
      }
    );
  });
});

const port = 9003;
app.listen(9003, () => {
  console.log(`http://localhost:${port} is running`);
});
