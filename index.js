const express = require("express");
const configuration = require("./configuration.js");
const app = express();
var cookieParser = require("cookie-parser");
const userRouter = require("./Routes/user.routes.js");
const votingRouter = require("./Routes/voting.routes.js");
const cors = require("cors");
const DB_CONNECTION = require("./DB/DB_CONNECTION.js");

DB_CONNECTION();
app.use(
 cors({ credentials: true, origin: "https://devote-frontend.vercel.app" })
);
app.use(express.json());
app.use(cookieParser());
app.use("/user", userRouter);
app.use("/voting", votingRouter);

const port = 3000;
app.listen(port, () => {
 console.log("API server is listening on port 3000");
});
