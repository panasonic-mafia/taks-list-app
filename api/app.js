const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require("./routes")
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const path = require("path")

//load env vars
dotenv.config({ path: './config/config.env'});

//connect to db
connectDB();

const app = express();

app.use(cors())

app.use(cookieParser('f9131f4e-2ceb-430b-b16a-a31a42dce7ba'))

app.use(express.json());

app.use('/api/v1/', routes)

app.use(express.static(path.join(__dirname, "/ui/build")));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/ui/build', 'index.html'));
  });

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
})