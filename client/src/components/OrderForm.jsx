import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import "./orderform.css";
function OrderForm({ socket }) {
  const [tableNumber, setTableNumber] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [checked, setChecked] = useState([]);
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

  //   const handleCheckboxChange = (event) => {
  //     const item = event.target.name;
  //     const isChecked = event.target.checked;
  //     setCheckedItems((prevState) =>
  //       isChecked
  //         ? [...prevState, item]
  //         : prevState.filter((checkedItem) => checkedItem !== item)
  //     );
  //   };

  // const handleCheck = (event) => {
  //   const item = event.target.name;
  //   console.log("item==>", item);
  //   const isChecked = event.target.checked;

  //   // setChecked({ ...checked, item: isChecked });
  //   var updatedList = [];
  //   // var updatedList = [...checked];
  //   let order_item = JSON.parse(event.target.value);
  //   if (event.target.checked) {
  //     updatedList = [...checked, order_item];
  //   } else {
  //     //   updatedList.slice(checked.indexOf(order_item), 1);
  //     // setChecked((prevState) =>
  //     //   !isChecked
  //     //     ? [...prevState, item]
  //     //     : prevState.filter((checkedItem) => checkedItem !== item)
  //     // );
  //   }
  //   setChecked(updatedList);
  // };
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
  // Return classes based on whether item is checked
  // var isChecked = (item) =>
  //   checked.includes(item) ? "checked-item" : "not-checked-item";

  const handleSubmit = (event) => {
    event.preventDefault();

    const order = {
      tableNumber: tableNumber,
      orderBy: orderBy,
      items: selectedOptions,
      status: "Pending",
      timestamp: new Date().toLocaleString(),
    };
    console.log("order==> ", order);

    // socket.on("connect", () => {
    //   console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    // });

    if (socket.connected) {
      socket.emit("placeOrder", order, (response) => {
        console.log(response.status); // ok
      }); // send order to server
    } else {
      console.log("Server is not connected");
    }

    // reset form
    setTableNumber("");
    setOrderBy("");
    setChecked([]);
  };

  return (
    <div className="main">
      <Card className="card">
        <h1>Place Order</h1>
        <form onSubmit={handleSubmit}>
          <label for="tableNumber">Table Number:</label> <br />
          <input
            type="text"
            id="tableNumber"
            value={tableNumber}
            onChange={handleTableNumberChange}
          />
          <br />
          <br />
          <label for="orderby">Ordered By:</label>
          <br />
          <input
            type="text"
            id="orderby"
            value={orderBy}
            onChange={handleOrderByChange}
          />
          <br />
          <br />
          <h4>Select Items:</h4>
          <div style={{}}>
            {menuItems.map((item, index) => (
              <div key={index}>
                <input
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
          <Button type="submit">Place Order</Button>
        </form>
      </Card>
    </div>
  );
}

export default OrderForm;
