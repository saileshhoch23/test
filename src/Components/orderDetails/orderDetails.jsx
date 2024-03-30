import React from 'react'

const OrderDetails = (props) => {
  return (
    
    <div className="d-flex align-items-center justify-content-between order-menu style-1 mt-3" >
    <div className="usre-img-details mb-3 d-flex align-items-center justify-content-between">
      <div className="user-img me-3">
        <img
          src={props?.data?.itemImage}
          className="img-fluid"
        />
      </div>
      <div className="user-details">
        <h4 className={`mb-0 ${props?.return == "return"?'text-decoration-line-through':""}`}>{props?.data?.itemName}</h4>
        <span className={props?.return == "return"?'text-decoration-line-through':""}>x{props?.return == "return"? props?.data?.returnItemQty:props?.data?.itemQty}</span>
      </div>
    </div>
    <div className="more-btn">
      <p className={props?.return == "return"?'text-decoration-line-through':""}>₹{props?.data?.itemPrice}</p>
    </div>
  </div>
  )
}

export default OrderDetails;