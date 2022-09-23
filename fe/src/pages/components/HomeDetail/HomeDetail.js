import React from "react";
import "./style.css";

function HomeDetail(props) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <>
      {userInfo.map((item) => (
        <div class="contain">
          <div class="content-card">
            <h1>{item.name}</h1>
            <h3>
              I love designing websites and keep things as simple as possible.
              My goals is to focus on minimalism and conveying the message that
              you want to send
            </h3>
            <h4>{item.address}</h4>
            <h4>{item.age}</h4>
          </div>
          <div class="flap"></div>
        </div>
      ))}
    </>
  );
}

export default HomeDetail;
