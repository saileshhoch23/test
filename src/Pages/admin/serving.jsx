import { Col, Input, Layout, Modal, Row, Table, Button, Select } from "antd";
import React, { useEffect, useState } from "react";
import { postJson } from "../../Common/api-instance";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Spinner } from "react-bootstrap";

const Serving = () => {
  const [loading, setLoading] = useState("");
  const [page, Setpage] = useState(0);
  const [pagesize, Setpagesize] = useState(10);
  const [totaldata, setTotaldata] = useState();
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [visibleview, setVisibleview] = useState(false);
  const [view, setView] = useState({});
  const [isEdit, setIsedit] = useState()
  const [submitloader, setSubmitLoader] = useState(false)
  const columns = [
    {
      title: "Id",
      dataIndex: "serving_type_id",
    },
    {
      title: "serving type name",
      dataIndex: "serving_type_name",
    },
    {
      title: "Is Returnable",
      dataIndex: "is_returnable",
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
  const dataSource = data?.map((item) => ({
    key: item.serving_type_id,
    serving_type_id: item.serving_type_id,
    serving_type_name: item.serving_type_name,
    is_returnable: item.is_returnable?"true":"false",
    isActive: item?.is_active === "Y" ? "Active" : "In-Active",
  }));
  const getDataCanteen = async () => {
    try {
      const payload = {
        servingTypeId: "",
        servingTypeName: searchValue,
        isActive:"" ,
        isReturnable: "",
        pageable: {
          pageno: page,
          pagesize: pagesize,
        },
      };
      setLoading(true);
      const responseData = await postJson(
        "canteen/get_all_serving_type_page",
        payload
      );
      if (responseData && responseData.data) {
        setLoading(false);
        setData(responseData?.data);
        setTotaldata(responseData?.pageable?.totalItems);
      }
    } catch (error) {
      setData([]);
      setTotaldata();
      setLoading(false);
    }
  };
  
 useEffect(()=>{
  getDataCanteen()
 },[searchValue])

 const handleView = (record) => {
  setView(record);
  setVisibleview(true);
};
 const handleEdit = (record) => {
  servingtypeForm.setFieldValue("servingTypeName", record.serving_type_name);
  servingtypeForm.setFieldValue("isReturnable", record.is_active === true ? true: false);
  setIsedit(record.serving_type_id)
setVisible(true);
};


  
  const servingtypeForm = useFormik({
    initialValues: {
      servingTypeId:"",
      servingTypeName: "",
      isReturnable: "",
    },
    validationSchema: Yup.object({
      servingTypeName: Yup.string().required("Serving TypeName is required"),
      isReturnable: Yup.string().required("isReturnable is required"),
    }),
    onSubmit: async (values) => {
      setSubmitLoader(true)
      try {
        const responseData = await postJson("canteen/add_new_serving_type",
         {
          servingTypeId: isEdit ? isEdit :"",
          servingTypeName: values.servingTypeName,
          isReturnable: values.isReturnable === "true" ? true : false
         });
        if (responseData.status === 101) {
          toast.error(`${responseData.massage}`);
          setVisible(false);
          setSubmitLoader(false)
          servingtypeForm.resetForm();
          setIsedit()
        } else {
          setSubmitLoader(false)
          toast.success(`${isEdit?"Update Successfully":"Add Successfully"}`);
          setVisible(false);
          servingtypeForm.resetForm();
          setIsedit()
          getDataCanteen()
        }
      } catch (error) {
        setSubmitLoader(false)
        console.log(error);
      }
    },
  });
  const { Option } = Select;
  const onChange = (value) => {

    servingtypeForm.setFieldValue("isReturnable", value);
  };
  return (
    <>
      <Layout className="bg-white p-5">
        <div className="container-fluid p-0 d-flex justify-content-between customers_header">
          <div className="w-50">
            <label className="mt-1">Search:</label>
            <Input
              className="w-25 ms-2"
              type="text"
              name="searchValue"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <div className="d-flex">
          <Button
            type="primary"
            onClick={() => setVisible(true)}
          >
            Add New
          </Button>
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
              total: totaldata,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 25, 100],
              onChange: (page, pagesize) => {
                Setpage(page);
                Setpagesize(pagesize);
              },
            }}
          />
        </div>
      </Layout>
      <Modal
        footer={false}
        title="Serving"
        centered
        visible={visible}
        onOk={() => {
          setVisible(false);
         
        }}
        onCancel={() => {
          setVisible(false);
          
        }}
        width={500}
      >
      <form onSubmit={servingtypeForm.handleSubmit}>
        <Row className="Row-Height" gutter={[10, 10]}>
          <Col span={24}>
            {/* <Row gutter={[10, 10]}> */}

            <Col span={24}>
              <label className="inputLabel">Serving TypeName*</label>
              <Input
                name="servingTypeName"
                type="text"
                value={servingtypeForm.values.servingTypeName}
                onChange={servingtypeForm.handleChange}
              />
              {servingtypeForm.touched.servingTypeName &&
              servingtypeForm.errors.servingTypeName ? (
                <span className="error">{servingtypeForm.errors.servingTypeName}</span>
              ) : null}
            </Col>
            <Col span={24} className="mt-3">
              <label className="inputLabel">Is Active*</label>
              <br />
              <Select
                value={servingtypeForm.values.isReturnable.toString()}
                className="w-100"
                showSearch
                optionFilterProp="children"
                onChange={onChange}
              >
                <Option value="true">true</Option>
                <Option value="false">false</Option>
              </Select>
              <br />
              {servingtypeForm.touched.isReturnable &&
              servingtypeForm.errors.isReturnable ? (
                <span className="error">{servingtypeForm.errors.isReturnable}</span>
              ) : null}
            </Col>
            <Col span={24} className="mt-4 p-0">
              <Button type="primary" htmlType="submit" className="mx-2">
               {submitloader?(
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Save"
                  )}
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
      title="Category"
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
                <p>ServingType Id :</p>
              </Col>
              <Col span={16}>
                <p>{view.serving_type_id}</p>
              </Col>
            </div>
            <div className="d-flex">
              <Col span={8}>
                <p>Serving TypeName :</p>
              </Col>
              <Col span={15}>
                <p>{view.serving_type_name}</p>
              </Col>
            </div>
            <div className="d-flex">
              <Col span={8}>
                <p>Is Returnable :</p>
              </Col>
              <Col span={15}>
                <p>{view.is_returnable}</p>
              </Col>
            </div>
            <Col span={24} className="mt-4 p-0">
              <Button
                type="primary"
                onClick={() => {
                  servingtypeForm.resetForm();
                  setIsedit();
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

export default Serving;
