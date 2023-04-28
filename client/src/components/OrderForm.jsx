import React, { useState } from "react";
import { Card, Button, Form, Table } from "react-bootstrap";
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
    console.log("selectedOptions--> ", selectedOptions);
    console.log("selectedOptionIds--> ", selectedOptionIds);
    console.log("selectedObject--> ", selectedObject);
    setOrdQty(ordQty + selectedObject.qty);
    setOrdPrice(ordPrice + selectedObject.totalPrice);
    if (selectedOptionIds.includes(selectedObject.id)) {
      setSelectedOptions(
        selectedOptions.filter((option) => option.id !== selectedObject.id)
      );
    } else {
      setSelectedOptions([...selectedOptions, selectedObject]);
    }
  };

  const handleIncrement = (e, item) => {
    console.log("line:33--> ", e, item);
    // setOrdQty(ordQty + 1);
    item.qty++;
    item.totalPrice = item.price * item.qty;
    setMenuItems([...menuItems]);
  };

  const handleDecrement = (e, item) => {
    // setOrdQty(ordQty - 1);
    item.qty--;
    item.totalPrice = item.price * item.qty;
    setMenuItems([...menuItems]);
  };

  const handleChange = (event, item) => {
    // setOrdQty(parseInt(event.target.value));
    item.qty = parseInt(event.target.value);
    item.totalPrice = item.price * item.qty;
    setMenuItems([...menuItems]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("selectedOptions===> ", selectedOptions);
    const order = {
      tableNumber: tableNumber,
      orderBy: orderBy,
      items: selectedOptions,
      status: "Pending",
      timestamp: new Date().toLocaleString(),
    };

    if (socket.connected) {
      socket.emit("placeOrder", order, (response) => {
        // console.log(response.status); // ok
      }); // send order to server
    } else {
      console.log("Server is not connected");
    }

    // reset form
    setTableNumber("");
    setOrderBy("");
    setSelectedOptions([]);
    // setOrdQty(1);
    setMenuItems([
      { id: 1, name: "Burger", price: 10, qty: 1, totalPrice: 10 },
      { id: 2, name: "Pizza", price: 15, qty: 1, totalPrice: 15 },
      { id: 3, name: "Salad", price: 8, qty: 1, totalPrice: 8 },
    ]);
  };

  return (
    <div className="main">
      <Card className="card">
        <div className="heading">
          <h2>Welcome to XYZ Restaurant</h2>
        </div>
        <div className="formsection">
          <h1>Place Order</h1>

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
            <br />
            <h4>Select Items:</h4>
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
                    {/* <div className="itemcheckbox"> */}
                    <td>
                      <Form.Check
                        name={index}
                        value={JSON.stringify(item)}
                        type="checkbox"
                        // onChange={(e) => handleCheck(e, item)}
                        checked={selectedOptions.some(
                          (selectedOption) => selectedOption.id === item.id
                        )}
                        onChange={() => handleCheckboxChange(item)}
                      />
                    </td>
                    {/* <span> */}
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
                    {/* </span> */}
                    {/* </div> */}
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
            {/* <div style={{}}>
              {menuItems.map((item, index) => (
                <div key={index}>
                  <div className="itemcheckbox">
                    <Form.Check
                      name={index}
                      value={JSON.stringify(item)}
                      type="checkbox"
                      // onChange={(e) => handleCheck(e, item)}
                      checked={selectedOptions.some(
                        (selectedOption) => selectedOption.id === item.id
                      )}
                      onChange={() => handleCheckboxChange(item)}
                    />
                    <span>
                      {item.name} &#8377;{item.price}/- x
                      <Form.Group
                        controlId="countOrderInput"
                        className="orderQtyCount ms-3 mt-3"
                      >
                        <Button
                          variant="primary"
                          onClick={(e) => handleIncrement(e, item)}
                        >
                          +
                        </Button>
                        <Form.Control
                          type="number"
                          id={item.id}
                          value={item.qty}
                          onChange={(e) => handleChange(e, item)}
                          style={{ width: "50px" }}
                        />
                        <Button
                          variant="primary"
                          onClick={(e) => handleDecrement(e, item)}
                        >
                          -
                        </Button>
                      </Form.Group>
                    </span>
                  </div>
                </div>
              ))}
            </div> */}
            <br />
            <ul>
              {selectedOptions.map((item) => (
                <li key={item.id}>
                  {item.name} (&#8377;{item.price})
                </li>
              ))}
            </ul>
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
