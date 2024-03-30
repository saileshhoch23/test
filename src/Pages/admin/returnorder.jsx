import React, { useEffect, useState } from "react";
import { postJson } from "../../Common/api-instance";
import { Table, Modal, Spin, Layout, Input } from "antd";
import MillisecondsToDate from "../../Components/MillisecondsToDate/millisecondsToDate";

const ReturnorderList = () => {
  const [page, setPage] = useState(0);
  const [pagesize, setPagesize] = useState(10);
  const [orderlist, setOrderlist] = useState([]);
  const [totaldata, setTotaldata] = useState();
  const [loading, setLoading] = useState();
  const [selectedOrder, setSelectedOrder] = useState(null);
  // const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [orderDetails, setOrderDetails] = useState({});
  const handleOrderClick = (record) => {
    setSelectedOrder(record);
    setOrderDetails(record);
  };

  const columns = [
    {
      title: "Order Id",
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
      title: "officeName",
      dataIndex: "officeName",
    },
    {
      title: "totalWithTax",
      dataIndex: "totalWithTax",
    },
    {
      title: "canteenName",
      dataIndex: "canteenName",
    },
    {
      title: "canceled",
      dataIndex: "canceled",
      render: (canceled) => (
        <span
          style={{ cursor: "pointer" }}
          className={`${canceled ? "bg-red" : "bg-green "}`}
        >
          {canceled === true ? "Reject" : "Accapt"}
        </span>
      ),
    },
    {
      title: "delivered",
      dataIndex: "delivered",
      render: (delivered) => (
        <span
          style={{ cursor: "pointer" }}
          className={`${delivered ? "bg-green" : "bg-red"}`}
        >
          {delivered === true ? " Delivered" : "UnDeliverd "}
        </span>
      ),
    },
    {
      title: "Order Created Date",
      dataIndex: "orderCreatedAt",
    },
  ];

  let getData = async () => {
    try {
      const payload = {
        canteenId: "",
        duration: "",
        searchText: searchValue,
        userId: "",
        // delivered:"",
        returned: true,
        pageable: {
          pageno: page,
          pagesize: pagesize,
        },
      };
      setLoading(true);
      const responseData = await postJson(
        "order/get_all_order_list_page",
        payload
      );
      setLoading(false);
      if (responseData && responseData.data) {
        setOrderlist(responseData.data);
        setTotaldata(responseData.pageable.totalItems);
      }
    } catch (error) {
      setOrderlist([]);
      setTotaldata(); // Not sure what value to set here, assuming it's a number
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [pagesize, page, searchValue]);

  const expandedRowRender = (record) => {
    const orderColumns = [
      {
        title: "OrderDetail ID",
        dataIndex: "orderDetailId",
      },
      {
        title: "itemName",
        dataIndex: "itemName",
      },
      {
        title: "itemImage",
        dataIndex: "itemImage",
        render: (itemImage) => (
          <img width="50px" alt={itemImage} src={itemImage} />
        ),
      },

      {
        title: "taxAndFees",
        dataIndex: "taxAndFees",
      },
      {
        title: "itemSubTotal",
        dataIndex: "itemSubTotal",
      },
      {
        title: "itemTotal",
        dataIndex: "itemTotal",
      },
      {
        title: "itemQty",
        dataIndex: "itemQty",
      },
      {
        title: "returnItemQty",
        dataIndex: "returnItemQty",
      },
    ];

    const datasrecord = record?.orderDetailDtoList?.map((item) => ({
      key: item?.orderDetailId,
      orderDetailId: item?.orderDetailId,
      itemName: item?.itemName,
      itemImage: item?.itemImage,
      taxAndFees: item?.taxAndFees,
      itemSubTotal: item?.itemSubTotal,
      itemTotal: item?.itemTotal,
      returnItemQty: item?.returnItemQty,
      itemQty: item?.itemQty,
    }));

    return (
      <Table
        columns={orderColumns}
        dataSource={datasrecord}
        pagination={false}
      />
    );
  };

  const dataSource = orderlist.map((item) => ({
    key: item?.orderId,
    orderId: item?.orderId,
    orderCreatedAt: <MillisecondsToDate item={item?.orderCreatedAt} />,
    totalWithTax: item?.totalWithTax,
    canceled: item?.canceled,
    delivered: item?.delivered,
    officeName: item?.officeOwnerDto?.officeName,
    canteenName: item?.canteenDto?.canteenName,
    orderDetailDtoList: item?.orderDetailDtoList,
    buildingName: item?.canteenDto?.buildingName,
    imgPath: item?.canteenDto?.imgPath,
  }));
  return (
    <>
      <Layout className="bg-white p-5 h-90">
        <div className="container-fluid p-0">
          <h4>Return Orderlist</h4>
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
            rowExpandable: (record) => record?.orderDetailDtoList?.length !== 0,
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
        <>
          <div className="container">
            <div className="card bg-orange">
              <div className="card-body ">
                <div className="d-flex align-items-center justify-content-between ">
                  <div className="usre-img-details d-flex align-items-center justify-content-between">
                    <div className="user-img me-3">
                      <img
                        src={
                          orderDetails?.imgPath
                            ? orderDetails?.imgPath
                            : "assets/images/user-img.png"
                        }
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                    <div className="user-details">
                      <h5 className="mb-0">{orderDetails?.canteenName}</h5>
                      <p className="mb-0">
                        {orderDetails?.orderCreatedAt}{" "}
                        <small>#{orderDetails?.orderId}</small>
                      </p>
                      <h5 className="mb-0">{orderDetails?.buildingName}</h5>
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
      </Modal>
    </>
  );
};

export default ReturnorderList;
