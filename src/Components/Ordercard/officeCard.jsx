import React, { useEffect, useState } from "react";
import "./ordercard.css";
import "../Sidebar/sidebar.css";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { Modal } from "antd";
import { MdClose } from "react-icons/md";
import { postJson } from "../../Common/api-instance";
import { Dropdown } from "react-bootstrap";
import { RiMoreFill } from "react-icons/ri";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import moment from "moment";
const OfficeCard = (props) => {
  const userType =  useSelector(state=> state?.user)

  const [showMoreItems, setShowMoreItems] = useState(false);
  const [orderListData, setOrderListData] = useState([]);
  const [editeData, setEditeData] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [visible, setVisible] = useState(false);
  // const [count, setCount] = useState(3);
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
  useEffect(() => {
    if (editeData?.orderDetailDtoList) {
      let count = 0;
      editeData?.orderDetailDtoList.forEach((item) => {
        count += item.itemQty || 0;
      });
      setTotalCount(count);
    }
  }, [editeData]);


  const cancelOrder = async (item) => {
    try {
      const responseData = await postJson("order/cancel_order", {
        orderId: item?.orderId,
        canteenId: item?.canteenId,
      });

      if (responseData) {
        props.getData();
      }
    } catch (error) {
      console.error(error);
      toast.error(`${error}`);
    } finally {
    }
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
        {props.orderlist?.map((item, index) => (
          <div className="card card-box col-lg-3 col-xl-3 m-1" key={index}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="usre-img-details mb-3 d-flex align-items-center justify-content-between">
                  <div className="user-img me-3">
                    <img
                      src={
                       userType?.userType === "CANTEEN"
                          ? item?.officeOwnerDto?.companyLogo
                          : item?.canteenDto?.imgPath
                      }
                      className="img-fluid"
                      alt="img"
                    />
                  </div>
                  <div className="user-details">
                    <h5 className="mb-0">
                
                      {item?.canteenDto?.canteenName}{" "}
                    </h5>
                    <p className="mb-0">
                    {moment(item?.orderCreatedAt, 'x').format('DD MMM YYYY, hh:mm a')}{" "}
                      <small>#{item?.orderId}</small>
                    </p>
                    <p className="mb-0">{item?.canteenDto?.buildingName}</p>
                  </div>
                </div>
                {userType?.userType === "USER" && <Dropdown>
                  <div className="more-btn">
                    <Dropdown.Toggle id="dropdown-basic">
                      <RiMoreFill />
                    </Dropdown.Toggle>
                  </div>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        cancelOrder(item);
                      }}
                    >
                      cancel order
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown> }
              </div>
              {item?.orderDetailDtoList?.length > 0 &&
                item?.orderDetailDtoList?.slice(0, 3).map((item, index) => (
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
                      <p className="mb-0">{item?.itemPrice}</p>
                    </div>
                  </div>
                ))}

              {item?.orderDetailDtoList?.length >= 4 &&
                !orderListData.some(
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

              {orderListData.some((order) => order.orderId === item?.orderId) &&
                item?.orderDetailDtoList?.length >= 4 && (
                  <>
                    {item.orderDetailDtoList.slice(3).map((item, index) => (
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
                          <p className="mb-0">{item?.itemPrice}</p>
                        </div>
                      </div>
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
                <div className="menu-btns pt-3 d-flex justify-content-between" >
                {item?.canceled ?   <>
                  <p className="error mt-3">Reject Order </p></>:
                  <button type="button" className="btn btn-dark me-2">
                    {item.orderOtp}
                  </button>}
                   <div className="menu-total">
                      <p className="mb-0">₹{item.totalWithTax}</p>
                    </div>
                </div>     
             {item?.delivered && <div className="del-label">Delivered</div>}
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
        <form>
          <h5 className="text-center">
            {editeData?.officeOwnerDto?.officeName}
          </h5>
          <p className="text-center">{editeData?.officeOwnerDto?.officeNo}</p>
          {editeData?.orderDetailDtoList?.map((item, index) => (
            <div className="card add-tocart mt-3" key={index}>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="usre-img-details d-flex align-items-center justify-content-between">
                    <div className="user-img me-3">
                      <img
                        src={
                          editeData?.canteenDto?.imgPath
                            ? item?.canteenDto?.imgPath
                            : "assets/images/user-img.png"
                        }
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                    <div className="user-details">
                      <h5 className="mb-0 text-black">{item?.itemName}</h5>
                      <p className="mb-0">Total item ({item?.itemQty})</p>
                    </div>
                  </div>
                  <div className="more-btn d-flex align-items-center justify-content-between">
                    <button
                      type="button"
                      className="btn  btn-outline-secondary"
                    >
                      <MdClose />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1 mt-5">
            <div className="menu-list2">
              <p className="mb-0 text-black">Subtotal</p>
            </div>
            <div className="menu-total2">
              <p className="mb-0">₹144</p>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
            <div className="menu-list2">
              <p className="mb-0">Tax and Fees</p>
            </div>
            <div className="menu-total2">
              <p className="mb-0">₹55</p>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
            <div className="menu-list2">
              <p className="mb-0">
                Total <small>({totalCount} items)</small>
              </p>
            </div>
            <div className="menu-total2">
              <p className="mb-0">₹{44}</p>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default OfficeCard;
