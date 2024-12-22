const express = require("express");
const http = require("http");
const mongo = require("mongoose");
const bodyParser = require("body-parser");
const mongoconnection = require("./config/mongoconnection.json");
const { add } = require("./controller/chatController");
var path = require("path");

const { addT } = require("./controller/userController");


// Set the strictQuery option to prevent the warning
mongo.set('strictQuery', false); // or `true` if you prefer strict query filtering



mongo
  .connect(mongoconnection.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true,
  })
  .then(() => {
    console.log("DataBase Connected");
  })
  .catch((err) => {
    console.log(err);
  });


var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// gestion des routes
const UserRouter = require("./routes/user");
app.use("/user", UserRouter);

// Middleware
app.use(express.json());


//creation du serveur
const server = http.createServer(app);



// Partie Socket
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  console.log("User connected");
  socket.emit("msg", "A new user is connected");
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
  socket.on("msg", (data) => {
    console.log("d1" + data);
    add(data);
    io.emit("msg", data);
  });
  socket.on("disconnect", () => {
    io.emit("msg", "An user is diconnected");
  });


  // CRUD Socket Events
  socket.on("user:created", async (user) => {
    try {
      console.log("d1" + user);
      addT(user); 
      //add(user);
      //socket.broadcast.emit("user:created", user);
      socket.broadcast.emit("user:created", user); // Notify all clients except sender
      socket.emit("user:created", user); // Optionally notify the sender
    } catch (err) {
      socket.emit("error", { message: "Failed to create user", error: err });
    }
  });

  socket.on("user:updated", async (user) => {
    try {
      const updatedUser = await UserC.update(user._id, user, {
        new: true,
      });
      socket.broadcast.emit("user:updated", updatedUser);
      
    } catch (err) {
      socket.emit("error", { message: "Failed to update user", error: err });
    }
  });

  socket.on("user:deleted", async (userId) => {
    try {
      await User.findByIdAndDelete(userId);
      socket.broadcast.emit("user:deleted", userId);
    } catch (err) {
      socket.emit("error", { message: "Failed to delete user", error: err });
    }
  });

});


//Lancement du serveur
server.listen(3400, () => console.log("server is run"));
