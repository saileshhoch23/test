import React, { useState } from "react";
import "./ordercard.css";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { postJson } from "../../Common/api-instance";
import { Modal } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
const HistoryCard = (props) => {
  const user = useSelector((state) => state?.user);
  const [showMoreItems, setShowMoreItems] = useState(false);
  const [orderListData, setOrderListData] = useState([]);
  const [visible, setVisible] = useState(false);

  const [returnList, setReturnList] = useState({});

  const toggleShowMoreItems = (item) => {
    setOrderListData((previousOrderListData) => {
      if (!previousOrderListData.includes(item)) {
        return [...previousOrderListData, item];
      }

      return previousOrderListData;
    });
    setShowMoreItems(showMoreItems);
  };

  const togglehideItems = (item) => {
    setOrderListData((previousOrderListData) => {
      const updatedOrderListData = previousOrderListData.filter(
        (order) => order.orderId !== item.orderId
      );

      return updatedOrderListData;
    });
  };

  const returnOrder = async (item) => {
    try {
      const responseData = await postJson("order/return_order", returnList);
      if (responseData?.status == "200") {
        props.getData();
        setVisible(false);
        setReturnList({});
      }
    } catch (error) {
      console.error(error);
    }
  };

  const reorderItem = async (item) => {
    let payload = {
      userId: item?.userId,
      canteenId: item?.canteenId,
      orderId: item?.orderId,
    };
    try {
      const responseData = await postJson("order/create_order", payload);
      if (responseData?.status == "200") {
        props.getData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const returnModel = (item, isEdit) => {
    setReturnList(item);
    setVisible(isEdit);
  };

  const handleQtyChange = (index, newQty) => {
    const updatedReturnList = { ...returnList };

    updatedReturnList.orderDetailDtoList[index].itemQty = newQty;
    updatedReturnList.orderDetailDtoList[index].isReturn = true;
    updatedReturnList.orderDetailDtoList =
      updatedReturnList.orderDetailDtoList.filter((item) => item.itemQty > 0);

    let totalItemPrice = 0;
    updatedReturnList.orderDetailDtoList.forEach((item) => {
      totalItemPrice += item.itemPrice * item.itemQty;
    });

    const totalWithTax = totalItemPrice + updatedReturnList.taxAndFees;

    updatedReturnList.totalItemPrice = totalItemPrice;
    updatedReturnList.totalWithTax = totalWithTax;

    setReturnList(updatedReturnList);
  };

  const calculateTotalPrice = (item) => {
    let totalPrice = 0;
    if (item && item.orderDetailDtoList.length > 3) {
      item.orderDetailDtoList.slice(3).forEach((item) => {
        totalPrice += item.itemPrice * item.itemQty;
      });
    }
    return totalPrice;
  };
  return (
    <>
      <div className="row">
        {props?.orderlist?.map((item, keys) => (
          <div
            className="card card-box col-lg-3 col-xl-3 m-1"
            key={item?.orderId}
          >
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="usre-img-details mb-3 d-flex align-items-center justify-content-between">
                  <div className="user-img me-3">
                    <img
                      src={
                         user?.userType == "CANTEEN"
                          ? item?.officeOwnerDto?.companyLogo
                          : item?.canteenDto?.imgPath
                      }
                      className="img-fluid"
                      alt="img"
                    />
                  </div>
                  <div className="user-details">
                    <h5 className="mb-0">
                      {  user?.userType == "USER" ?  "" : user?.userType == "USER"}{" "}
                      { user?.userType == "USER"  ? item?.canteenDto?.canteenName : item?.officeOwnerDto?.officeName}{" "}
                    </h5>
                    <p className="mb-0">
                    {moment(item?.orderCreatedAt, 'x').format('DD MMM YYYY, hh:mm a')}{" "}
                      <small>#{item?.orderId}</small>
                    </p>
                    <p className="mb-0">{ user?.userType == "USER"  ? item?.canteenDto?.buildingName : item?.officeOwnerDto?.buildingName}</p>
                  </div>
                </div>
              </div>
              {item?.orderDetailDtoList?.length > 0 &&
                item?.orderDetailDtoList?.slice(0, 3).map((item, key) => (
                  <>
                    {item?.returnItemQty > 0 && (
                      <>
                        <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
                          <div className="menu-list">
                            <p className="mb-0 text-decoration-line-through">
                              {item.itemName} ({item?.returnItemQty})
                            </p>
                          </div>
                          <div className="menu-total">
                            <p className="mb-0 text-decoration-line-through">
                              ₹{item?.itemPrice}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                    {item?.itemQty > 0 && (
                      <div
                        key={key}
                        className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1"
                      >
                        <div className="menu-list">
                          <p className="mb-0">
                            {item.itemName} ({item?.itemQty})
                          </p>
                        </div>
                        <div className="menu-total">
                          <p className="mb-0">₹{item?.itemPrice}</p>
                        </div>
                      </div>
                    )}
                  </>
                ))}

              {item?.orderDetailDtoList?.length >= 4 &&
                !orderListData?.some(
                  (order) => order.orderId === item?.orderId
                ) && (
                  <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
                    <div className="menu-list">
                      <p className="mb-0">
                        {item?.orderDetailDtoList?.length - 3} more Items{" "}
                        <button
                          className="btn"
                          onClick={() => toggleShowMoreItems(item)}
                        >
                          <img
                            src="assets/images/down-aerrow.png"
                            className="img-fluid"
                            alt="img"
                          />
                        </button>
                      </p>
                    </div>
                    <div className="menu-total">
                      <p className="mb-0">₹{calculateTotalPrice(item)}</p>
                    </div>
                  </div>
                )}

              {orderListData?.some(
                (order) => order.orderId === item?.orderId
              ) &&
                item?.orderDetailDtoList?.length >= 4 && (
                  <>
                    {item.orderDetailDtoList.slice(3).map((item, index) => (
                      <>
                        {item?.returnItemQty > 0 && (
                          <>
                            <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
                              <div className="menu-list">
                                <p className="mb-0 text-decoration-line-through">
                                  {item.itemName} ({item?.returnItemQty})
                                </p>
                              </div>
                              <div className="menu-total">
                                <p className="mb-0 text-decoration-line-through">
                                  ₹{item?.itemPrice}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                        {item?.itemQty > 0 && (
                          <div
                            key={index}
                            className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1"
                          >
                            <div className="menu-list">
                              <p className="mb-0">
                                {item.itemName} ({item?.itemQty})
                              </p>
                            </div>
                            <div className="menu-total">
                              <p className="mb-0">₹{item?.itemPrice}</p>
                            </div>
                          </div>
                        )}
                      </>
                    ))}
                    <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
                      <div className="menu-list">
                        <p className="mb-0">
                          Hide items{" "}
                          <button
                            className="btn"
                            onClick={() => togglehideItems(item)}
                          >
                            <MdOutlineKeyboardArrowUp />
                          </button>
                        </p>
                      </div>
                    </div>
                  </>
                )}

              {item?.canceled === true ? (
                <>
                  <p className="error mt-3">Reject Order </p>

                </>
              ) : item?.delivered === true && user?.userType === "USER" ? (
                <>
                  <div className="d-flex align-items-center justify-content-between pt-3">
                    <div className="menu-btns">
                      <button
                        type="button"
                        className="btn btn-dark me-2"
                        onClick={() => reorderItem(item)}
                      >
                        Reorder
                      </button>
                    {item?.returned == false &&  <button
                        type="button"
                        className="btn btn-dark me-2"
                        onClick={() => returnModel(item, true)}
                      >
                        Return
                      </button>}

                    </div>
                    <div className="menu-total">
                      <p className="mb-0">₹{item.totalWithTax}</p>
                    </div>
                  </div>
                  <div className="del-label">Delivered</div>
                </>
              ) : (
                <div className="menu-btns pt-3 d-flex align-items-center justify-content-between">
                  <button type="button" className="btn btn-dark me-2">
                    {item.orderOtp}
                  </button>

                  <div className="menu-total">
                    <p className="mb-0">{item.totalWithTax}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Modal
        footer={false}
        title=""
        centered
        visible={visible}
        onOk={() => {
          setVisible(false);
        }}
        onCancel={() => {
          setVisible(false);
        }}
        width={500}
      >
        <div className="container">
          <div className="card bg-orange">
            <div className="card-body ">
              <div className="d-flex align-items-center justify-content-between ">
                <div className="usre-img-details d-flex align-items-center justify-content-between">
                  <div className="user-img me-3">
                    <img
                      src={
                        returnList?.canteenDto?.imgPath
                          ? returnList?.canteenDto?.imgPath
                          : "assets/images/user-img.png"
                      }
                      className="img-fluid"
                      alt="img"
                    />
                  </div>
                  <div className="user-details">
                    <h5 className="mb-0">
                      {returnList?.canteenDto?.canteenName}
                    </h5>
                    <p className="mb-0">
                    {moment(returnList?.orderCreatedAt, 'x').format('DD MMM YYYY, hh:mm a')}{" "}
                      <small>#{returnList?.orderId}</small>
                    </p>
                    <h5 className="mb-0">
                      {returnList?.canteenDto?.buildingName}
                    </h5>
                  </div>
                </div>
                <div className="more-btn">
                  <p>₹{returnList?.totalWithTax}</p>
                </div>
              </div>
            </div>
          </div>
          {returnList?.orderDetailDtoList?.map((item, index) => (
            <div className="card add-tocart mt-3" key={index}>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="usre-img-details d-flex align-items-center justify-content-between">
                    <div className="user-img me-3">
                      <img src={item?.itemImage} className="img-fluid" alt="img" />
                    </div>
                    <div className="user-details">
                      <h5 className="mb-0 text-black">{item?.itemName}</h5>
                      <p className="mb-0">₹{item?.itemPrice}</p>
                    </div>
                  </div>
                  <div className="more-btn d-flex align-items-center justify-content-between">
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() =>
                        handleQtyChange(
                          index,
                          item.itemQty > 0 ? item.itemQty - 1 : 0
                        )
                      }
                    >
                      -
                    </button>
                    <p className="mx-2 text-center mb-0">{item?.itemQty}</p>
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() => handleQtyChange(index, item.itemQty + 1)}
                      disabled
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
            <div className="menu-list2">
              <p className="mb-0 text-black">Subtotal</p>
            </div>
            <div className="menu-total2">
              <p className="mb-0">₹{returnList?.totalItemPrice}</p>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
            <div className="menu-list2">
              <p className="mb-0">Tax and Fees</p>
            </div>
            <div className="menu-total2">
              <p className="mb-0">₹{returnList?.taxAndFees}</p>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
            <div className="menu-list2">
              <p className="mb-0">
                Total{" "}
                <small>({returnList?.orderDetailDtoList?.length} items)</small>
              </p>
            </div>
            <div className="menu-total2">
              <p className="mb-0">₹{returnList?.totalWithTax}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 add-order d-flex justify-content-between align-item-center px-3 py-3">
          <div className="">
            <p className="mb-0 ">
              Total items{" "}
              <small>{returnList?.orderDetailDtoList?.length}.</small>
            </p>
            <h6>₹{returnList?.totalWithTax}</h6>
          </div>
          <div className="">
            <button
              className="btn  btn-light w-200"
              type="button"
              onClick={() => returnOrder()}
            >
              return
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default HistoryCard;
