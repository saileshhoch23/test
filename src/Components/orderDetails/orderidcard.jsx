import moment from "moment";
import React from "react";
import { GrFormNext } from "react-icons/gr";

const Orderidcard = (props) => {

  return (
    <div
      className={`orderin-bx d-flex align-items-center justify-content-between ${
        props?.data?.orderId == props?.orderDetils?.orderId ? "active" : ""
      }`}	  
    
      onClick={() => props.setOrderDetils(props?.data)}
    >
      <div>
        <h4>Order #{props?.data?.orderId}</h4>
        <span>{moment(props?.data?.orderCreatedAt, "x").format("DD MMM YYYY, hh:mm a")}
        </span>
      </div>
      <div className="d-flex align-items-center">
        <h4 className="text-primary mb-0">₹{props?.data?.totalWithTax}</h4>
        <a className="icon-bx" >
          <GrFormNext />
        </a>
      </div>
    </div>
  );
};

export default Orderidcard;
