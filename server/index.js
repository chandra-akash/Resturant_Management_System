const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
// app.get("/", (req, res) => {
//   res.send("Welcome");
// });
const PORT = 4000;

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("placeOrder", (order) => {
    console.log("New order placed:", order);
    if (
      order &&
      order.tableNumber &&
      order.orderBy &&
      order.totalItems &&
      order.bill &&
      order.timestamp &&
      order.items
    ) {
      if (order.items.find((item) => item.qty === 0)) {
        io.emit("error", "Select the quantity of the Food.");
      } else {
        io.emit("newOrder", order);
      }
    } else {
      io.emit("error", "Select the order properly.");
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
