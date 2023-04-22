import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";

function OrderForm({ socket }) {
  const [tableNumber, setTableNumber] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [checked, setChecked] = useState([]);
  const [menuItems] = useState([
    { id: 1, name: "Burger", price: 10 },
    { id: 2, name: "Pizza", price: 15 },
    { id: 3, name: "Salad", price: 8 },
  ]);

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

  const handleCheck = (event) => {
    const item = event.target.name;
    console.log("item==>", item);
    const isChecked = event.target.checked;

    // setChecked({ ...checked, item: isChecked });
    var updatedList = [...checked];
    let order_item = JSON.parse(event.target.value);
    if (event.target.checked) {
      updatedList = [...checked, order_item];
    } else {
      //   updatedList.slice(checked.indexOf(order_item), 1);
      setChecked((prevState) =>
        !isChecked
          ? [...prevState, item]
          : prevState.filter((checkedItem) => checkedItem !== item)
      );
      //   setChecked(checked.filter((val) => val !== order_item));
    }
    setChecked(updatedList);
  };

  // Return classes based on whether item is checked
  var isChecked = (item) =>
    checked.includes(item) ? "checked-item" : "not-checked-item";

  const handleSubmit = (event) => {
    event.preventDefault();

    const order = {
      tableNumber: tableNumber,
      orderBy: orderBy,
      items: checked,
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "auto",
      }}
    >
      {console.log("checked====> ", checked)}
      <Card
        style={{
          width: "fit-content",
          padding: "100px",
          marginTop: "20px",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset ",
        }}
      >
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
                  onChange={(e) => handleCheck(e)}
                />
                <span className={isChecked(item)}>
                  {item.name} &#8377;{item.price}/-
                </span>
              </div>
            ))}
          </div>
          <br />
          <ul>
            {checked.map((item) => (
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
