const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const fileUpload = require("express-fileupload");

const db = require("./config/db");
const productRoutes = require("./routings/product");
const userRoutes = require("./routings/user");
const orderRoutes = require("./routings/order");

const eventRoutes = require("./routings/event");
const donationRoutes = require("./routings/donation");

const production = process.env.NODE_ENV === "production";

const multer = require("multer")
require("dotenv").config();

const app = express();

production && app.use(express.static(path.join(__dirname, "../client/build")));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(fileUpload());

// database connection
db.makeDb();

app.use("/products", productRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);

app.use("/donation", donationRoutes);
app.use("/event", eventRoutes);

production && (
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  })
)

// Upload Files
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ("public"))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.' + file.originalname)
  }
})

var upload = multer({ storage: storage }).single('file')

app.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    res.status(200).send(req.file)
    return;
  })
});



const port = 5000;

app.listen(port);