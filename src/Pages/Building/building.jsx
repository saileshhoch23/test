import React, { useState, useEffect } from "react";
import { Button, Col, Input, Layout, Modal, Row, Select, Table } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { postJson } from "../../Common/api-instance";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

const Building = () => {
  const [visible, setVisible] = useState(false);
  const [visibleview, setVisibleview] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [user, setUser] = useState([]);
  const [view, setView] = useState({});
  const columns = [
    {
      title: "Id",
      dataIndex: "userId",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "User Type",
      dataIndex: "userType",
    },
    {
      title: "Status",
      dataIndex: "isActive",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <>
          <Button
            className="gray boderrmove mx-1"
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
          ></Button>
          <Button
            className="gray boderrmove  mx-1"
            onClick={() => handleView(record)}
            icon={<EyeOutlined />}
          ></Button>
          {/* <Popconfirm
              title="Are you sure to delete this record?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Button className="gray boderrmove" icon={<DeleteOutlined />}></Button>
            </Popconfirm> */}
        </>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, [searchValue]);
  const getData = async () => {
    try {
      const responseData = await postJson("user/find_all_user");
      setUser(responseData.data);
    } catch (error) {
      console.log(error);
    }
  };

  const dataSource = user
    ?.filter((data) => {
      const searchValueLower = searchValue?.toLowerCase();
      return (
        data?.userId &&
        data?.firstName &&
        data?.lastName &&
        data?.email &&
        data?.isActive &&
        (data?.firstName?.toLowerCase().includes(searchValueLower) ||
          data?.lastName?.toLowerCase().includes(searchValueLower) ||
          data?.email?.toLowerCase().includes(searchValueLower))
      );
    })
    .map((item) => {
      return {
        key: item.userId,
        userId: item.userId,
        email: item.email,
        userType: item.userType,
        firstName: item.firstName,
        lastName: item.lastName,
        isActive: item.isActive === "Y" ? "Active" : "In-Active",
      };
    });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleView = (record) => {
    setView(record);
    setVisibleview(true);
  };

  const userListForm = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      isActive: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Frist name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .required("Email is required")
        .matches(
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          "Invalid email address"
        ),
      isActive: Yup.string().required("Stauts is required"),
    }),
    onSubmit: async (values) => {
      try {
        const responseData = await postJson("", values);
        if (responseData.status == 101) {
          toast.error(`${responseData.massage}`);

        } else {
          setVisible(false);
          
          toast.success("create successfully");
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  const { Option } = Select;
  const onChange = (value) => {
    userListForm.setFieldValue("userType", value);
  };
  const handleEdit = (record) => {

    userListForm.setFieldValue("firstName", record.firstName);
    userListForm.setFieldValue("lastName", record.lastName);
    userListForm.setFieldValue("email", record.email);
    userListForm.setFieldValue("isActive", record.isActive);
    setVisible(true);
  };
  return (
    <>
      <Layout className="bg-white">
        <div className="container-fluid p-0 d-flex justify-content-between customers_header">
          <h4>Building user Lists</h4>
          <div className="d-flex">
            <Button
              type="primary"
              disabled={true}
              onClick={() => setVisible(true)}
            >
              Add New
            </Button>
          </div>
        </div>

        <div className="custom_TableWrapper container-fluid  ">
          <div className="d-flex">
            <label className="mt-1">
              <b>Search:</b>
            </label>
            <Input
              className="w-25 ms-2"
              type="text"
              name="searchValue"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <hr />
        </div>

        <div>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
          />
        </div>
      </Layout>
      <Modal
        footer={false}
        title="Building"
        centered
        visible={visible}
        onOk={() => {
          setVisible(false);
          userListForm.resetForm();
        }}
        onCancel={() => {
          setVisible(false);
          userListForm.resetForm();
        }}
        width={700}
      >
        <form onSubmit={userListForm.handleSubmit}>
          <Row className="Row-Height" gutter={[10, 10]}>
            <Col span={24}>
              {/* <Row gutter={[10, 10]}> */}

              <Col span={24}>
                <label className="inputLabel">First Name*</label>
                <Input
                  name="firstName"
                  type="text"
                  value={userListForm.values.firstName}
                  onChange={userListForm.handleChange}
                />
                {userListForm.touched.firstName &&
                userListForm.errors.firstName ? (
                  <span className="error">{userListForm.errors.firstName}</span>
                ) : null}
              </Col>
              <Col span={24}>
                <label className="inputLabel">Last Name*</label>
                <Input
                  name="lastName"
                  type="text"
                  value={userListForm.values.lastName}
                  onChange={userListForm.handleChange}
                />
                {userListForm.touched.lastName &&
                userListForm.errors.lastName ? (
                  <span className="error">{userListForm.errors.lastName}</span>
                ) : null}
              </Col>
              <Col span={24}>
                <label className="inputLabel">Email*</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userListForm.values.email}
                  onChange={userListForm.handleChange}
                />
                {userListForm.touched.email && userListForm.errors.email ? (
                  <span className="error">{userListForm.errors.email}</span>
                ) : null}
              </Col>
              <Col span={24}>
                <label className="inputLabel">Is Active*</label>
                <br />
                <Select
                  value={userListForm.values.isActive}
                  className="w-100"
                  showSearch
                  optionFilterProp="children"
                  onChange={onChange}
                >
                  <Option value="Y">Active</Option>
                  <Option value="N">In-Active</Option>
                </Select>
                <br />
                {userListForm.touched.isActive &&
                userListForm.errors.isActive ? (
                  <span className="error">{userListForm.errors.isActive}</span>
                ) : null}
              </Col>
              <Col span={24} className="mt-4 p-0">
                <Button type="primary" htmlType="submit" className="mx-2">
                  Save
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setVisible(false);
                  }}
                >
                  Cancel
                </Button>
              </Col>
            </Col>
          </Row>
        </form>
      </Modal>

      <Modal
        footer={false}
        title="Building"
        centered
        visible={visibleview}
        onOk={() => {
          setVisibleview(false);
        }}
        onCancel={() => {
          setVisibleview(false);
        }}
        width={700}
      >
        <form>
          <Row className="Row-Height" gutter={[10, 10]}>
            <Col span={24}>
              <div className="d-flex">
                <Col span={7}>
                  <p>User Id :</p>
                </Col>
                <Col span={16}>
                  <p>{view.userId}</p>
                </Col>
              </div>
              <div className="d-flex">
                <Col span={7}>
                  <p>Frist Name :</p>
                </Col>
                <Col span={16}>
                  <p>{view.firstName}</p>
                </Col>
              </div>
              <div className="d-flex">
                <Col span={7}>
                  <p>Last Name :</p>
                </Col>
                <Col span={16}>
                  <p>{view.lastName}</p>
                </Col>
              </div>
              <div className="d-flex">
                <Col span={7}>
                  <p>Email :</p>
                </Col>
                <Col span={16}>
                  <p>{view.email}</p>
                </Col>
              </div>
              <Col span={24} className="mt-4 p-0">
                <Button
                  type="primary"
                  onClick={() => {
                    userListForm.resetForm();
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

export default Building;
