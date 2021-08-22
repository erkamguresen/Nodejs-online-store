const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

const path = require("path");
const errorController = require("./controllers/errors");

app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes.routes);

app.use(userRoutes);

app.use(errorController.get404Page);

app.listen(3000, () => {
  console.log("listening on port 3000:\nhttp://localhost:3000/");
});
