import {
    Button,
    Table,
    Layout,
    Input,
  } from "antd";
import { useEffect,  useState } from "react";
import moment from "moment";
import NotifcationModel from "./notifcationModel";
import { postJson } from "../../../../Common/api-instance";
  
  const Notifications = () => {
  
    const [visible, setVisible] = useState(false);
    const [isEdit, setisEdited] = useState(false);
    const [page, Setpage] = useState(0);
    const [pagesize, Setpagesize] = useState(10);
    const [searchValue, setSearchValue] = useState("");
    const [modalData, setModalData] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setselectedRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totaldata, setTotaldata] = useState();
    const [notification, setNotification] = useState()
    useEffect(() => {
      getData();
    // common/notification/get_notificationtemplete
    }, [visible, page, pagesize, searchValue]);
  
    const getData = async () => {
      try {
        setLoading(true)
        let payloade = {
          isactive: "",
          pageable: {
            pageno: page,
            pagesize: pagesize,
            filtertext:searchValue.length > 0 ? `title like '%${searchValue}%' OR description like '%${searchValue}%' OR  subtitle like '%${searchValue}%' OR isactive like '%${searchValue.toLowerCase() == "active" ? "Y" : searchValue.toLowerCase() == "in-active" ? "N": searchValue }%'`:"",
          },
        }
        const responseData = await postJson ("common/notification/get_notificationtemplete",payloade);
        if(responseData.data){
          setLoading(false)
          setNotification(responseData?.data);
          setTotaldata(responseData?.pageable?.totalItems)
        }
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };
  
    const columns= [
      {
        title: "Notification Templete Name",
        dataIndex: "notificationtempleteid",
        sorter: {
          compare: (a, b) =>
            a?.notificationtempleteid?.localeCompare(b?.notificationtempleteid),
          multiple: 1,
        },
      },
      {
        title: "Title",
        dataIndex: "title",
        sorter: {
          compare: (a, b) => a?.title?.localeCompare(b?.title),
          multiple: 1,
        },
        onCell: (record) => {
          return {
            onClick: () => {
              modalHandleforEdit(record, true);
            },
          };
        },
        className: "hasFormHover",
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
        title: "Type of Notification",
        dataIndex: "type",
        sorter: {
          compare: (a, b) => a?.type?.localeCompare(b?.type),
          multiple: 1,
        },
      },
      
      {
        title: "Created On",
        dataIndex: "createdon",
        sorter: {
          compare: (a, b) => a?.createdon?.localeCompare(b?.createdon),
          multiple: 1,
        },
      },
      {
        title: "Modified On",
        dataIndex: "modifiedon",
        sorter: {
          compare: (a, b) => a?.modifiedon?.localeCompare(b?.modifiedon),
          multiple: 1,
        },
      },
    
      {
        title: "Is Active",
        dataIndex: "isActive",
        sorter: {
          compare: (a, b) => a?.isActive?.localeCompare(b?.isActive),
          multiple: 1,
        },
      },
    ];
    
    const dataSource = notification
      ?.filter((data) => {
        (
          data?.notificationtempleteid &&
          data?.title &&
          data?.type &&
          data?.parameter &&
          data?.isactive
        )
          ?.toLowerCase()
          ?.includes(searchValue?.toLowerCase());
        return data;
      })
      .map(
        (item) => {
          return {
            key: item?.notificationtempleteid,
            notificationtempleteid: item?.notificationtempleteid,
            title: item?.title,
            type: item?.type,
            parameter: item?.parameter,
            subtitle: item?.subtitle,
            videourl: item?.videourl,
            imageurl: item?.imageurl,
            description: item?.description,
            createdby: item?.createdby ?? "",
            createdon: moment(item?.createdon).format("DD/MM/YYYY") ?? "",
            modifiedby: item?.modifiedby ?? "",
            modifiedon: moment(item?.modifiedon).format("DD/MM/YYYY") ?? "",
            isActive: item?.isactive === "Y" ? "Active" : "In-Active",
          };
        }
      );
    
 
    const modalHandle = async (isEdit) => {
      setisEdited(isEdit);
      setVisible(true);
    };
  
    // Dropdown Select

    const modalHandleforEdit = (record, isEdit) => {
      setisEdited(isEdit);
      setVisible(true);
      setModalData(record);
    };

    /*--------------------API CALL END HERE--------------------*/
  
    const onSelectChange = (
      newSelectedRowKeys,
      selectedRows
    ) => {
      setSelectedRowKeys(newSelectedRowKeys);
      setselectedRows(selectedRows);
    };
    const rowSelection = {
      selectedRowKeys,
      selectedRows,
      preserveSelectedRowKeys: true,
      onChange: onSelectChange,
    };
  


  

  
    return (
      <>
        <Layout className="custom_MainBackground">
          <div>
            <div className="container-fluid p-0 d-flex justify-content-between customers_header">
              <h4>Notification Page</h4>
              <div className="d-flex">
                <Button
                  type="primary"
                  className="custom_activeInactive_btn"
                  onClick={() => modalHandle(false)}
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
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 1000 }}
                loading={loading}
                pagination={{
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
          </div>
        </Layout>
        <NotifcationModel visible={visible} data={modalData} onClose={()=>setVisible(false)} />
      </>
    );
  };
  
  export default Notifications