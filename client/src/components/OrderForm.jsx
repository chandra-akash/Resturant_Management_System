import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import "./orderform.css";
function OrderForm({ socket }) {
  const [tableNumber, setTableNumber] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [menuItems] = useState([
    { id: 1, name: "Burger", price: 10, qty1: 1 },
    { id: 2, name: "Pizza", price: 15, qty2: 1 },
    { id: 3, name: "Salad", price: 8, qty3: 1 },
  ]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [ordQty, setOrdQty] = useState(1);

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
    } else {
      setSelectedOptions([...selectedOptions, selectedObject]);
    }
  };

  const handleIncrement = (e, item) => {
    console.log("line:33--> ", e, item);
    setOrdQty(ordQty + 1);
    item.id == 1
      ? item.qty1++
      : item.id == 2
      ? item.qty2++
      : item.id == 3
      ? item.qty3++
      : null;
  };

  const handleDecrement = (e, item) => {
    setOrdQty(ordQty - 1);
  };

  const handleChange = (event, item) => {
    setOrdQty(parseInt(event.target.value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

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
    setOrdQty(1);
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
            <div style={{}}>
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
                          value={ordQty}
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
            </div>
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
