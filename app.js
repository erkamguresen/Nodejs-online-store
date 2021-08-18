const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

const path = require("path");

app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);

app.use(userRoutes);

//can delete later
app.set("title", "My Site");
console.log(app.get("title"));

app.use((req, res) => {
  // res.status(404).sendFile(path.join(__dirname, "./views/404.html"));
  res.status(404).render("404");
});

app.listen(3000, () => {
  console.log("listening on port 3000:\nhttp://localhost:3000/");
});
