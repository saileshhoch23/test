import React, { useEffect, useState } from "react";
import "./ordercard.css";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { Modal } from "antd";
import { MdClose } from "react-icons/md";
import { postJson } from "../../Common/api-instance";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import moment from "moment";


export const OrderCard = (props) => {
  const userType =  useSelector(state=> state?.user)
  const [submitloader, setSubmitLoader] = useState(false);
  const [showMoreItems, setShowMoreItems] = useState(false);
  const [orderListData, setOrderListData] = useState([]);
  const [editeData, setEditeData] = useState({});
  const [otpList, setOtpList] = useState({});
  const [orderDetailbyid, setOrderDetailbyid] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(3);
          
  const toggleShowMoreItems = (item) => {
    setOrderListData((previousOrderListData) => {
      if (!previousOrderListData.includes(item)) {
        return [...previousOrderListData, item];
      }

      return previousOrderListData;
    });
    setShowMoreItems(showMoreItems);
  };


  useEffect(() => {
    getData();
  }, [editeData]);
  const getData = async () => {
    try {
      const payload = {
        orderId: editeData?.orderId,
        canteenId: editeData?.canteenDto?.canteenId,
      };
      const responseData = await postJson("order/get_order", payload);
      if (responseData && responseData?.data) {
        setOrderDetailbyid(responseData?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateOrder = async (item) => {
  
    try {
      const responseData = await postJson("order/update_order", {
        orderId: orderDetailbyid?.orderId,
        orderDetailId: item,
      });
      if (responseData) {
        getData();
        props.getData();
      }
    } catch (error) {
      console.error(error);
      toast.error(`${error}`);
    } finally {
    }
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
    if (orderDetailbyid?.orderDetailDtoList) {
      let count = 0;
      orderDetailbyid?.orderDetailDtoList.forEach((item) => {
        count += item.itemQty || 0;
      });
      setTotalCount(count);
    }
  }, [orderDetailbyid]);

  const onShowmodel = (item, isEdit) => {
    setVisible(isEdit);
    setEditeData(item);
  };
 const [itemData, setItemData] = useState(null)

  const handleOrderAccept = async (item) => {
setItemData(item)
    setSubmitLoader(true);
  
    await props?.orderAccept(item, (responseData) => {
      if(responseData){
      setSubmitLoader(false);
      }
    });
  };
 const [otploader, setOtpLoader] =useState(false)
  const otpForm = useFormik({
    initialValues: {
      orderOtp: "",
    },
    validationSchema: Yup.object({
      orderOtp: Yup.string().required("Otp is required*"),
    }),
    onSubmit: async (values) => {
      setOtpLoader(true)
     let item = {
      userId: otpList?.officeOwnerDto?.officeOwnerId,
      orderId: otpList?.orderId,
      canteenId: otpList?.canteenDto?.canteenId,
      orderOtp:values?.orderOtp
     }
      await props?.Otpverifaction(item, (responseData) => {
        otpForm.resetForm();
        props.handelModelClose();
        setOtpLoader(false)
      });
    },
  });

  const cancelOrder =async (item) => {

    
    try {
      const responseData = await postJson("order/cancel_order", {
        orderId: item?.orderId,
        canteenId: item?.canteenDto?.canteenId,
      });
      if (responseData) {
        getData();
        props.getData();
      }
    } catch (error) {
      console.error(error);
      toast.error(`${error}`);
    } finally {
    }
  }
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
        {props?.orderlist?.map((item, index) => (
          <div className="card card-box col-lg-3 col-xl-3 m-1" key={index}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="usre-img-details mb-3 d-flex align-items-center justify-content-between">
                  <div className="user-img me-3">
                    <img
                      src={item?.officeOwnerDto?.companyLogo? item?.officeOwnerDto?.companyLogo:"assets/images/user-img.png"}
                      // src="assets/images/user-img.png"
                      className="img-fluid"
                      alt="img"
                    />
                  </div>
                  <div className="user-details">
                    <h5 className="mb-0">
                      {item?.officeOwnerDto?.officeNo}{" "}
                      {item?.officeOwnerDto?.officeName}{" "}
                    </h5>
                    <p className="mb-0">
                    {moment(item?.orderCreatedAt, 'x').format('DD MMM YYYY, hh:mm a')}
                      <small>#{item?.orderId}</small>
                    </p>
                    <p className="mb-0">{item?.officeOwnerDto?.buildingName}</p>
                  </div>
                
                </div>
                <div className="more-btn">
                  <button
                    className="btn"
                    type="button"
                    onClick={() => onShowmodel(item, true)}
                  >
                    <img src="assets/images/more.png" className="img-fluid"  alt="img" />
                  </button>
                </div>
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
                      <p className="mb-0">₹{item?.itemPrice}</p>
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
                          <p className="mb-0">₹{item?.itemPrice}</p>
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

              {item?.canceled ?   <>
                  <p className="error mt-3">Reject Order </p>
                </> : item?.isAccepted === "N" ? (
                <div className="d-flex align-items-center justify-content-between pt-3">
                  <div className="menu-btns">
                    <button
                      type="button"
                      className="btn btn-dark me-2"
                      onClick={() => handleOrderAccept(item)}
                    >
                 
                      {submitloader  && item?.orderId === itemData?.orderId? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Accept"
                    )}
                    </button>
                    <button type="button" className="btn btn-dark"  onClick={() => cancelOrder(item)}>
                    Reject 
                    </button>
                  </div>
                  <div className="menu-total">
                    <p className="mb-0">{item.totalWithTax}</p>
                  </div>
                </div>
              ) : (
                <div className="menu-btns pt-3">
                  <button
                    type="button"
                    className="btn btn-dark me-2"
                    onClick={() => {
                      props.handelModelopen();
                      setOtpList(item);
                    }}
                  >
                    Otp
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        footer={false}
        title="Edite Order"
        centered
        visible={visible}
        onOk={() => {
          setVisible(false);
          setOrderDetailbyid({});
          setTotalCount();
        }}
        onCancel={() => {
          setVisible(false);
          setOrderDetailbyid({});
          setTotalCount();
        }}
        width={500}
      >
        <form>
          <h5 className="text-center">
            {orderDetailbyid?.officeOwnerDto?.officeName}
          </h5>
          <p className="text-center">
            {orderDetailbyid?.officeOwnerDto?.officeNo}
          </p>
          {orderDetailbyid?.orderDetailDtoList?.map((item, index) => (
            <div className="card add-tocart mt-3" key={index}>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="usre-img-details d-flex align-items-center justify-content-between">
                    <div className="user-img me-3">
                      <img
                        src={item?.itemImage}
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
                      onClick={() => updateOrder(item?.orderDetailId)}
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
              <p className="mb-0">₹{orderDetailbyid?.totalItemPrice}</p>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
            <div className="menu-list2">
              <p className="mb-0">Tax and Fees</p>
            </div>
            <div className="menu-total2">
              <p className="mb-0">₹{orderDetailbyid?.taxAndFees}</p>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
            <div className="menu-list2">
              <p className="mb-0">
                Total <small>({totalCount} items)</small>
              </p>
            </div>
            <div className="menu-total2">
              <p className="mb-0">₹{orderDetailbyid?.totalWithTax}</p>
            </div>
          </div>

          <div>
            <button
              className="btn w-100 btn-secondary bg-gray mt-5"
              type="button"
              onClick={() => {
                setVisible(false);
                setOrderDetailbyid({});
                setTotalCount();
              }}
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        footer={false}
        title=""
        centered
        visible={props.otpModel}
        onOk={() => {
          props.handelModelClose();
          otpForm.resetForm();
        }}
        onCancel={() => {
          props.handelModelClose();
          otpForm.resetForm();
        }}
        width={400}
      >
        <form onSubmit={otpForm.handleSubmit}>
          <div className="container">
            <div className="card-body px-1">
              <div className="d-flex align-items-center justify-content-between">
                <div className="usre-img-details mb-3 d-flex align-items-center justify-content-between">
                  <div className="user-img me-3">
                    <img  src={otpList?.officeOwnerDto?.companyLogo ?otpList?.officeOwnerDto?.companyLogo :"assets/images/user-img.png"} className="img-fluid"   alt="img" />
                  </div>
                  <div className="user-details">
                    <h5 className="mb-0">{otpList?.officeOwnerDto?.officeName}</h5>
                    <h5 className="mb-0">{otpList?.officeOwnerDto?.buildingName}</h5>
                  </div>
                </div>
                <div className="more-btn">
                  <p>#{otpList?.orderId}</p>
                </div>
              </div>
              <div className="register-canteen-box mt-0">
                <div className="form-group">
                  <input
                    id="form_name1"
                    className="form-control"
                    type="text"
                    name="orderOtp"
                    onChange={otpForm.handleChange}
                    value={otpForm.values.orderOtp}
                  
                  />
                  <label htmlFor="form_name1">
                    Enter OTP<span className="gl-form-asterisk"></span>
                  </label>
                  {otpForm.touched.orderOtp && otpForm.errors.orderOtp ? (
                    <div className="text-start">
                      {" "}
                      <span className="error">
                        {otpForm.errors.orderOtp}
                      </span>{" "}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-end pt-3">
                <div className="menu-btns">
                  <button
                    type="button"
                    className="btn btn-dark me-2"
                    onClick={() => {
                      props.handelModelClose();
                      otpForm.resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-dark">
                  {otploader ? <Spinner  animation="border" size="sm" /> : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};



export default OrderCard;