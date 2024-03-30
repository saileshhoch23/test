import React, { useEffect, useState } from "react";
import { postJson } from "../../Common/api-instance";
import { Table, Layout, Input } from "antd";
import moment from "moment";
const OrderlistAdmin = () => {
  const [page, setPage] = useState(0);
  const [pagesize, setPagesize] = useState(10);
  const [orderlist, setOrderlist] = useState([]);
  const [totaldata, setTotaldata] = useState();
  const [loading, setLoading] = useState();
  const [searchValue, setSearchValue] = useState("");

  const columns = [
    {
      title: "Order Id",
      dataIndex: "orderId",
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
      title: "paymentStatus",
      dataIndex: "paymentStatus",
      render: (paymentStatus) => (
        <span
          style={{ cursor: "pointer" }}
          className={`${paymentStatus === "paid" ? "bg-green" : "bg-red"}`}
        >
          {paymentStatus === "paid" ? paymentStatus: paymentStatus}
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
        returned: false,
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
    orderCreatedAt:moment(item?.orderCreatedAt, 'x').format('DD MMM YYYY, hh:mm a'),
    totalWithTax: item?.totalWithTax,
    canceled: item?.canceled,
    delivered: item?.delivered,
    officeName: item?.officeOwnerDto?.officeName,
    canteenName: item?.canteenDto?.canteenName,
    orderDetailDtoList: item?.orderDetailDtoList,
    paymentStatus: item?.paymentStatus,
  }));

  return (
    <>
      <Layout className="bg-white p-5 h-90">
        <div className="container-fluid p-0">
          <h4>Order List</h4>
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
    </>
  );
};

export default OrderlistAdmin;
