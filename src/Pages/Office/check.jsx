import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { postJson } from "../../Common/api-instance";
import { Spin } from "antd";

import moment from "moment";
import Orderidcard from "../../Components/orderDetails/orderidcard";
import OrderDetails from "../../Components/orderDetails/orderDetails";

const Check = () => {
  const user = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState();
  const [loading, setLoading] = useState(false);
  const [orderlist, setOrderlist] = useState([]);
  const [selectedDates, setSelectedDates] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [orderDetils, setOrderDetils] = useState({});

  useEffect(() => {
    getData();
  }, [pageSize, page, searchValue, selectedDates]);
  const getData = async () => {
    try {
      const payload = {
        canteenId: "",
        duration: selectedDates,
        searchText: searchValue,
        userId: user?.userId,

        delivered: true,
        pageable: {
          pageno: page,
          pagesize: Number(pageSize),
        },
      };

      setLoading(true);
      const responseData = await postJson(
        "order/get_all_order_list_page",
        payload
      );
      setLoading(false);

      if (responseData && responseData.data) {
        setOrderlist((prevOrders) => {
          const existingOrderIds = prevOrders.map((order) => order.orderId);
          const uniqueNewOrders = responseData?.data.filter(
            (newOrder) => !existingOrderIds.includes(newOrder.orderId)
          );
          return [...prevOrders, ...uniqueNewOrders];
        });
        if (!orderDetils?.orderId) {
          setOrderDetils(responseData?.data[0]);
        }
        setTotalPages(responseData?.pageable?.totalItems);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  const listInnerRef = useRef();

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

      if (
        scrollTop + clientHeight === scrollHeight &&
        Math.ceil(totalPages / pageSize) + 1 > page &&
        !loading
      ) {
        if (Math.ceil(totalPages / pageSize) + 1 > page) {
          setPage(page + 1);
        }
      }
    }
  };
  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-lg-4">
          <div className="card h-auto">
            <div className="card-body">
              <div className="order-tab">
                <ul
                  className="nav nav-pills mb-3 justify-content-center"
                  id="pills-tab"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="pills-home-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="true"
                    >
                      Order list
                    </button>
                  </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="pills-home"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab"
                    tabIndex={0}
                  >
                    <div
                      className="orer-box"
                      onScroll={onScroll}
                      ref={listInnerRef}
                    >
                      {orderlist.length > 0 &&
                        orderlist.map((item, index) => (
                          <Orderidcard
                            key={index}
                            data={item}
                            orderDetils={orderDetils}
                            setOrderDetils={setOrderDetils}
                          />
                        ))}
                      {loading ? (
                        <div className="d-flex justify-content-center">
                          <Spin />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {orderDetils?.orderId ? (
          <div className="col-lg-8">
            <div className="order-details-box">
              <h3>Delivered Order Details</h3>
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between border-bottom flex-wrap">
                    <div className="mb-4">
                      <h4 className="font-w500">
                        Order #{orderDetils?.orderId}
                      </h4>
                      <span>
                        {moment(orderDetils?.orderCreatedAt, "x").format(
                          "DD MMM YYYY, hh:mm a"
                        )}
                      </span>
                    </div>
                    <div className="orders-img d-flex mb-4">
                      <img
                        src={
                          orderDetils?.canteenDto?.imgPath !== null
                            ? orderDetils?.canteenDto?.imgPath
                            : "./assets/images/user-img.png"
                        }
                        className="img-fluid"
                        alt="img-canteen"
                      />
                      <div>
                        <h6 className="font-w500">
                          {orderDetils?.canteenDto?.canteenName}
                        </h6>
                        <span>{orderDetils?.canteenDto?.buildingName}</span>
                      </div>
                    </div>
                  </div>

                  {orderDetils?.orderDetailDtoList?.length > 0 &&
                    orderDetils?.orderDetailDtoList?.map((item, index) => (
                     <>
                     {item?.itemQty >0 && <OrderDetails data={item} key={index} />}
                     </>
                    ))}

                  <hr style={{ opacity: "0.7" }} />
                  <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
                    <div className="menu-list2">
                      <p className="mb-0 text-black">Subtotal</p>
                    </div>
                    <div className="menu-total2">
                      <p className="mb-0">₹{orderDetils?.totalItemPrice}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
                    <div className="menu-list2">
                      <p className="mb-0">Tax and Fees</p>
                    </div>
                    <div className="menu-total2">
                      <p className="mb-0">₹{orderDetils?.taxAndFees}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
                    <div className="menu-list2">
                      <p className="mb-0">
                        Total{" "}
                        <small>
                          ({orderDetils?.orderDetailDtoList?.length} items)
                        </small>
                      </p>
                    </div>
                    <div className="menu-total2">
                      <p className="mb-0">₹{orderDetils?.totalWithTax}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-end mt-3">
                <a className="btn btn-outline-danger me-sm-4 me-2" href="#">
                  Reject Order
                </a>
                <a className="btn btn-dark" href="#">
                  Accept Order
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-lg-8">
            <div className="d-flex justify-content-center mt-5">
              <Spin />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Check;
