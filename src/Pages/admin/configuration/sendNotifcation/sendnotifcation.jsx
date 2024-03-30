import React, { useEffect, useState } from "react";
import { Button, Table, Layout, Input, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { postJson } from "../../../../Common/api-instance";
import SendNotifcationmodel from "./sendNotifcationmodel";
import toast from "react-hot-toast";
import moment from "moment";
import Viewsendnotifcation from "./viewsendnotifcation";
const Sendnotifcation = () => {
  const [selectedRowList, setselectedRowList] = useState([]);
  const [selectedRowKeyList, setSelectedRowKeyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [totaldata, setTotaldata] = useState(false);
  const [pagelist, SetpageList] = useState(0);
  const [pagesizelist, SetpagesizeList] = useState(10);
  const [visible, setVisible] = useState(false);
  const [notificationlist, setNotificationlist] = useState([]);
  const [record, setRecord] = useState({})
  const [viewrecord, setViewRecord] = useState({})
  const [notificationViewmodel , setNotifactionViewModel] = useState(false)
  //Notification list  Modal
  const modalHandleDetails = (record) => {
    setViewRecord(record)
    setNotifactionViewModel(true)
  };

  const modalHandle = async (record, isEdit) => {
    setRecord(record)
    setVisible(isEdit);
  };


  const onSelectChangeList = (newSelectedRowKeyList, selectedRowList) => {
    setSelectedRowKeyList(newSelectedRowKeyList);
    setselectedRowList(selectedRowList);
  };
  const rowSelectionList = {
    selectedRowKeyList,
    selectedRowList,
    preserveSelectedRowKeys: true,
    onChange: onSelectChangeList,
  };

  const columnsNotificationList = [
    {
      title: "ID",
      dataIndex: "txtnumber",
      sorter: (a, b) => a?.txtnumber - b?.txtnumber,
      onCell: (record, rowIndex) => {
        return {
          onClick: () => {
            modalHandle(record, true);
          },
        };
      },
      className: "hasFormHover",
    },
    {
      title: "Title",
      dataIndex: "title",
      sorter: {
        compare: (a, b) => a?.title?.localeCompare(b?.title),
        multiple: 1,
      },
    },

    {
      title: "Description",
      dataIndex: "description",
      sorter: {
        compare: (a, b) => a?.description?.localeCompare(b?.description),
        multiple: 1,
      },
    },

    {
      title: "Type",
      dataIndex: "usertype",
      sorter: {
        compare: (a, b) => a?.usertype?.localeCompare(b?.usertype),
        multiple: 1,
      },
    },
    {
      title: "Sub Title",
      dataIndex: "subtitle",
      sorter: {
        compare: (a, b) => a?.subtitle?.localeCompare(b?.subtitle),
        multiple: 1,
      },
    },

    {
      title: "Send count ",
      dataIndex: "data_count",
      sorter: (a, b) => a?.data_count - b?.data_count,
      width: "10%",
    },
    {
      title: "createdon",
      dataIndex: "createdon",
      sorter: {
        compare: (a, b) => a?.createdon?.localeCompare(b?.createdon),
        multiple: 1,
      },
    },
    {
      title: "Action",
      key: "action",
      sorter: true,
      render: (record) => (
        <Space size="large">
          <EyeOutlined
            style={{
              fontSize: "18px",
              width: "20px",
              height: "20px",
            }}
            onClick={() => modalHandleDetails(record)}
          />
        </Space>
      ),
    
      className: "hasFormHover",
      width: "6%",
    },
  ];

  const getData = async () => {
    try {
      setLoading(true);
      const payload = {
        userid:"",
        issend: "Y",
        sendbyadmin: "Y",
        pageable: {
          pageno: pagelist,
          pagesize: pagesizelist,
          filtertext:
            searchValue.length > 0
              ? `txtnumber like '%${searchValue}%' OR subtitle like '%${searchValue}%'  OR data_count like '%${searchValue}%' OR description like '%${searchValue}%' OR title like '%${searchValue}%'`
              : "",
        },
      };
      const responseData = await postJson(
        "common/notification/get_notificationlist",
        payload
      );
      if (responseData.data.length > 0 && responseData.status === "200") {
        setLoading(false);
        setNotificationlist(responseData?.data);
       
        setTotaldata(responseData?.pageable?.totalItems);
      } else if(responseData.status === "999"){
        toast.error(`${responseData.massage}`)
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [searchValue, pagesizelist, pagelist]);
  const dataSourceNotificationList =
    notificationlist.length > 0 &&
    notificationlist?.map((item) => {
      return {
        key: item?.txtnumber,
        txtnumber: item?.txtnumber,
        usertype: item?.usertype,
        // emailtempleteid: string;
        createdon:moment(item?.createdon, "DD/MM/YYYY hh:mm").format("DD/MM/YYYY hh:mm a"),
        description: item?.description,
        title: item?.title,
        data_count: item?.data_count,
        subtitle: item?.subtitle
      };
    });
  return (
    <>
      {" "}
      <Layout className="custom_MainBackground">
        <div className="container-fluid p-0 d-flex justify-content-between customers_header">
          <h4> Notification Send</h4>
          <div className="d-flex">
            <Button
              type="primary"
              className="custom_activeInactive_btn"
              onClick={() => modalHandle(null, true)}
            >
              Add New
            </Button>
          </div>
        </div>

        <div className="custom_TableWrapper container-fluid">
          <div className="d-flex">
            <label className="mt-1">
              <b>Search:</b>
            </label>
            <Input
              className="w-50 ms-2"
              type="text"
              defaultValue={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            />
          </div>
          <hr />
          <Table
            className="custom_table"
            rowSelection={rowSelectionList}
            columns={columnsNotificationList}
            loading={loading}
            dataSource={dataSourceNotificationList}
            scroll={{ x: 1000 }}
            pagination={{
              total: totaldata,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 25, 100],
              onChange: (page, pagesize) => {
                SetpageList(page - 1);
                SetpagesizeList(pagesize);
              },
            }}
          />
        </div>
      </Layout>
      <SendNotifcationmodel
        visible={visible}
        record={record}
        getData={()=>getData()}
        onClose={() =>{ setVisible(false); setRecord({}) }}
      />
      <Viewsendnotifcation open={notificationViewmodel} onClose={()=>{setNotifactionViewModel(false); setRecord({})}} record={viewrecord}/>
    </>
  );
};

export default Sendnotifcation;
