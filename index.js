const restify = require("restify");
const mongoose = require("mongoose");

const server = restify.createServer();

server.use(restify.plugins.bodyParser());

server.listen("8080", () => {
  console.log("all ok");
  mongoose.connect(
    "mongodb+srv://admin:admin@cluster0-pzrok.gcp.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
});

const db = mongoose.connection;

db.on("error", err => console.log(err));

db.once("open", () => {
  require("./routes/users")(server);
  require("./routes/stickers")(server);
  console.log("server start");
});
