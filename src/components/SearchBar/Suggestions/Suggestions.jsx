import React from "react";

import "./Suggestions.css";

export default function Suggestions(props) {
  const suggestionClickHandler = (e) => {
    props.suggestionClickHandler(e.currentTarget.id);
  };

  const borders = {
    border: "1px solid #eee",
    boxShadow: "0 2px 3px #ccc",
    boxSizing: "border-box",
  };

  let suggestions = props.suggestions.map((s, index) => {
    return (
      <div
        className="w-full suggestion-item"
        style={{ background: "#3f3e45" }}
        key={index}
        id={s.text}
        onMouseDown={suggestionClickHandler}
      >
        {s.text}
      </div>
    );
  });

  return (
    <div className="w-full" style={borders}>
      {suggestions}
    </div>
  );
}
