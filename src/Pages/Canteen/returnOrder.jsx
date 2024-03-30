import { Layout,  DatePicker, Space, Input, Spin } from "antd";
import React, { useEffect, useState,useRef } from "react";
import { useSelector } from "react-redux";
import { postJson } from "../../Common/api-instance";
import Orderidcard from "../../Components/orderDetails/orderidcard";
import OrderDetails from "../../Components/orderDetails/orderDetails";
import moment from "moment";
const { RangePicker } = DatePicker;

const ReturnOrder = () => {
    const canteenuser = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [orderlist, setOrderlist] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState();
    const [selectedDates, setSelectedDates] = useState("");
    const [searchValue, setSearchValue] = useState("");

    const [orderDetils, setOrderDetils] = useState({});
    useEffect(()=>{
      getData()
    },[pageSize, page, searchValue, selectedDates])
    const getData = async () => {
      try {
        const payload = {
          userId:"",
          canteenId:canteenuser?.userId,
          duration: selectedDates,
          searchText: searchValue,
          // canceled:true,
          returned:true,
        
          pageable: {
            pageno: page,
            pagesize: pageSize,
          },
        }
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
  }
    const handlePaginationClick = (pageNum) => {
      setPage(pageNum);
    };
  
    const handlePageSizeChange = (size) => {
      setPageSize(size);
    };
  
    const pageSizeOptions = [5, 10, 20, 30, 50, 100];
    const handleDateChange = (dateStrings) => {
      const formattedDates = dateStrings.map((date) =>
        moment(date).format("DD/MM/YYYY")
      );
      setSelectedDates(formattedDates.join(", "));
    };
    return (
      <Layout className="bg-white p-5 h-90">
        <div className="container-fluid p-0 ">
          <h4>Return Order History</h4>
          <div className="d-flex justify-content-between customers_header mb-5 mb-3 w-50">
          <div className="">
            <label className="mt-1">Search:</label>
            <Input
              className="w-75 ms-2"
              type="text"
              name="searchValue"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <Space direction="vertical" size={12}>
            <RangePicker onChange={handleDateChange} />
          </Space>
          </div>
        </div>
        <div>
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
              <h3> Order Details</h3>
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
                          orderDetils?.officeOwnerDto?.companyLogo !== null
                            ? orderDetils?.officeOwnerDto?.companyLogo
                            : "./assets/images/user-img.png"
                        }
                        className="img-fluid"
                        alt="img-canteen"
                      />
                      <div>
                        <h6 className="font-w500">
                          {orderDetils?.officeOwnerDto?.officeName}
                        </h6>
                        <span>{orderDetils?.officeOwnerDto?.buildingName}</span>
                      </div>
                    </div>
                  </div>

                  {orderDetils?.orderDetailDtoList?.length > 0 &&
                    orderDetils?.orderDetailDtoList?.map((item, index) => (
                      <>
                      <div key={index}>
                      {item?.itemQty >0 && <OrderDetails data={item} />}
                      {item?.returnItemQty>0 && <OrderDetails data={item} return={"return"} />}
                      </div>
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
                {orderDetils?.canceled == true ? <button className="btn btn-outline-danger"  type="button"   disabled={true} 
                >
                Reject
                </button> : orderDetils?.returned == true ?      <button className=" btn btn-dark me-sm-4 me-2"  type="button" >
               { orderDetils?.orderOtp}
                </button>:""}
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
      </div>
      </Layout>
    );
  };
  

export default ReturnOrder