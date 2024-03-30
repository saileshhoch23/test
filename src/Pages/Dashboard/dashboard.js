
import React from "react";
import "./dashboard.css";
import { Col,  Layout, Row, Typography } from "antd";
import ReactApexChart from "react-apexcharts";
const { Text } = Typography;
export default function Dashboard() {

  const series2 = [44, 55, 13, 43, 22];
  const options2 = {
    chart: {
      width: 380,
      type: "donut",
    },
    labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };
  const series = [44, 55, 13, 43, 22];
  const options = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };
  const series3 = [
    {
      name: "Inflation",
      data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3],
    },
  ];

  const options3 = {
    chart: {
      height: 350,
      type: "bar",
      stacked: true,
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      position: "bottom",
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      labels: {
        show: true,
        formatter: function (val) {
          return val + "%";
        },
      },
      title: {
        text: "Percentage",
      },
    },
    title: {
      text: "Office wise count order ",
      floating: true,
      offsetY: -6,
      align: "center",
      style: {
        color: "#444",
      },
    },
  };
  const series4 = [
    {
      name: "Desktops",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
    },
  ];

  const options4 = {
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "Building Wise  count order",
      align: "left",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
    },
  };
 
  return (
    <>
      <Layout className="bg-white">
        <div className="container p-0 d-flex justify-content-between customers_header">
          <h4> Food </h4>
        </div>
        <div className="container p-0">
          <Row gutter={10}>
            <Col sm={24} xs={24} lg={8} span={8}>
              <div className="card mb-3 min-h">
                <div className="card-body task-box1">
                  <h5>Building</h5>
                  <div className="d-flex align-items-center justify-content-between">
                    <Text className="mb-0 text-white">
                     Order
                      <b className="d-flex justify-content-center fontSize">
                        345
                      </b>
                    </Text>
                    <Text className="mb-0 text-white">
                    Order
                      <b className="d-flex justify-content-center fontSize">
                        452
                      </b>
                    </Text>
                    <Text className="mb-0 text-white">
                    Order
                      <b className="d-flex justify-content-center fontSize">
                        456
                      </b>
                    </Text>
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={24} xs={24} lg={8} span={8}>
              <div className="card mb-3 min-h">
                <div className="card-body task-box1">
                  <h5>Office</h5>
                  <div className="d-flex align-items-center justify-content-between">
                    <Text className="mb-0 text-white">
                    Order
                      <b className="d-flex justify-content-center fontSize">
                        5437
                      </b>
                    </Text>
                    <Text className="mb-0 text-white">
                    Order
                      <b className="d-flex justify-content-center fontSize">
                        4674
                      </b>
                    </Text>
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={24} xs={24} lg={8} span={8}>
              <div className="card mb-3 min-h">
                <div className="card-body task-box1">
                  <h5>Canteen</h5>
                  <div className="d-flex align-items-center justify-content-between">
                    <Text className="mb-0 text-white">
                    Order
                      <b className="d-flex justify-content-center fontSize">
                        546
                      </b>
                    </Text>
                    <Text className="mb-0 text-white">
                    Order
                      <b className="d-flex justify-content-center fontSize">
                        644
                      </b>
                    </Text>
                    <Text className="mb-0 text-white">
                    Order
                      <b className="d-flex justify-content-center fontSize">
                        344
                      </b>
                    </Text>
                    <Text className="mb-0 text-white">
                    Order
                      <b className="d-flex justify-content-center fontSize">
                        45636
                      </b>
                    </Text>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col sm={24} xs={24} lg={12} span={12}>
              <div className="ContentWrap3 p-3">
                <Col span={24}>
                  <div className="d-flex  justify-content-between ">
                    <h6 className="fontbold">Order Count</h6>
                  </div>
                </Col>

                <ReactApexChart
                  options={options2}
                  series={series2}
                  type="donut"
                  width={380}
                  style={{ padding: "50px" }}
                />
              </div>
            </Col>

            <Col sm={24} xs={24} lg={12} span={12}>
              <div className="ContentWrap2 p-3">
                <Row>
                  <Col span={24}>
                    {/* <h6 className="fontbold">Office wise count order </h6> */}
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
              
                    <ReactApexChart
                      options={options3}
                      series={series3}
                      type="bar"
                      height={350}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col sm={24} xs={24} lg={12} span={12}>
              <div className="ContentWrap3 p-3">
                <Col span={24}>
                  <div className="d-flex  justify-content-between ">
                    <h6 className="fontbold"> Building Wise Revenue </h6>
                  </div>
                </Col>
                <ReactApexChart
                  options={options}
                  series={series}
                  type="pie"
                  width={380}
                  style={{ padding: "50px" }}
                />
              </div>
            </Col>
            <Col sm={24} xs={24} lg={12} span={12}>
              <div className="ContentWrap2 p-3">
                <Row>
                  <Col span={24}>
                    {/* <h6 className="fontbold">Building Wise  count order </h6> */}
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                  <ReactApexChart
                      options={options4}
                      series={series4}
                      type="line"
                      height={350}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </Layout>
    </>
  );
}
