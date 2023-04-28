import React, { useState } from "react";
import { Card, Button, Form, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import "./orderform.css";
function OrderForm({ socket }) {
  const [tableNumber, setTableNumber] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Burger", price: 10, qty: 1, totalPrice: 10 },
    { id: 2, name: "Pizza", price: 15, qty: 1, totalPrice: 15 },
    { id: 3, name: "Salad", price: 8, qty: 1, totalPrice: 8 },
  ]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [ordQty, setOrdQty] = useState(0);
  const [ordPrice, setOrdPrice] = useState(0);

  const handleTableNumberChange = (event) => {
    setTableNumber(event.target.value);
  };
  const handleOrderByChange = (event) => {
    setOrderBy(event.target.value);
  };
  const handleCheckboxChange = (selectedObject) => {
    const selectedOptionIds = selectedOptions.map((option) => option.id);
    if (selectedOptionIds.includes(selectedObject.id)) {
      setSelectedOptions(
        selectedOptions.filter((option) => option.id !== selectedObject.id)
      );
      setOrdQty(ordQty - selectedObject.qty);
      setOrdPrice(ordPrice - selectedObject.totalPrice);
    } else {
      setSelectedOptions([...selectedOptions, selectedObject]);
      setOrdQty(ordQty + selectedObject.qty);
      setOrdPrice(ordPrice + selectedObject.totalPrice);
    }
  };

  const handleIncrement = (e, item) => {
    item.qty++;
    item.totalPrice = item.price * item.qty;
    setMenuItems([...menuItems]);
  };

  const handleDecrement = (e, item) => {
    item.qty--;
    item.totalPrice = item.price * item.qty;
    setMenuItems([...menuItems]);
  };

  const handleChange = (event, item) => {
    item.qty = parseInt(event.target.value);
    item.totalPrice = item.price * item.qty;
    setMenuItems([...menuItems]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // arr.find(o => o.name === 'string 1')
    const order = {
      tableNumber: tableNumber,
      orderBy: orderBy,
      items: selectedOptions,
      totalItems: ordQty,
      bill: ordPrice,
      status: "Pending",
      timestamp: new Date().toLocaleString(),
    };

    if (socket.connected) {
      socket.emit("placeOrder", order, (response) => {
        // console.log(response.status); // ok
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your Order has been placed",
          showConfirmButton: false,
          timer: 1500,
        });
      }); // send order to server

      socket.on("error", (err) => {
        console.log("error=> ", order);
        Swal.fire({
          icon: "error",
          title: "Order not placed",
          text: err,
        });
      });
    } else {
      console.log("Server is not connected");
      Swal.fire("Server is not connected!", "Order not placed", "question");
    }

    // reset form
    setTableNumber("");
    setOrderBy("");
    setSelectedOptions([]);
    setMenuItems([
      { id: 1, name: "Burger", price: 10, qty: 1, totalPrice: 10 },
      { id: 2, name: "Pizza", price: 15, qty: 1, totalPrice: 15 },
      { id: 3, name: "Salad", price: 8, qty: 1, totalPrice: 8 },
    ]);
    setOrdQty(0);
    setOrdPrice(0);
  };

  return (
    <div className="main">
      <Card className="card">
        <div className="heading">
          <h2>Welcome to XYZ Restaurant</h2>
        </div>
        <div className="formsection">
          <h3>Place Order</h3>

          <form onSubmit={handleSubmit}>
            <Form.Label>Table Number</Form.Label>
            <Form.Control
              required
              min={1}
              type="number"
              id="tableNumber"
              value={tableNumber}
              onChange={handleTableNumberChange}
            />
            <Form.Label className="mt-3">Ordered By</Form.Label>
            <Form.Control
              required
              type="text"
              id="orderby"
              value={orderBy}
              onChange={handleOrderByChange}
            />
            <h5 className="mt-3">Select Items:</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th></th>
                  <th>Items</th>
                  <th>Quantity</th>
                  <th>Price (Rs.)</th>
                  <th>Total Price (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Check
                        name={index}
                        value={JSON.stringify(item)}
                        type="checkbox"
                        checked={selectedOptions.some(
                          (selectedOption) => selectedOption.id === item.id
                        )}
                        onChange={() => handleCheckboxChange(item)}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>
                      <Form.Group
                        controlId="countOrderInput"
                        className="orderQtyCount"
                      >
                        <Button
                          variant="primary"
                          onClick={(e) => handleIncrement(e, item)}
                          disabled={item.qty > 9999}
                          className="incrbtn"
                        >
                          +
                        </Button>
                        <Form.Control
                          type="number"
                          id={item.id}
                          value={item.qty}
                          onChange={(e) => handleChange(e, item)}
                          style={{ width: "50px" }}
                          disabled={item.qty <= 0}
                          className="inpbtn"
                        />
                        <Button
                          variant="primary"
                          onClick={(e) => handleDecrement(e, item)}
                          disabled={item.qty <= 1}
                          className="decrbtn"
                        >
                          -
                        </Button>
                      </Form.Group>
                    </td>
                    <td style={{ textAlign: "right" }}>{item.price} /- </td>
                    <td style={{ textAlign: "right" }}>
                      {Number(item.qty * item.price)} /-
                    </td>
                  </tr>
                ))}
                <tr>
                  <th colSpan={2}>Total Item(s): </th>
                  <td>{ordQty}</td>
                  <th>Total Bill: </th>
                  <td style={{ textAlign: "right" }}>&#x20B9; {ordPrice} /-</td>
                </tr>
              </tbody>
            </Table>
            <div className="middleAllignment">
              <Button type="submit" disabled={selectedOptions.length == 0}>
                Place Order
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default OrderForm;
