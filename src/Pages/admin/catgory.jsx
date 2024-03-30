import React, { useState, useEffect } from "react";
import { Button, Col, Input, Layout, Modal, Row, Select, Table } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { postJson } from "../../Common/api-instance";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Spinner } from "react-bootstrap";

const Catgory = () => {
  const [visible, setVisible] = useState(false);
  const [visibleview, setVisibleview] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [page, Setpage] = useState(0);
  const [pagesize, Setpagesize] = useState(10);
  const [totaldata,setTotaldata] = useState();
  const [category, setCategory] = useState([]);
  const [view, setView] = useState({});
  const [isEdit, setIsedit] = useState()
  const [submitloader, setSubmitLoader] = useState(false)
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: "Id",
      dataIndex: "category_id",
    },
    {
      title: "Category Name",
      dataIndex: "category_name",
    },

    {
      title: "Status",
      dataIndex: "is_active",
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
  }, [searchValue, page, pagesize]);
  const getData = async () => {
    try {
      setLoading(true)
      let payloade = {
        categoryId:"",
        categoryName:searchValue,
        isActive:"",
        pageable:{
          pageno:page,
          pagesize:pagesize
        }
      }
      const responseData = await postJson("category/get_all_category_page",payloade);
      if(responseData.data){
        setLoading(false)
        setCategory(responseData?.data);
        setTotaldata(responseData?.pageable?.totalItems)
      }
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  };

  const dataSource = category.map((item) => {
      return {
        key: item.category_id,
        category_id: item.category_id,
        category_name: item.category_name,
        is_active: item.is_active === "Y" ? "Active" : "In-Active",
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

  const categoryListForm = useFormik({
    initialValues: {
      categoryId:"",
      categoryName: "",
      isActive: "",
    },
    validationSchema: Yup.object({
      categoryName: Yup.string().required("Category Name is required"),
      isActive: Yup.string().required("Stauts is required"),
    }),
    onSubmit: async (values) => {
      setSubmitLoader(true)
      try {
        const responseData = await postJson("category/create_category",
         {
          categoryId: isEdit ? isEdit :"",
          categoryName: values.categoryName,
          isActive: values.isActive
         });
        if (responseData.status == 101) {
          toast.error(`${responseData.massage}`);
          setVisible(false);
          setSubmitLoader(false)
          categoryListForm.resetForm();
          setIsedit()
        } else {
          setSubmitLoader(false)
          toast.success(`${isEdit?"Update Successfully":"Add Successfully"}`);
          setVisible(false);
          categoryListForm.resetForm();
          setIsedit()
          getData()
        }
      } catch (error) {
        setSubmitLoader(false)
        console.log(error);
      }
    },
  });
  const { Option } = Select;
  const onChange = (value) => {

    categoryListForm.setFieldValue("isActive", value);
  };
  const handleEdit = (record) => {
      categoryListForm.setFieldValue("categoryName", record.category_name);
      categoryListForm.setFieldValue("isActive", record.is_active == "Active" ? "Y" : "N");
      setIsedit(record.category_id)
    setVisible(true);
  };
  return (
<>
<Layout className="bg-white">
      <div className="container-fluid p-0 d-flex justify-content-between customers_header">
        <h4>Category Lists</h4>
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
      title="Category "
      centered
      visible={visible}
      onOk={() => {
        setVisible(false);
        categoryListForm.resetForm();
        setIsedit()
      }}
      onCancel={() => {
        setVisible(false);
        categoryListForm.resetForm();
        setIsedit()
      }}
      width={500}
    >
      <form onSubmit={categoryListForm.handleSubmit}>
        <Row className="Row-Height" gutter={[10, 10]}>
          <Col span={24}>
            {/* <Row gutter={[10, 10]}> */}

            <Col span={24}>
              <label className="inputLabel">Category Name*</label>
              <Input
                name="categoryName"
                type="text"
                value={categoryListForm.values.categoryName}
                onChange={categoryListForm.handleChange}
              />
              {categoryListForm.touched.categoryName &&
              categoryListForm.errors.categoryName ? (
                <span className="error">{categoryListForm.errors.categoryName}</span>
              ) : null}
            </Col>
            <Col span={24} className="mt-3">
              <label className="inputLabel">Is Active*</label>
              <br />
              <Select
                value={categoryListForm.values.isActive}
                className="w-100"
                showSearch
                optionFilterProp="children"
                onChange={onChange}
              >
                <Option value="Y">Active</Option>
                <Option value="N">In-Active</Option>
              </Select>
              <br />
              {categoryListForm.touched.isActive &&
              categoryListForm.errors.isActive ? (
                <span className="error">{categoryListForm.errors.isActive}</span>
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
                <p>Category Id :</p>
              </Col>
              <Col span={16}>
                <p>{view.category_id}</p>
              </Col>
            </div>
            <div className="d-flex">
              <Col span={7}>
                <p>Category Name :</p>
              </Col>
              <Col span={16}>
                <p>{view.category_name}</p>
              </Col>
            </div>
            <Col span={24} className="mt-4 p-0">
              <Button
                type="primary"
                onClick={() => {
                  categoryListForm.resetForm();
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
  )
}

export default Catgory