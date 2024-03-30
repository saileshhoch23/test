import { Modal, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { postJson } from "../../../../Common/api-instance";
import { Accordion } from "react-bootstrap";

const Viewsendnotifcation = (props) => {
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [canteenList, setCanteenList] = useState([]);
  const [buildingUser, setBuildingUser] = useState([]);
const cleareData = () =>{
  setCanteenList([]);
  setBuildingUser([]);
  setUserList([]);
}
  const columnsBuilding = [
    {
      title: "Id",
      dataIndex: "txtnumber",
    },

    {
      title: "userid",
      dataIndex: "userid",
    },
    {
      title: "First Name",
      dataIndex: "first_name",
    },
    {
      title: "email ",
      dataIndex: "email",
    },
    {
      title: "subtitle",
      dataIndex: "subtitle",
    },
    {
      title: "User type",
      dataIndex: "user_type",
    },
    // {
    //   title: "isshow",
    //   dataIndex: "isshow",
    // },
  ];

  const dataSourcecanteenList = canteenList?.map((item) => ({
    key: item.userid,
    txtnumber: item.txtnumber,
    first_name: item.first_name,
    userid: item.userid,
    subtitle: item.subtitle,
    mobile_number: item.mobile_number,
    email: item.email,
    // isshow: item.isshow,
    user_type: item.user_type,
  }));

  const dataSourceBuilding = buildingUser?.map((item) => ({
    key: item.userid,
    txtnumber: item.txtnumber,
    first_name: item.first_name,
    userid: item.userid,
    subtitle: item.subtitle,
    mobile_number: item.mobile_number,
    email: item.email,
    // isshow: item.isshow,
    user_type: item.user_type,
  }));

  const dataSourceUserlist = userList?.map((item) => ({
    key: item.userid,
    txtnumber: item.txtnumber,
    first_name: item.first_name,
    userid: item.userid,
    subtitle: item.subtitle,
    mobile_number: item.mobile_number,
    email: item.email,
    // isshow: item.isshow,
    user_type: item.user_type,
  }));
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
      const responseData = await postJson(
        "common/notification/get_notificationdetail",
        payload
      );
      if (responseData?.data) {
        let canteenKeys = [];
        let userKeys = [];
        let buildingKeys = [];
        let userDataTypes = [];

        responseData?.data?.forEach((item) => {
          if (!userDataTypes.includes(item.user_type)) {
            userDataTypes?.push(item.user_type);
          }

          if (item.user_type === "CANTEEN") {
            canteenKeys.push(item);
          } else if (item.user_type === "USER") {
            userKeys.push(item);
          } else if (item.user_type === "OWNER") {
            buildingKeys.push(item);
          }
        });
        setCanteenList(canteenKeys);
        setLoading(false);
        setUserList(userKeys);
        setBuildingUser(buildingKeys);
        // console.log(canteenKeys, userKeys, buildingKeys)
        // Update state variables

        // setUserType(
        //   userDataTypes.length > 1
        //     ? "OWNER,USER,CANTEEN"
        //     : userDataTypes.toString()
        // );
        // Fetch data based on user types
      }
    } catch (error) {
      setLoading(false);
      // console.log(error);
    }
  };
  return (
    <>
      <Modal
        footer={false}
        loading={loading}
        title="Notification send view  "
        centered
        visible={props?.open}
        onOk={() => {
          props.onClose();
          cleareData()
        }}
        onCancel={() => {
          props.onClose();
          cleareData()
        }}
        width={900}
      >
      {loading === true ?(
        <div className="d-flex justify-content-center">
        <Spin />
      </div>
      ):(
        <Accordion className="w-100" defaultActiveKey="0">
          {userList.length > 0 && (
            <>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Office user</Accordion.Header>
            <Accordion.Body>
              <Table
                className="custom_table"
                columns={columnsBuilding}
                dataSource={dataSourceUserlist}
                scroll={{ x: 1000 }}
                loading={loading}
                pagination={true}
              />
            </Accordion.Body>
          </Accordion.Item>
          </>
          )}
           {canteenList.length > 0 && (
            <>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Canteen user</Accordion.Header>
            <Accordion.Body>
              <Table
                className="custom_table"
                columns={columnsBuilding}
                dataSource={dataSourcecanteenList}
                scroll={{ x: 1000 }}
                loading={loading}
                pagination={true}
              />
            </Accordion.Body>
          </Accordion.Item>
          </>
          )}
          {buildingUser.length > 0 && (
            <>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Building user</Accordion.Header>
            <Accordion.Body>
              <Table
                className="custom_table"
                columns={columnsBuilding}
                dataSource={dataSourceBuilding}
                scroll={{ x: 1000 }}
                loading={loading}
                pagination={true}
              />
            </Accordion.Body>
          </Accordion.Item>
          </>
          )}
        </Accordion>)}
      </Modal>
    </>
  );
};

export default Viewsendnotifcation;
