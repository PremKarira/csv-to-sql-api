const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const db = require("./db");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("csvFile"), async (req, res) => {
  try {
    // Assuming file path is sent in the request body or in env variables
    // let filePath = req.body.filePath || process.env.FILE_PATH;
    let filePath = req.file?.path || req.body.filePath || process.env.FILE_PATH;
    if (!filePath) {
      throw new Error("File path is required.");
    }

    const jsonData = await parseCSV(filePath);
    sample = jsonData[0];
    const ageDistribution = await db.calcAgeDis();

    const DB_name = sample.name.firstName + " " + sample.name.lastName;
    const DB_age = sample.age;
    const DB_address = sample.address || {};
    const temp = Object.assign({}, sample);
    delete temp.name;
    delete temp.age;
    delete temp.address;
    const DB_additionalInfo = temp || null;

    res.render("result", {
      sample,
      ageDistribution,
      DB_name,
      DB_age,
      DB_address,
      DB_additionalInfo,
    });
    await db.uploadData(jsonData);
  } catch (error) {
    console.error("Error uploading data:", error);
    res.status(500).send("Internal server error.");
  }
});

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const jsonData = [];
    const options = {
      delimiter: "\t", // Assuming the delimiter is a tab
    };

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const rows = data.trim().split("\n");
      const headers = rows.shift().split("\t");
      for (const row of rows) {
        const values = row.split("\t");
        const obj = {};

        for (let i = 0; i < headers.length; i++) {
          const header = headers[i].trim();
          const value = values[i].trim();
          const keys = header.split(".");
          let currentObj = obj;

          for (let j = 0; j < keys.length - 1; j++) {
            const key = keys[j];
            currentObj[key] = currentObj[key] || {};
            currentObj = currentObj[key];
          }

          currentObj[keys[keys.length - 1]] = value;
        }

        jsonData.push(obj);
      }

      resolve(jsonData);
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
