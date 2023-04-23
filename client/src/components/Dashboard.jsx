import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

function Dashboard({ socket }) {
  const [orders, setOrders] = useState([]);
  // console.log("socket==> ", socket);
  useEffect(() => {
    // listen for "newOrder" event from server
    socket.on("newOrder", (order) => {
      setOrders((orders) => [...orders, order]); // add new order to state
    });

    // listen for "orderStatusUpdate" event from server
    socket.on("orderStatusUpdate", (updatedOrder) => {
      setOrders((orders) =>
        orders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      ); // update existing order in state
    });
  }, []);

  const columns = ["Table Number", "Order By", "Items", "Order Time", "Status"];
  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders?.map((item) => (
            <tr key={item.tableNumber}>
              <td>{item.tableNumber}</td>
              <td>{item.orderBy}</td>
              {item.items?.map((order) => (
                <>
                  <div>ID: {order.id}</div>
                  <div>Name: {order.name}</div>
                  <div>Price: &#8377; {order.price}/-</div>
                  <br />
                </>
              ))}
              <td>{item.timestamp}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Dashboard;
