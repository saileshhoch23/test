import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { postJson } from "../../Common/api-instance";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoWalletOutline } from "react-icons/io5";
import { Modal, DatePicker, Space, Input } from "antd";
import PaginationComponent from "../../Components/Pagnation/pagination";
import MillisecondsToDate from "../../Components/MillisecondsToDate/millisecondsToDate";
import moment from "moment";
const { RangePicker } = DatePicker;
const Canteentransaction = () => {
  const pararms = useParams();
  const user = useSelector((state) => state?.user);
  const cateenPyment = useSelector((state) => state?.cateenPyment);
  const [page, setPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0);
  const formattedStartDate = startDate.toLocaleDateString("en-GB");
  const formattedEndDate = endDate.toLocaleDateString("en-GB");
  const [responseData, setResponseData] = useState({});
  const [selectedDates, setSelectedDates] = useState({
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  });
  const [orderDetails, setOrderDetails] = useState({});
  const [details, setDetials] = useState(null);
  const [visibleorder, setVisbileorder] = useState(false);

  const handleDateChange = (dateStrings) => {
    const formattedDates = dateStrings?.map((date) =>
      moment(date?.$d).format("DD/MM/YYYY")
    );

    setSelectedDates(formattedDates?.join(","));
  };

  useEffect(() => {
    if (details) {
      getDataDetails();
    }
  }, [details]);
  const getDataDetails = async () => {
    try {
      const payload = {
        orderId: details?.orderId,
        canteenId: details?.canteenId,
      };
      const responseData = await postJson("order/get_order", payload);
      if (responseData && responseData?.data) {
        setOrderDetails(responseData?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [chartList, setCartList] = useState([])
  let getDataChat = async () => {
    try {
      const payload = {
        userId: Number(pararms?.id),
      canteenId: user?.userId,
      };
      // setLoading(true);
      const responseData = await postJson(
        "payment/get_chart_data_mobile",
        payload
      );
      // setLoading(false);
      if (responseData && responseData.data) {
        setCartList(responseData.data);
        
      }
    } catch (error) {
      setCartList([]);
      // setLoading(false);
    }
  };
  useEffect(()=>{
    getDataChat()
  },[])

  const [chartState, setChartState] = useState({
    series: [
      {
        name: "Amount",
        data: [],
      },
      
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#FFB9A6", ],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "",
        align: "left",
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Month",
        },
      },
      yaxis: {
        title: {
          text: "Amount",
        },
        min:0 ,
        max: 1000,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
  });

  useEffect(() => {
    const categories = [];
    const data = [];

    chartList.forEach((item) => {
      categories.push(item?.month);
      data.push(item?.total_amount);
    });

    setChartState({
      ...chartState,
      options: {
        ...chartState.options,
        xaxis: {
          ...chartState.options.xaxis,
          categories: categories,
        },
        yaxis: {
          ...chartState.options.yaxis,
          max: Math.max(...data) + 1000, 
        },
      },
      series: [
        {
          name: "Amount",
          data: data,
        },
      ],
    });
  }, [chartList]);
  useEffect(() => {
    getData();
  }, [searchValue, page, pageSize, selectedDates]);

  const getData = async () => {
    let payload = {
      officeOwnerId: Number(pararms?.id),
      canteenId: user?.userId,
      duration:
        selectedDates?.startDate && selectedDates?.endDate
          ? `${selectedDates?.startDate},${selectedDates?.endDate}`
          : selectedDates,
      searchText: searchValue,
      pageable: {
        pageno: page,
        pagesize: pageSize,
      },
    };
    try {
      const response = await postJson(
        "canteen/get_canteen_offices_orders_transaction",
        payload
      );
      setTotalPages(response?.pageable?.totalItems);
      setResponseData(response);
    } catch (error) {
      console.error(error);
    }
  };
  const handlePaginationClick = (pageNum) => {
    setPage(pageNum);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
  };

  const pageSizeOptions = [5, 10, 20, 30, 50, 100];
  const handleDetialsOrder = (data) => {
    setDetials(data);
    setVisbileorder(true);
  };

  return (
    <>
      <div className="container">
        <div className="card bg-orange w-50">
          <div className="card-body ">
            <div className="d-flex align-items-center justify-content-between ">
              <div className="usre-img-details d-flex align-items-center justify-content-between">
                <div className="user-payment me-3">
                  {/* < */}
                  <IoWalletOutline />
                </div>
                <div className="user-details">
                  <h5 className="mb-0 text-font">TOTAL AMOUNT</h5>
                  <p className="mb-0 text-font">₹{cateenPyment?.totalAmount}</p>
                </div>
              </div>
    
            </div>
          </div>
        </div>
      
        <div>
          <div id="chart">
            <ReactApexChart
              options={chartState.options}
              series={chartState.series}
              type="line"
              height={350}
            />
          </div>
          <div id="html-dist"></div>
        </div>
      </div>
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
      <div className="row gap-1">
        {responseData?.data?.orderDtos?.length > 0 &&
          responseData?.data?.orderDtos?.map((item, index) => (
            <div className="col-lg-3 col-md-5 col-sm-12">
              <div className="card add-tocart">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="usre-img-details d-flex align-items-center justify-content-between">
                      <div className="user-details">
                        <h5 className="mb-0 text-black">{item?.orderId}</h5>
                        <p className="mb-0">
                          <MillisecondsToDate item={item?.orderCreatedAt} />
                        </p>
                      </div>
                    </div>
                    <div className="more-btn ">
                      <p className="m-0">{item?.totalWithTax}</p>
                      <a className="" onClick={() => handleDetialsOrder(item)}>
                        details
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        <PaginationComponent
          totalPages={Math.ceil(totalPages / pageSize)}
          handlePaginationClick={handlePaginationClick}
          pageSizeOptions={pageSizeOptions}
          pageSize={pageSize}
          handlePageSizeChange={handlePageSizeChange}
          page={page}
        />
      </div>


      <Modal
        footer={false}
        title="Order Details"
        centered
        visible={visibleorder}
        onOk={() => {
          setVisbileorder(false);
          setOrderDetails({});
        }}
        onCancel={() => {
          setVisbileorder(false);
          setOrderDetails({});
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
                        orderDetails?.officeOwnerDto?.companyLogo
                          ? orderDetails?.officeOwnerDto?.companyLogo
                          : "assets/images/user-img.png"
                      }
                      className="img-fluid"
                      alt="img"
                    />
                  </div>
                  <div className="user-details">
                    <h5 className="mb-0">
                      {orderDetails?.officeOwnerDto?.officeName}{" "}
                      <span>{orderDetails?.officeOwnerDto?.officeNo}</span>
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
                      {orderDetails?.officeOwnerDto?.buildingName}
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
                          <img src={item?.itemImage} className="img-fluid" alt="img" />
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
                          <img src={item?.itemImage} className="img-fluid" alt="img"/>
                        </div>
                        <div className="d-flex align-items-center justify-content-between w-100 ">
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
                setVisbileorder(false);
                setOrderDetails({});
              }}
            >
              close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Canteentransaction;
