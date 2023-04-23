import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import "./orderform.css";
function OrderForm({ socket }) {
  const [tableNumber, setTableNumber] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [menuItems] = useState([
    { id: 1, name: "Burger", price: 10 },
    { id: 2, name: "Pizza", price: 15 },
    { id: 3, name: "Salad", price: 8 },
  ]);
  const [selectedOptions, setSelectedOptions] = useState([]);

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
  };

  return (
    <div className="main">
      <Card className="card">
        <div className="heading">
          <h2>Welcome to XYZ Resturent</h2>
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
            {/* <label for="tableNumber">Table Number:</label> <br /> */}
            {/* <input
              required
              type="number"
              id="tableNumber"
              value={tableNumber}
              onChange={handleTableNumberChange}
            /> */}
            <Form.Label>Ordered By</Form.Label>
            <Form.Control
              required
              type="text"
              id="orderby"
              value={orderBy}
              onChange={handleOrderByChange}
            />
            {/* <label for="orderby">Ordered By:</label>
            <br />
            <input
              required
              type="text"
              id="orderby"
              value={orderBy}
              onChange={handleOrderByChange}
            /> */}

            <br />
            <h4>Select Items:</h4>
            <div style={{}}>
              {menuItems.map((item, index) => (
                <div key={index}>
                  {/* <input
                    name={index}
                    value={JSON.stringify(item)}
                    type="checkbox"
                    // onChange={(e) => handleCheck(e, item)}
                    checked={selectedOptions.some(
                      (selectedOption) => selectedOption.id === item.id
                    )}
                    onChange={() => handleCheckboxChange(item)}
                  /> */}
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
                      {item.name} &#8377;{item.price}/-
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
