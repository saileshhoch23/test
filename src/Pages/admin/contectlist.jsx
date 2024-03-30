import React, { useEffect, useState } from "react";
import { postJson } from "../../Common/api-instance";
import { Button, Col, Input, Layout, Modal, Row, Table } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment";
const Contectlist = () => {
  const [page, Setpage] = useState(0);
  const [pagesize, Setpagesize] = useState(10);
  const [totaldata, setTotaldata] = useState();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [view, setView] = useState({});
  const [visibleview, setVisibleview] = useState(false);
  const columns = [
    {
      title: "Id",
      dataIndex: "contact_us_id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },

    {
      title: "mobile number",
      dataIndex: "mobile_number",
    },
    {
      title: "Crated Date",
      dataIndex: "created_at",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <>
          <Button
            className="gray boderrmove  mx-1"
            onClick={() => handleView(record)}
            icon={<EyeOutlined />}
          ></Button>
        </>
      ),
    },
  ];
  const handleView = (record) => {
    setView(record);
    setVisibleview(true);
  };
  const dataSource = user?.map((item) => ({
    key: item.contact_us_id,
    contact_us_id: item.contact_us_id,
    name: item.name,
    mobile_number: item.mobile_number,
    message: item.message,
    created_at: moment(item?.created_at, 'x').format('DD MMM YYYY, hh:mm a'),
  }));
  useEffect(() => {
    getData();
  }, [page, pagesize, searchValue]);
  const getData = async () => {
    try {
      const payload = {
        mobileNumber:searchValue,
        name: searchValue,
        searchText: searchValue,
        pageable: {
          pageno: page,
          pagesize: pagesize,
        },
      };
      setLoading(true);
      const responseData = await postJson("contact_us/get_contact_us", payload);
      setLoading(false);
      if (responseData && responseData.data) {
        setUser(responseData.data);
        setTotaldata(responseData.pageable.totalItems);
      }
    } catch (error) {
      setUser([]);
      setTotaldata();
      setLoading(false);
    }
  };
  return (
    <>
    <Layout className="bg-white p-5">
      <div className="container-fluid p-0 d-flex justify-content-between customers_header">
        <div className="w-50">
          <h3> Conteact List</h3>
          <div className="d-flex">
            <label className="mt-1">Search:</label>
            <Input
              className="w-25 ms-2"
              type="text"
              name="searchValue"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="custom_TableWrapper container-fluid  ">
        <div className="d-flex"></div>
        <hr />
      </div>
      <div>
        <Table
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          scroll={{ x: 1000 }}
          pagination={{
            current: page + 1,
            total: totaldata,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 25, 100],
            onChange: (page, pagesize) => {
              Setpage(page - 1);
              Setpagesize(pagesize);
            },
          }}
        />
      </div>
    </Layout>

    <Modal
      footer={false}
      title="conect "
      centered
      visible={visibleview}
      onOk={() => {
        setVisibleview(false);
      }}
      onCancel={() => {
        setVisibleview(false);
      }}
      width={500}
    >
      <form>
        <Row className="Row-Height" gutter={[10, 10]}>
          <Col span={24}>
            <div className="d-flex">
              <Col span={7}>
                <p>Contact us Id :</p>
              </Col>
              <Col span={16}>
                <p>{view.contact_us_id}</p>
              </Col>
            </div>
            <div className="d-flex">
              <Col span={7}>
                <p>Mobile Number :</p>
              </Col>
              <Col span={16}>
                <p>{view.mobile_number}</p>
              </Col>
            </div>
            <div className="d-flex">
              <Col span={7}>
                <p>Message :</p>
              </Col>
              <Col span={16}>
                <p>{view.message}</p>
              </Col>
            </div>
            <div className="d-flex">
              <Col span={7}>
                <p>Crated Date :</p>
              </Col>
              <Col span={16}>
                <p>{view.created_at}</p>
              </Col>
            </div>
            <Col span={24} className="mt-4 p-0">
              <Button
                type="primary"
                onClick={() => {
                  
                  setView({});
                  setVisibleview(false);
                }}
              >
                Cancel
              </Button>
            </Col>
          </Col>
        </Row>
      </form>
    </Modal>
    </>
  );
};

export default Contectlist;
