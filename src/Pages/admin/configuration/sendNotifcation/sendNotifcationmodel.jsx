import React, { useEffect, useState } from "react";
import { Button, Table, Input, Modal, Row, Col, Select } from "antd";
import * as Yup from "yup";
import TextArea from "antd/lib/input/TextArea";
import { Accordion, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { postJson } from "../../../../Common/api-instance";
import { useFormik } from "formik";
const SendNotifcationmodel = (props) => {
  const [isSave, setIsSave] = useState(false);
  const [clickPlus, setClickPlus] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [usertype, setUserType] = useState("");
  const user = useSelector((state) => state?.user);

  const { Option } = Select;
  //ofiice user
  const [officeUser, setOfficeUser] = useState([]);
  const [searchValueOffice, setSearchValueOffice] = useState("");
  const [officepage, Setofficepage] = useState(0);
  const [officepagesize, Setofficepagesize] = useState(10);
  const [totaldata, setTotaldata] = useState();
  const [loading, setLoading] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setselectedRows] = useState([]);
  // canteen user
  const [canteenUser, setCanteenUser] = useState([]);
  const [searchValuecanteen, setSearchValueCanteen] = useState("");
  const [canteenpage, SetCanteenpage] = useState(0);
  const [canteenpagesize, SetCanteenpagesize] = useState(10);
  const [canteentotaldata, setCanteenTotaldata] = useState();
  const [canteenloading, setCanteenLoading] = useState();
  const [canteenselectedRowKeys, setCanteenSelectedRowKeys] = useState([]);
  const [canteenselectedRows, setCanteenselectedRows] = useState([]);

  // building user
  const [buildingUser, setBuildingUser] = useState([]);
  const [searchValuebuilding, setSearchValueBuilding] = useState("");
  const [buildingpage, SetBuildingpage] = useState(0);
  const [buildingpagesize, SetBuildingpagesize] = useState(10);
  const [buildingtotaldata, setBuildingTotaldata] = useState();
  const [buildingloading, setBuildingLoading] = useState();
  const [buildingselectedRowKeys, setBuildingSelectedRowKeys] = useState([]);
  const [buildingselectedRows, setBuildingselectedRows] = useState([]);

  const fetchDataBasedOnUserType = (data) => {
    setLoading(true);
    switch (data) {
      case "USER":
        getData();
        break;
      case "CANTEEN":
        getDataCanteen();
        break;
      case "OWNER":
        getDataBuilding();
        break;
      case "OWNER,USER,CANTEEN":
        getData();
        getDataCanteen();
        getDataBuilding();
        break;
      default:
        setLoading(false);
        break;
    }
  };
  const cleareForm = () => {
    props.onClose();
    sendNotifcationForm.resetForm();
    setUserType();
    setCanteenSelectedRowKeys([]);
    setCanteenselectedRows([]);
    setSelectedRowKeys([]);
    setselectedRows([]);
    setBuildingSelectedRowKeys([]);
    setBuildingselectedRows([]);
  };
  // Edite Data
  useEffect(() => {
    if (props?.record?.txtnumber) {
      getEditeData();
    }
  }, [props?.record]);
  const getEditeData = async () => {
    try {
      setLoading(true);
      const payload = {
        txtnumber: props?.record?.txtnumber,
        issend: "Y",
        sendbyadmin: "Y",
      };
      const responseData = await postJson("common/notification/get_notificationdetail",payload);
      if (responseData?.data) {
        sendNotifcationForm.setFieldValue("description",responseData?.data[0]?.description);
        sendNotifcationForm.setFieldValue("title",responseData?.data[0]?.title);
        sendNotifcationForm.setFieldValue("subtitle",responseData?.data[0]?.subtitle);

        let canteenKeys = [];
        let userKeys = [];
        let buildingKeys = [];
        let userDataTypes = [];

        responseData?.data?.forEach((item) => {
          if (!userDataTypes.includes(item.user_type)) {
            userDataTypes?.push(item.user_type);
          }

          if (item.user_type === "CANTEEN") {
            canteenKeys.push(item.userid);
          } else if (item.user_type === "USER") {
            userKeys.push(item.userid);
          } else if (item.user_type === "OWNER") {
            buildingKeys.push(item.userid);
          }
        });

        // Update state variables
        setCanteenSelectedRowKeys(canteenKeys);
        setSelectedRowKeys(userKeys);
        setBuildingSelectedRowKeys(buildingKeys);
        setUserType(
          userDataTypes.length > 1
            ? "OWNER,USER,CANTEEN"
            : userDataTypes.toString()
        );
        // Fetch data based on user types
        fetchDataBasedOnUserType("CANTEEN");
        fetchDataBasedOnUserType("USER");
        fetchDataBasedOnUserType("OWNER");
      }
    } catch (error) {
      setLoading(false);
      // console.log(error);
    }
  };

  //office user columns start
  const officeusercolumns = [
    {
      title: "Id",
      dataIndex: "user_id",
    },

    {
      title: "First name",
      dataIndex: "first_name",
    },
    {
      title: "Last name ",
      dataIndex: "last_name",
    },
    {
      title: "email",
      dataIndex: "email",
    },
    {
      title: "mobile number",
      dataIndex: "mobile_number",
    },
    {
      title: "Is Full Profile",
      dataIndex: "is_full_profile",
    },
    {
      title: "Is Verify",
      dataIndex: "is_verify",
    },
    {
      title: "Offic Name",
      dataIndex: "office_name",
    },
    {
      title: "Office No",
      dataIndex: "office",
    },
    {
      title: "Building Name",
      dataIndex: "canteen_building_name",
    },
  ];
  //office user columns end

  //Canteen user columns start
  const columnsCanteen = [
    {
      title: "Id",
      dataIndex: "user_id",
    },
    {
      title: "First name",
      dataIndex: "first_name",
    },
    {
      title: "Last name ",
      dataIndex: "last_name",
    },
    {
      title: "email",
      dataIndex: "email",
    },
    {
      title: "mobile number",
      dataIndex: "mobile_number",
    },
    {
      title: "Is Full Profile",
      dataIndex: "is_full_profile",
    },
    {
      title: "Is Verify",
      dataIndex: "is_verify",
    },
    {
      title: "Open Time",
      dataIndex: "start_time",
    },
    {
      title: "close time",
      dataIndex: "end_time",
    },
    {
      title: "Buildin Name",
      dataIndex: "canteen_building_name",
    },
    {
      title: "Address",
      dataIndex: "address1",
    },
    {
      title: "Canteen Name",
      dataIndex: "name",
    },
    {
      title: "Is Open",
      dataIndex: "is_open",
    },
  ];
  //Canteen user columns end

  // buildinguser user columns start
  const columnsBuilding = [
    {
      title: "Id",
      dataIndex: "user_id",
    },

    {
      title: "First name",
      dataIndex: "first_name",
    },
    {
      title: "Last name ",
      dataIndex: "last_name",
    },
    {
      title: "email",
      dataIndex: "email",
    },
    {
      title: "mobile number",
      dataIndex: "mobile_number",
    },
    {
      title: "Is Full Profile",
      dataIndex: "is_full_profile",
    },
    {
      title: "Is Verify",
      dataIndex: "is_verify",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Address",
      dataIndex: "address1",
    },
  ];

  // buildinguser user columns end
  useEffect(() => {
    if (usertype === "USER") {
      getData();
    } else if (usertype == "CANTEEN") {
      getDataCanteen();
    } else if (usertype == "OWNER") {
      getDataBuilding();
    } else {
      if (usertype == "OWNER,USER,CANTEEN") {
        getData();
        getDataCanteen();
        getDataBuilding();
      }
    }
  }, [
    officepage,
    officepagesize,
    searchValueOffice,
    usertype,
    props?.record?.txtnumber,
  ]);

  // office user  start
  const getData = async () => {
    try {
      const payload = {
        mobileNumber: "",
        userId: "",
        firstName: "",
        userType: "USER",
        address: "",
        searchText: "",
        isVerify: "",
        isFullProfile:"Y",
        pageable: {
          pageno: officepage,
          pagesize: officepagesize,
          filtertext: searchValueOffice
            ? `user_id like '%${searchValueOffice}%' OR first_name like '%${searchValueOffice}%'  OR last_name like '%${searchValueOffice}%' OR email like '%${searchValueOffice}%' OR office_name like '%${searchValueOffice}%' OR office like '%${searchValueOffice}' OR address1 like '%${searchValueOffice}%' OR canteen_building_name like '%${searchValueOffice}%'`
            : "",
        },
      };
      setLoading(true);
      const responseData = await postJson("user/get_all_users_page", payload);
      setLoading(false);
      if (responseData && responseData.data) {
        setOfficeUser(responseData.data);
        setTotaldata(responseData.pageable.totalItems);
        if (selectedRowKeys.length > 0) {
          let userObjectdata = selectedRowKeys?.map((item) => {
            let dataFilter = responseData?.data?.find(
              (key) => key.user_id === item
            );
            return dataFilter;
          });

          setselectedRows(userObjectdata);
        }
      }
    } catch (error) {
      setOfficeUser([]);
      setTotaldata();
      setLoading(false);
    }
  };
  const officedataSource = officeUser?.map((item) => ({
    key: item.user_id,
    user_id: item.user_id,
    first_name: item.first_name,
    last_name: item.last_name,
    mobile_number: item.mobile_number,
    email: item.email,
    is_full_profile: item.is_full_profile,
    is_verify: item.is_verify,
    office: item.office,
    office_name: item.office_name,
    canteen_building_name: item.canteen_building_name,
    canteen_proof: item.canteen_proof,
    company_location: item.company_location,
    company_logo: item.company_logo,
  }));

  const onSelectChangeOffice = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    sendNotifcationForm.setFieldValue("useridlist", newSelectedRowKeys);
    setselectedRows(selectedRows);
  };

  const rowSelectionOffice = {
    selectedRowKeys,
    selectedRows,
    preserveSelectedRowKeys: true,
    onChange: onSelectChangeOffice,
  };
  // office user  end

  // canteen user start
  const getDataCanteen = async () => {
    try {
      const payload = {
        mobileNumber: "",
        userId: "",
        firstName: "",
        userType: "CANTEEN",
        address: "",
        searchText: "",
        isVerify: "",
        isFullProfile:"Y",
        pageable: {
          pageno: canteenpage,
          pagesize: canteenpagesize,
          filtertext: searchValuecanteen
            ? `name like '%${searchValuecanteen}%' OR user_id like '%${searchValuecanteen}%' OR first_name like '%${searchValuecanteen}%'  OR last_name like '%${searchValuecanteen}%' OR email like '%${searchValuecanteen}%' OR start_time like  '%${searchValuecanteen}%' OR end_time like '%${searchValuecanteen}%' OR address1 like '%${searchValuecanteen}%' OR canteen_building_name like '%${searchValuecanteen}%'`
            : "",
        },
      };
      setCanteenLoading(true);
      const responseData = await postJson("user/get_all_users_page", payload);
      setCanteenLoading(false);
      if (responseData && responseData.data) {
        setCanteenUser(responseData.data);
        setCanteenTotaldata(responseData.pageable.totalItems);
        if (canteenselectedRowKeys.length > 0) {
          let userObjectdata = canteenselectedRowKeys?.map((item) => {
            let dataFilter = responseData?.data?.find(
              (key) => key.user_id === item
            );
            return dataFilter;
          });

          setCanteenselectedRows(userObjectdata);
        }
      }
    } catch (error) {
      setCanteenUser([]);
      setCanteenTotaldata();
      setCanteenLoading(false);
    }
  };

  const dataSourceCanteen = canteenUser?.map((item) => ({
    key: item.user_id,
    user_id: item.user_id,
    first_name: item.first_name,
    last_name: item.last_name,
    mobile_number: item.mobile_number,
    email: item.email,
    is_full_profile: item.is_full_profile,
    is_verify: item.is_verify,
    start_time: item.start_time,
    end_time: item.end_time,
    name: item.name,
    address1: item.address1,
    is_open: item.is_open ? "open" : "close",
    canteen_building_name: item.canteen_building_name,
    canteen_proof: item.canteen_proof,
  }));

  const onSelectChangeCanteen = (newSelectedRowKeys, selectedRows) => {
    setCanteenSelectedRowKeys(newSelectedRowKeys);
    sendNotifcationForm.setFieldValue("useridlist", newSelectedRowKeys);
    setCanteenselectedRows(selectedRows);
  };

  const rowSelectionOfficeCanteen = {
    canteenselectedRowKeys,
    canteenselectedRows,
    preserveSelectedRowKeys: true,
    onChange: onSelectChangeCanteen,
  };
  // canteen user end

  // building user start
  const getDataBuilding = async () => {
    try {
      const payload = {
        mobileNumber: "",
        userId: "",
        firstName: "",
        userType: "OWNER",
        address: "",
        searchText: "",
        isVerify: "",
        isFullProfile:"Y",
        pageable: {
          pageno: buildingpage,
          pagesize: buildingpagesize,
          filtertext: searchValuebuilding
            ? `name like '%${searchValuebuilding}%' OR user_id like '%${searchValuebuilding}%' OR first_name like '%${searchValuebuilding}%'  OR last_name like '%${searchValuebuilding}%' OR email like '%${searchValuebuilding}%' OR role like  '%${searchValuebuilding}%' OR address1 like '%${searchValuebuilding}%' OR canteen_building_name like '%${searchValuebuilding}%'`
            : "",
        },
      };
      setBuildingLoading(true);
      const responseData = await postJson("user/get_all_users_page", payload);
      setBuildingLoading(false);
      if (responseData && responseData.data) {
        setBuildingUser(responseData.data);
        setBuildingTotaldata(responseData.pageable.totalItems);
        if (buildingselectedRowKeys.length > 0) {
          let userObjectdata = buildingselectedRowKeys?.map((item) => {
            let dataFilter = responseData?.data?.find(
              (key) => key.user_id === item
            );
            return dataFilter;
          });

          setBuildingselectedRows(userObjectdata);
        }
      }
    } catch (error) {
      setBuildingUser([]);
      setBuildingTotaldata();
      setBuildingLoading(false);
    }
  };

  const dataSourcebuilding = buildingUser?.map((item) => ({
    key: item.user_id,
    user_id: item.user_id,
    first_name: item.first_name,
    canteen_proof: item.canteen_proof,
    last_name: item.last_name,
    mobile_number: item.mobile_number,
    email: item.email,
    is_full_profile: item.is_full_profile,
    is_verify: item.is_verify,
    name: item.name,
    role: item.role,
    address1: item.address1,
  }));

  const onSelectChangeBuilding = (newSelectedRowKeys, selectedRows) => {
    sendNotifcationForm.setFieldValue("useridlist", newSelectedRowKeys);
    setBuildingSelectedRowKeys(newSelectedRowKeys);
    setBuildingselectedRows(selectedRows);
  };

  const rowSelectionOfficeBuilding = {
    buildingselectedRowKeys,
    buildingselectedRows,
    preserveSelectedRowKeys: true,
    onChange: onSelectChangeBuilding,
  };

  // building user end

  const onChange1 = (value) => {
    setUserType(value);
    // sendNotifcationForm.setFieldValue("usertype", value);
  };

  useEffect(() => {
    if (props.visible === true) {
      getDatanotifctiontemplate();
    }
  }, [props.visible]);
  const [notification, setNotification] = useState([]);

  const getDatanotifctiontemplate = async () => {
    try {
      setLoading(true);
      let payloade = {
        isactive: "Y",
      };
      const responseData = await postJson(
        "common/notification/get_notificationtemplete",
        payloade
      );
      if (responseData.data) {
        setLoading(false);
        setNotification(responseData?.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const handleChangeEmailTempleid = (value) => {
    sendNotifcationForm.setFieldValue("emailtempleteid", value);
  };
  const sendNotifcationForm = useFormik({
    initialValues: {
      useridlist: [],
      usertype: user?.userType,
      userid: user?.userId,
      emailtempleteid: "",
      description: "",
      title: "",
      subtitle: "",
      issend: "Y",
      isshow: "N",
      sendbyadmin: "Y",
    },
    validationSchema: Yup.object({
      useridlist: Yup.array().min(1, "At least one type must be selected"),
      usertype: Yup.string().required("userType is required"),
      description: Yup.string().required("Description is required"),
      emailtempleteid: Yup.string().required("Emailtempleteid is required"),
      title: Yup.string().required("Title is required"),
      subtitle: Yup.string().required("Subtitle is required"),
    }),
    onSubmit: async (values) => {
      setSubmitLoading(true);
      const combinedUserIds = [
        // ...sendNotifcationForm.values.useridlist,
        ...buildingselectedRowKeys,
        ...canteenselectedRowKeys,
        ...selectedRowKeys,
      ];

      const uniqueUserIds = [...new Set(combinedUserIds)];
      let payloade = {
        ...values,
        useridlist: uniqueUserIds,
      };

      try {
        const responseData = await postJson(
          "common/notification/send_notificationdata_selectuser",
          payloade
        );
        if (responseData?.status === "200") {
          cleareForm();
          props?.getData();
          setSubmitLoading(false);
        }
      } catch (error) {
        cleareForm();
        setSubmitLoading(false);
      }
    },
  });
  return (
    <>
      <Modal
        footer={false}
        title="Notification send"
        centered
        visible={props?.visible}
        onOk={() => {
          cleareForm();
        }}
        onCancel={() => {
          cleareForm();
        }}
        width={900}
      >
        <form onSubmit={sendNotifcationForm.handleSubmit}>
          <Row className="Row-Height" gutter={[10, 10]}>
            <Col span={24}>
              <label className="inputLabel">Email Tamplate Id *</label>
              <Select
                name="emailtempleteid"
                className="w-100"
                onChange={handleChangeEmailTempleid}
                value={sendNotifcationForm.values.emailtempleteid}
              >
                <Option value={""} default>
                  Select
                </Option>
                {notification?.map((item, index) => (
                  <Option value={item?.notificationtempleteid} key={index}>
                    {item?.notificationtempleteid}
                  </Option>
                ))}
              </Select>
              {sendNotifcationForm.touched.emailtempleteid &&
              sendNotifcationForm.errors.emailtempleteid ? (
                <span className="error">
                  {sendNotifcationForm.errors.emailtempleteid}
                </span>
              ) : null}
            </Col>

            <Col span={24}>
              <label className="inputLabel">User Type *</label> <br />
              <Select
                value={usertype}
                className="w-100"
                showSearch
                optionFilterProp="children"
                onChange={onChange1}
              >
                <Option value={""} default>
                  Select
                </Option>
                <Option value="CANTEEN">Canteen</Option>
                <Option value="USER">User</Option>
                <Option value="OWNER">Building</Option>
                <Option value="OWNER,USER,CANTEEN">All</Option>
              </Select>
              {sendNotifcationForm.touched.usertype &&
              sendNotifcationForm.errors.usertype ? (
                <span className="error">
                  {sendNotifcationForm.errors.usertype}
                </span>
              ) : null}
            </Col>
            <Accordion className="w-100" defaultActiveKey="0">
              {(usertype === "USER" || usertype === "OWNER,USER,CANTEEN") && (
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Office user</Accordion.Header>
                  <Accordion.Body>
                    <div className="d-flex w-100 justify-content-between">
                      <div className="">
                        {!clickPlus && !isSave && (
                          <Input
                            className="ms-2"
                            type="text"
                            placeholder="search here"
                            defaultValue={searchValueOffice}
                            onChange={(e) => {
                              setSearchValueOffice(e.target.value);
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <hr />
                    <div style={{ width: "830px" }}>
                      {!isSave && (
                        <Table
                          className="custom_table"
                          {...(clickPlus
                            ? {}
                            : {
                                rowSelection: {
                                  ...rowSelectionOffice,
                                  selectedRowKeys: selectedRowKeys,
                                },
                              })}
                          columns={officeusercolumns}
                          dataSource={officedataSource}
                          scroll={{ x: 1000 }}
                          loading={loading}
                          pagination={{
                            total: totaldata,
                            showSizeChanger: true,
                            pageSizeOptions: [5, 10, 25, 100],
                            onChange: (page, pagesize) => {
                              Setofficepage(page - 1);
                              Setofficepagesize(pagesize);
                            },
                          }}
                        />
                      )}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              )}

              {(usertype === "CANTEEN" ||
                usertype === "OWNER,USER,CANTEEN") && (
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Canteen user</Accordion.Header>
                  <Accordion.Body>
                    <div className="d-flex w-100 justify-content-between">
                      <div className="">
                        {!clickPlus && !isSave && (
                          <Input
                            className="ms-2"
                            type="text"
                            placeholder="search here"
                            defaultValue={searchValuecanteen}
                            onChange={(e) => {
                              setSearchValueCanteen(e.target.value);
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <hr />
                    <div style={{ width: "830px" }}>
                      {!isSave && (
                        <Table
                          className="custom_table"
                          {...(clickPlus
                            ? {}
                            : {
                                rowSelection: {
                                  ...rowSelectionOfficeCanteen,
                                  selectedRowKeys: canteenselectedRowKeys,
                                },
                              })}
                          columns={columnsCanteen}
                          dataSource={dataSourceCanteen}
                          scroll={{ x: 1000 }}
                          loading={canteenloading}
                          pagination={{
                            total: canteentotaldata,
                            showSizeChanger: true,
                            pageSizeOptions: [5, 10, 25, 100],
                            onChange: (page, pagesize) => {
                              SetCanteenpage(page - 1);
                              SetCanteenpagesize(pagesize);
                            },
                          }}
                        />
                      )}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              )}

              {(usertype === "OWNER" || usertype === "OWNER,USER,CANTEEN") && (
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Building user</Accordion.Header>
                  <Accordion.Body>
                    <div className="d-flex w-100 justify-content-between">
                      <div className="">
                        <h5 className="mb-0"></h5>
                        {!clickPlus && !isSave && (
                          <Input
                            className="ms-2"
                            type="text"
                            placeholder="search here"
                            defaultValue={searchValuebuilding}
                            onChange={(e) => {
                              setSearchValueBuilding(e.target.value);
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <hr />
                    <div style={{ width: "830px" }}>
                      {!isSave && (
                        <Table
                          className="custom_table"
                          {...(clickPlus
                            ? {}
                            : {
                                rowSelection: {
                                  ...rowSelectionOfficeBuilding,
                                  selectedRowKeys: buildingselectedRowKeys,
                                },
                              })}
                          columns={columnsBuilding}
                          dataSource={dataSourcebuilding}
                          scroll={{ x: 1000 }}
                          loading={buildingloading}
                          pagination={{
                            total: buildingtotaldata,
                            showSizeChanger: true,
                            pageSizeOptions: [5, 10, 25, 100],
                            onChange: (page, pagesize) => {
                              SetBuildingpage(page - 1);
                              SetBuildingpagesize(pagesize);
                            },
                          }}
                        />
                      )}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              )}
            </Accordion>

            <Col span={24}>
              <label className="inputLabel">Description *</label>
              <TextArea
                name="description"
                id="description"
                onChange={sendNotifcationForm.handleChange}
                value={sendNotifcationForm.values.description}
              />
              {sendNotifcationForm.touched.description &&
              sendNotifcationForm.errors.description ? (
                <span className="error">
                  {sendNotifcationForm.errors.description}
                </span>
              ) : null}
            </Col>

            <Col span={24}>
              <label className="inputLabel">Title *</label>
              <Input
                name="title"
                id="title"
                onChange={sendNotifcationForm.handleChange}
                value={sendNotifcationForm.values.title}
              />
              {sendNotifcationForm.touched.title &&
              sendNotifcationForm.errors.title ? (
                <span className="error">
                  {sendNotifcationForm.errors.title}
                </span>
              ) : null}
            </Col>
            <Col span={24}>
              <label className="inputLabel">Subtitle *</label>
              <Input
                name="subtitle"
                id="subtitle"
                onChange={sendNotifcationForm.handleChange}
                value={sendNotifcationForm.values.subtitle}
              />
              {sendNotifcationForm.touched.title &&
              sendNotifcationForm.errors.title ? (
                <span className="error">
                  {sendNotifcationForm.errors.title}
                </span>
              ) : null}
            </Col>

            <Col span={12} className="mt-4 p-0">
              <Button
                type="primary"
                htmlType="submit"
                className="custom_activeInactive_btn"
              >
                {submitLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  cleareForm();
                }}
                className="custom_activeInactive_btn"
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </form>
      </Modal>
    </>
  );
};

export default SendNotifcationmodel;
