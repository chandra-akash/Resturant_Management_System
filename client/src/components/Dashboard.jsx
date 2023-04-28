import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { ImCross } from "react-icons/im";

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

  const columns = [
    "Table Number",
    "Order By",
    "Items",
    "Total Items",
    "Bill (Rs.)",
    "Order Time",
    "Status",
  ];
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
              <td>
                {item.items?.map((order) => (
                  <>
                    <div>Item: <b>{order.name}</b></div>
                    <div>Quantity: <b>{order.qty}</b></div>
                    <div>
                      Price: {order.qty} x &#8377; {order.price}/- ={" "}
                      <b>{order.totalPrice}</b>
                    </div>
                    <br />
                  </>
                ))}
              </td>
              <td>{item.totalItems}</td>
              <td>&#x20B9; {item.bill}/-</td>
              <td>{item.timestamp}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {orders.length == 0 ? (
        <>
          <div
            style={{
              color: "gray",
              margin: "auto",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              gap: "13px",
              marginTop: "70px",
              border: "3px solid gray",
              width: "fit-content",
              padding: "20px",
              borderRadius: "25px",
              boxShadow:
                "rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px",
            }}
          >
            <ImCross size={30} />
            <span style={{ fontSize: "30px", marginTop: "-8px" }}>
              No Data Found !
            </span>
          </div>
        </>
      ) : null}
    </>
  );
}

export default Dashboard;
