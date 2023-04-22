import React, { lazy, Suspense } from "react";
import { io } from "socket.io-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
const socket = io("http://localhost:4000"); // connect to the WebSocket server
socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

const Dashboard = lazy(() => import("./components/Dashboard"));
const OrderForm = lazy(() => import("./components/OrderForm"));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OrderForm socket={socket} />} />
        <Route path="/order" element={<OrderForm socket={socket} />} />
        <Route
          exact
          path="/dashboard"
          element={<Dashboard socket={socket} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
