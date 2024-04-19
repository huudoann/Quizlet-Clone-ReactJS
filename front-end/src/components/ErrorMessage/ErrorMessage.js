import React from "react";
import "./ErrorMessage.scss";

const ErrorMessage = ({ message }) => {
  return <p className="error-message"> {message} </p>;
};

export default ErrorMessage;
