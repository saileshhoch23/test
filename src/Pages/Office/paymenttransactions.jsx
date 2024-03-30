import React, { useEffect, useState } from "react";
import { postJson } from "../../Common/api-instance";
import { Table, Modal, Spin, Layout, Input } from "antd";
import MillisecondsToDate from "../../Components/MillisecondsToDate/millisecondsToDate";
import { useSelector } from "react-redux";
import moment from "moment";

const Paymenttransactions = () => {
  const [page, setPage] = useState(0);
  const [pagesize, setPagesize] = useState(10);
  const [pymentTraction, setPymentTraction] = useState([]);
  const [totaldata, setTotaldata] = useState();
  const [loading, setLoading] = useState();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const user = useSelector((state) => state?.user);
  const [searchValue, setSearchValue] = useState(""); 

  const columns = [
    {
      title: "PaymentId",
      dataIndex: "paymentId",
    },
    {
      title: "payuOrderId",
      dataIndex: "payuOrderId",
    },
    {
      title: "officeName",
      dataIndex: "officeName",
    },
    {
      title: "amount",
      dataIndex: "amount",
    },
    {
      title: "canteenName",
      dataIndex: "canteenName",
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
    },
    {
      title: "payment Date",
      dataIndex: "paymentDate",
    },
  ];

  const expandedRowRender = (record) => {
    const orderColumns = [
      {
        title: "Order ID",
        dataIndex: "orderId",
        render: (text, record) => (
          <span
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => handleOrderClick(record)}
          >
            {record?.orderId}
          </span>
        ),
      },
      {
        title: "Amount",
        dataIndex: "totalWithTax",
      },
      {
        title: "Order Created At",
        dataIndex: "orderCreatedAt",
      },
    ];

    const datasrecord = record?.orderDtoList?.map((item) => ({
      key: item?.orderId,
      orderCreatedAt: moment(item?.orderCreatedAt, 'x').format('DD MMM YYYY, hh:mm a'),
      orderId: item?.orderId,
      canteenId: item?.canteenId,
      totalWithTax: item?.totalWithTax,
      userId: item?.userId,
    }));

    return (
      <Table
        columns={orderColumns}
        dataSource={datasrecord}
        pagination={false}
      />
    );
  };

  const handleOrderClick = (orderId) => {
    setSelectedOrder(orderId);
  };

  useEffect(() => {
    getData();
  }, [page, pagesize]);

  const getData = async () => {
    try {
      const payload = {
        canteenId: user?.userType === "CANTEEN" ? user?.userId : "",
        userId: user?.userType === "USER" ? user?.userId : "",
        paymentId: "",
        payuOrderId:searchValue,
        pageable: {
          pageno: page,
          pagesize: pagesize,
        },
      };
      setLoading(true);
      const responseData = await postJson(
        "payment/get_all_payment_transactions",
        payload
      );
      setLoading(false);
      if (responseData && responseData.data) {
        setPymentTraction(responseData.data);
        setTotaldata(responseData.pageable.totalItems);
      }
    } catch (error) {
      setPymentTraction([]);
      setTotaldata();
      setLoading(false);
    }
  };

  const dataSource = pymentTraction.map((item) => ({
    key: item?.paymentId,
    paymentId: item?.paymentId,
    payuOrderId: item?.payuOrderId,
    paymentDate: <MillisecondsToDate item={item?.paymentDate} />,
    amount: item?.amount,
    officeName: item?.officeOwnerDto?.officeName,
    canteenName: item?.canteenDto?.canteenName,
    orderDtoList: item?.orderDtoList,
    paymentMethod: item?.paymentMethod === "Cash" ? "Cash" : "Online",
  }));

  const [orderDetails, setOrderDetails] = useState({});

  useEffect(() => {
    if (selectedOrder) {
      getDataDetails();
    }
  }, [selectedOrder]);

  const getDataDetails = async () => {
    setLoadingDetails(true)
    try {
      const payload = {
        orderId: selectedOrder?.orderId,
        canteenId: selectedOrder?.canteenId,
      };
      const responseData = await postJson("order/get_order", payload);
      if (responseData && responseData?.data) {
        setLoadingDetails(false)
        setOrderDetails(responseData?.data);
      }
    } catch (error) {
      console.error(error);
      setLoadingDetails(false)
    }
  };
  return (
    <>
    <Layout className="bg-white p-5 h-90">
    <div className="container-fluid p-0">
    <h4>Payment Transactions</h4>
    <div className="d-flex justify-content-between customers_header mb-5 mb-3 w-100">
      <div className="d-flex me-2">
        <label className="mt-1">Search:</label>
        <Input
          className="w-75 ms-2"
          type="text"
          name="searchValue"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      </div>
  </div>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: expandedRowRender,
          rowExpandable: (record) => record.orderDtoList.length !== 0,
        }}
        dataSource={dataSource}
        loading={loading}
        scroll={{ x: 1000 }}
        pagination={{
          total: totaldata,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 25, 100],
          onChange: (page, pagesize) => {
            setPage(page - 1);
            setPagesize(pagesize);
          },
        }}
      />
    </Layout>
      <Modal
        title="Order Details"
        visible={selectedOrder !== null}
        onCancel={() => {
          setSelectedOrder(null);
          setOrderDetails({});
        }}
        onOk={() => {
          setSelectedOrder(null);
          setOrderDetails({});
        }}
        footer={null}
      >
        {loadingDetails ? (
          <div className="d-flex align-items-center justify-content-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="container">
              <div className="card bg-orange">
                <div className="card-body ">
                  <div className="d-flex align-items-center justify-content-between ">
                    <div className="usre-img-details d-flex align-items-center justify-content-between">
                      <div className="user-img me-3">
                        <img
                          src={
                            orderDetails?.canteenDto?.imgPath
                              ? orderDetails?.canteenDto?.imgPath
                              : "assets/images/user-img.png"
                          }
                          className="img-fluid"
                          alt="img"
                        />
                      </div>
                      <div className="user-details">
                        <h5 className="mb-0">
                          {orderDetails?.canteenDto?.canteenName}
                        </h5>
                        <p className="mb-0">
                          {orderDetails?.orderCreatedAt && (
                            <MillisecondsToDate
                              item={orderDetails?.orderCreatedAt}
                            />
                          )}{" "}
                          <small>#{orderDetails?.orderId}</small>
                        </p>
                        <h5 className="mb-0">
                          {orderDetails?.canteenDto?.buildingName}
                        </h5>
                      </div>
                    </div>
                    <div className="more-btn">
                      <p>₹{orderDetails?.totalWithTax}</p>
                    </div>
                  </div>
                </div>
              </div>
              {orderDetails?.orderDetailDtoList?.map((item, index) => (
                <>
                  {item?.itemQty > 0 && (
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
                            <div className="d-flex align-items-center justify-content-between ">
                              <div className="menu-list">
                                <p className="mb-0">
                                  {item.itemName} ({item?.itemQty})
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="menu-total">
                            <p className="mb-0">₹{item?.itemPrice}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {item?.returnItemQty > 0 && (
                    <div className="card add-tocart mt-3">
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
                            <div className="d-flex align-items-center justify-content-between ">
                              <div className="menu-list">
                                <p className="mb-0 text-decoration-line-through">
                                  {item.itemName} ({item?.returnItemQty})
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="menu-total">
                            <p className="mb-0 text-decoration-line-through">
                              ₹{item?.itemPrice}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ))}
              <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
                <div className="menu-list2">
                  <p className="mb-0 text-black">Subtotal</p>
                </div>
                <div className="menu-total2">
                  <p className="mb-0">₹{orderDetails?.totalItemPrice}</p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
                <div className="menu-list2">
                  <p className="mb-0">Tax and Fees</p>
                </div>
                <div className="menu-total2">
                  <p className="mb-0">₹{orderDetails?.taxAndFees}</p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
                <div className="menu-list2">
                  <p className="mb-0">
                    Total{" "}
                    <small>
                      ({orderDetails?.orderDetailDtoList?.length} items)
                    </small>
                  </p>
                </div>
                <div className="menu-total2">
                  <p className="mb-0">₹{orderDetails?.totalWithTax}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 add-order d-flex justify-content-between align-item-center px-3 py-3">
              <div className="">
                <p className="mb-0 ">
                  Total items{" "}
                  <small>{orderDetails?.orderDetailDtoList?.length}.</small>
                </p>
                <h6>₹{orderDetails?.totalWithTax}</h6>
              </div>
              <div className="">
                <button
                  className="btn  btn-light w-200"
                  type="button"
                  onClick={() => {
                    setSelectedOrder(null);
                    setOrderDetails({});
                  }}
                >
                  close
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>
      </>
  );
};

export default Paymenttransactions;
