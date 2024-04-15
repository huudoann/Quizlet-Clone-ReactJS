import React from "react";
import "./SetItem.scss";

const SetItem = (item) => {

  return (
    <div className="set-item">

      <div className="set-item-content">
        <span className="set-item-title">{item.title}</span>
        <div className="set-item-descriptions">
          <div id="rating">5⭐ {item.rating}</div>
        </div>
      </div>

      <div className="set-item-footer">
        <div className="user">
          <span className="user-name">{item.username}</span>
        </div>
        <button className="preview-button" onClick={() => console.log("clicked")}>Xem trước</button>
      </div>
    </div>
  );
};

export default SetItem;
