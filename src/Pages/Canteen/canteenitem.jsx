import React, { useState, useEffect, useRef } from "react";
import { Button, Col, Input, Layout, Modal, Row, Switch, Table, Select } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { post, postJson } from "../../Common/api-instance";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../Common/common.css";
import toast from "react-hot-toast";
import "./canteen.css";
import { useSelector } from "react-redux";
import {
  imageFormat,
  imageMessage,
  xlsxFormat,
  xlsxMessage,
} from "../../Common/img-validation";
import { Spinner } from "react-bootstrap";
import {OrderCard} from "../../Components/Ordercard/orderCard";

const Canteenitem = () => {
  const canteenuser = useSelector((state) => state.user);
  const [visible, setVisible] = useState(false);
  const [visibleview, setVisibleview] = useState(false);
  const [categoryModel, setCategoryModel] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subloading, setSubloading] = useState(false);
  const [view, setView] = useState({});
  const [category, setCategory] = useState([]);
  const [servingtype, setServingType] = useState([]);
  const [image, setImage] = useState("");
  const [file, setFile] = useState(null);
  const [CanteenMenurecord, setCanteenMenurecord] = useState({});
  const [imgupload, setImgupload] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [page, Setpage] = useState(1);
  const [pagesize, Setpagesize] = useState(10);
  const [totaldata,setTotaldata] = useState();
  const imageInputRef = useRef();
  const fileInputRef = useRef();
  const [selectedTab, setSelectedTab] = useState("single_item");
  const { Option } = Select;
  const cleareData = () => {
    canteenItem.resetForm();
    categoryItme.resetForm();
    multyipalItme.resetForm();
    setCanteenMenurecord();
    setFile(null);
    setIsEdit(false);
    setImage("");
    canteenItem.setFieldValue("addDiscount","");
    canteenItem.setFieldValue("discountType","");
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSelectedTab("single_item");
  };
  // isactive and in-active  api call

  const handleStatusChange = async (checked, record) => {
    try {
      const responseData = await postJson(
        "canteen/active_inactive_canteenmenu_item",
        {
          canteenMenuId: record?.canteenMenuId,
          isActive: checked ? "Y" : "N",
        }
      );
      if (responseData.status == 200) {
        getData();
      }
    } catch (error) {
    } finally {
    }
  };

  // table colums
  const columns = [
    {
      title: "Id",
      dataIndex: "canteenMenuId",
    },
    {
      title: "Image ",
      dataIndex: "imagePath",
      render: (imagePath) => (
        <>
          <img
            src={imagePath}
            alt="Canteen Item"
            style={{ width: 50, height: 50 }}
          />
        </>
      ),
    },
    {
      title: "MenuItem Name",
      dataIndex: "canteenMenuItemName",
    },
    {
      title: "Discounted ",
      dataIndex: "addDiscount",
    },
    {
      title: "Discounted Type",
      dataIndex: "discountType",
    },
    {
      title: "MenuItem Price",
      dataIndex: "canteenMenuItemPrice",
    },
    {
      title: "Serving Type",
      dataIndex: "servingType",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive, record) => (
        <>
          <Switch
            checked={isActive === "Y"}
            onChange={(checked) => handleStatusChange(checked, record)}
          />
        </>
      ),
    },

    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <>
          <Button
            className="gray boderrmove mx-1"
            onClick={() => handleEdit(record, true)}
            icon={<EditOutlined />}
          ></Button>
          <Button
            className="gray boderrmove  mx-1"
            onClick={() => handleView(record)}
            icon={<EyeOutlined />}
          ></Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, [searchValue, page, pagesize,visible]);

  useEffect(() => {
    getCategory();
    getServerType();
  }, [visible]);

  const getData = async () => {
    try {
      const payload = {
        canteenId:canteenuser?.userId,
        canteenMenuItemName:searchValue,
        page:page,
      pageSize:pagesize
      }
      setLoading(true);
      const responseData = await postJson(
        "canteen/get_item_list_by_item_name",payload
      );
      setLoading(false);
      if (responseData && responseData.data) {
        setUser(responseData.data.content);
        setTotaldata(responseData.data.totalElements)
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const getServerType = async () => {
    try {
      setLoading(true);
      const responseData = await postJson("canteen/get_all_serving_type");
  
      if (responseData && responseData.data) {
        setServingType(responseData.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  const getCategory = async () => {
    try {
      setLoading(true);
      const responseData = await postJson("category/get_all_category");
      setLoading(false);
      if (responseData && responseData.data) {
        setCategory(responseData.data);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const dataSource = user?.map((item) => ({
    key: item.canteenMenuId,
    categoryId: item.categoryId.categoryId,
    addDiscount: item.addDiscount,
    discountType: item.discountType,
    canteenMenuId: item.canteenMenuId,
    canteenMenuItemName: item.canteenMenuItemName,
    canteenMenuItemPrice: item.canteenMenuItemPrice,
    imagePath: item.imagePath,
    discountedPrice: item.discountedPrice,
    servingType: item.servingType,
    isActive: item.isActive,
  }));

  const handleView = (record) => {
    setView(record);
    setVisibleview(true);
  };

  const onChangeImage = (event) => {
    const selectedFile = event.target.files[0];
    if (!event.target.files[0]?.name?.match(imageFormat)) {
      if (imageInputRef.current) imageInputRef.current.value = "";
      setImgupload(false);
      toast.error(imageMessage);
      return false;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        setFile(URL.createObjectURL(event.target.files[0]));
        setImage(selectedFile);
        setImgupload(false);
        canteenItem.setFieldValue("document1", selectedFile);
      };
    };
    reader.readAsDataURL(selectedFile);
  };
  
  const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile.name.match(xlsxFormat)) {
      toast.error(xlsxMessage);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return false;
    }

    multyipalItme.setFieldValue("file", selectedFile);
  };
  const canteenItem = useFormik({
    initialValues: {
      canteenMenuId: "",
      document1: "",
      canteenMenuItemName: "",
      canteenMenuItemPrice: "",
      categoryId: "",
      canteenId: canteenuser?.userId,
      servingType: "",
      addDiscount: "",
      discountType: "",
      isActive: "Y",
    },
    validationSchema: Yup.object({
      document1: Yup.string().required("Image is required*"),
      canteenMenuItemName: Yup.string().required("Item Name is required*"),
      canteenMenuItemPrice: Yup.string().required("Item Price is required*"),
      categoryId: Yup.string().required("Category is required*"),
      servingType: Yup.string().required("Serving Type is required*"),
    }),
    onSubmit: async (values) => {
      setSubloading(true);
      let formData = new FormData();
      let payload = {
        canteenMenuItemName: values?.canteenMenuItemName,
        canteenMenuItemPrice: values?.canteenMenuItemPrice,
        categoryId: values?.categoryId,
        canteenId: canteenuser?.userId,
        servingType: values?.servingType,
        isActive: values?.isActive,
        addDiscount: values?.addDiscount,
        discountType: values?.discountType,
      };
      let payload2 = {
        canteenMenuId: values?.canteenMenuId,
        canteenMenuItemName: values?.canteenMenuItemName,
        canteenMenuItemPrice: values?.canteenMenuItemPrice,
        categoryId: values?.categoryId,
        canteenId: canteenuser?.userId,
        servingType: values?.servingType,
        addDiscount: values?.addDiscount,
        discountType: values?.discountType,
      };
      formData.append("document1", values.document1);
      formData.append("canteenMenuDto", JSON.stringify(values?.canteenMenuId?payload2:payload));
      const url = values?.canteenMenuId
        ? "canteen/update_item"
        : "canteen/add_single_item";

      try {
        const responseData = await post(url, formData);
        if (responseData.status === 101) {
          toast.error(`${responseData.message}`);
          cleareData();
          setSubloading(false);
        } else {
          toast.success(
            CanteenMenurecord?.canteenMenuId
              ? "update successfully"
              : "add successfully"
          );
          cleareData();
          canteenItem.resetForm();
          categoryItme.resetForm();
          multyipalItme.resetForm();
          setSubloading(false);
          setVisible(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setSubloading(false);
      }
    },
  });

  const multyipalItme = useFormik({
    initialValues: {
      file: "",
    },
    validationSchema: Yup.object({
      file: Yup.string().required("file is required"),
    }),
    onSubmit: async (values) => {
      setSubloading(true);
      let formData = new FormData();
      formData.append("file", values.file);
      try {
        const responseData = await post(
          "canteen/save_multiple_items_canteen_menu",
          formData
        );
        if (responseData.status === 101) {
          toast.error(`${responseData.message}`);
          multyipalItme.resetForm();
          canteenItem.resetForm();
          categoryItme.resetForm();
          multyipalItme.resetForm();
          if (fileInputRef.current) fileInputRef.current.value = "";
          setSubloading(false);
        } else {
          
          setCategoryModel(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
          toast.success("Created successfully");
          setSubloading(false);
        }
      } catch (error) {
        setSubloading(false);
        multyipalItme.resetForm();
        console.error(error);
      }
    },
  });

  const categoryItme = useFormik({
    initialValues: {
      categoryName: "",
      isActive: "Y",
    },
    validationSchema: Yup.object({
      categoryName: Yup.string().required("categoryItme is required"),
    }),
    onSubmit: async (values) => {
      try {
        const responseData = await postJson("category/create_category", values);
        if (responseData.status === 101) {
          toast.error(`${responseData.message}`);
          categoryItme.resetForm();
        } else {
          setCategoryModel(false);
          toast.success("Created successfully");
        }
      } catch (error) {
        categoryItme.resetForm();
        console.error(error);
      }
    },
  });

  const handleEdit = (record, isEdit) => {
    setCanteenMenurecord(record);
    canteenItem.setValues({
      canteenMenuId: record.canteenMenuId,
      document1: record.imagePath,
      canteenMenuItemName: record.canteenMenuItemName,
      canteenMenuItemPrice: record.canteenMenuItemPrice,
      categoryId: record.categoryId,
      canteenId: record.canteenId,
      servingType: record.servingType,
      addDiscount: record.addDiscount,
      discountType: record.discountType,
    });
    setFile(record.imagePath);
    setImage(record.imagePath);
    setImgupload(isEdit);
    setIsEdit(isEdit);
    setVisible(true);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <>
      <Layout className="bg-white p-5">
        <div className="container-fluid p-0 d-flex justify-content-between customers_header">
          <h4>Canteen Menu</h4>
          <div className="d-flex">
            <Button type="primary" onClick={() => setVisible(true)}>
              Add New
            </Button>
            <div className="d-flex"></div>
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
        title="Canteen Manu"
        centered
        visible={visible}
        onOk={() => {
          setVisible(false);
          cleareData();
          canteenItem.resetForm();
          categoryItme.resetForm();
          multyipalItme.resetForm();
        }}
        onCancel={() => {
          setVisible(false);
          cleareData();
          canteenItem.resetForm();
          categoryItme.resetForm();
          multyipalItme.resetForm();
        }}
        width={700}
      >
        <form
          onSubmit={
            selectedTab === "single_item"
              ? canteenItem.handleSubmit
              : multyipalItme.handleSubmit
          }
        >
          <Row className="Row-Height" gutter={[10, 10]}>
          <Col span={24}>
              <div className="container-fluid">
                <div className="row">
                  <div className="canteenmenu-form w-100 register-canteen-box">
                    <h2>
                      {CanteenMenurecord?.canteenMenuId
                        ? CanteenMenurecord?.canteenMenuItemName
                        : "Add New Item"}
                    </h2>
                    <Row>
                      <div className="canteenmenu-form">
                        {CanteenMenurecord?.canteenMenuId ? (
                          ""
                        ) : (
                          <ul
                            className="nav nav-pills mb-3"
                            id="pills-tab"
                            role="tablist"
                          >
                            <li className="nav-item" role="presentation">
                              <button
                                className={`nav-link bold01 ${
                                  selectedTab === "single_item" ? "active" : ""
                                }`}
                                onClick={() => handleTabChange("single_item")}
                                type="button"
                                role="tab"
                                aria-selected={selectedTab === "single_item"}
                              >
                                Single item
                              </button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button
                                className={`nav-link bold01 ${
                                  selectedTab === "multiple_item"
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => handleTabChange("multiple_item")}
                                type="button"
                                role="tab"
                                aria-selected={selectedTab === "multiple_item"}
                              >
                                Multiple item
                              </button>
                            </li>
                          </ul>
                        )}
                        {selectedTab === "single_item" ? (
                          <>
                            
                            <div className="form-md">
                              <Col span={24}>
                                <div className="form-group">
                                  {image === "" ? (
                                    <>
                                      <input
                                        id="form_name5"
                                        className="form-control ps-5 pe-4 w-100"
                                        type="file"
                                        ref={imageInputRef}
                                        placeholder="electricity bill.png"
                                        name="document1"
                                        onChange={onChangeImage}
                                      />
                                       <label htmlFor="form_name6">Image*</label>
                                    </>
                                  ) : (
                                    <div className="imageContainer col-md-3">
                                      <label htmlFor="form_name5" style={{top:"-8px"}}>Image*</label>
                                      <img
                                        src={imgupload && isEdit ? image : file}
                                        width={130}
                                        height={120}
                                        className="img-thumbnail imgDtata"
                                        alt="img"
                                      />
                                      <button
                                        className="btn delete-btn "
                                        onClick={() => {
                                          setImage("");
                                          canteenItem.setFieldValue(
                                            "document1",
                                            ""
                                          );
                                          if (imageInputRef.current) {
                                            imageInputRef.current.value = "";
                                            canteenItem.setFieldValue(
                                              "document1",
                                              ""
                                            );
                                          }
                                        }}
                                      >
                                      
                                        <img
                                          src="assets/images/delete.png"
                                          className="img-fluid "
                                          alt="img"
                                        />
                                      </button>{" "}
                                    </div>
                                  )}
                                 
                                  <button
                                    className="btn delete-btn"
                                    type="button"
                                    onClick={() => {
                                      if (imageInputRef.current) {
                                        imageInputRef.current.value = "";
                                        canteenItem.setFieldValue(
                                          "document1",
                                          ""
                                        );
                                      }
                                    }}
                                  ></button>
                                     {image === "" ? ( <img
                                    src="assets/images/image.png"
                                    className="img-fluid uplod-btn"
                                  />):""}
                                  {canteenItem.touched.document1 &&
                                  canteenItem.errors.document1 ? (
                                    <div className="text-start">
                                      {" "}
                                      <span className="error">
                                        {canteenItem.errors.document1}
                                      </span>
                                    </div>
                                  ) : null}
                                </div>
                              </Col>
                              <Col span={24}>
                                <div className="form-group">
                                  <input
                                    id="form_name5"
                                    className="form-control"
                                    type="text"
                                    onChange={canteenItem.handleChange}
                                    name="canteenMenuItemName"
                                    value={
                                      canteenItem.values.canteenMenuItemName
                                    }
                                  />
                                  <label htmlFor="form_name5">Item Name</label>
                                  {canteenItem.touched.canteenMenuItemName &&
                                  canteenItem.errors.canteenMenuItemName ? (
                                    <div className="text-start">
                                      {" "}
                                      <span className="error">
                                        {canteenItem.errors.canteenMenuItemName}
                                      </span>{" "}
                                    </div>
                                  ) : null}
                                </div>
                              </Col>
                              <Row>
                                <Col span={20}>
                                  <div className="form-group me-2">
                                    <select
                                      className="form-select"
                                      id="floatingSelect"
                                      aria-label="Floating label select example"
                                      value={canteenItem.values.categoryId}
                                      onChange={(e) => {
                                        const categoryId = e.target.value;
                                        
                                        canteenItem.setFieldValue(
                                          "categoryId",
                                          categoryId
                                        );
                                      }}
                                    >
                                      <option value="">-Select-</option>
                                      {category?.map((item, id) => (
                                        <option
                                          key={id}
                                          value={item?.categoryId} // Use categoryId as the value
                                        >
                                          {item?.categoryName}
                                        </option>
                                      ))}
                                    </select>
                                    <label htmlFor="floatingSelect">
                                      Category*
                                    </label>
                                    {canteenItem.touched.categoryId &&
                                    canteenItem.errors.categoryId ? (
                                      <div className="text-start">
                                        {" "}
                                        <span className="error">
                                          {canteenItem.errors.categoryId}
                                        </span>
                                      </div>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col span={4}>
                                  <button
                                    id="btn"
                                    className="btn add-btn "
                                    type="button"
                                    onClick={() => setCategoryModel(true)}
                                  >
                                    <span>ADD</span>
                                    <img
                                      src="assets/images/add.png"
                                      className="img-fluid "
                                      alt="img"
                                    />
                                  </button>
                                </Col>
                              </Row>
                              <Col span={24}>
                                {/* <div className="form-group">
                                  <input
                                    id="form_name5"
                                    className="form-control"
                                    type="text"
                                    onChange={canteenItem.handleChange}
                                    name="servingType"
                                    value={canteenItem.values.servingType}
                                  />
                                  <label htmlFor="form_name5">Server type</label>
                                </div> */}
                                 <div className="form-group me-2">
                                    <select
                                      className="form-select"
                                      id="floatingSelect"
                                      aria-label="Floating label select example"
                                      value={canteenItem.values.servingType}
                                      onChange={(e) => {
                                        const servingType = e.target.value;
                                        
                                        canteenItem.setFieldValue(
                                          "servingType",
                                          servingType
                                        );
                                      }}
                                    >
                                      <option value="">-Select-</option>
                                      {servingtype?.map((item, id) => (
                                        <option
                                          key={id}
                                          value={item?.servingTypeName} 
                                        >
                                          {item?.servingTypeName}
                                        </option>
                                      ))}
                                    </select>
                                    <label htmlFor="floatingSelect">
                                    Server type*
                                    </label>
                                    {canteenItem.touched.servingType &&
                                    canteenItem.errors.servingType ? (
                                      <div className="text-start">
                                        {" "}
                                        <span className="error">
                                          {canteenItem.errors.servingType}
                                        </span>
                                      </div>
                                    ) : null}
                                  </div>
                              </Col>
                              <Col span={24}>
                                <div className="form-group">
                                  <input
                                    id="form_name4"
                                    className="form-control"
                                    type="text"
                                    onChange={canteenItem.handleChange}
                                    name="canteenMenuItemPrice"
                                    value={
                                      canteenItem.values.canteenMenuItemPrice
                                    }
                                  />
                                  <label htmlFor="form_name4">Price*</label>

                                  {canteenItem.touched.canteenMenuItemPrice &&
                                  canteenItem.errors.canteenMenuItemPrice ? (
                                    <div className="text-start">
                                      {" "}
                                      <span className="error teat-start">
                                        {
                                          canteenItem.errors
                                            .canteenMenuItemPrice
                                        }
                                      </span>
                                    </div>
                                  ) : null}
                                </div>
                              </Col>
                              <div className="d-flex">
                                <Col span={16}>
                                  <div className="form-group me-2">
                                    <Input
                                      id="form_name7"
                                      className="form-control"
                                      type="text"
                                      onChange={canteenItem.handleChange}
                                      name="addDiscount"
                                      value={canteenItem.values.addDiscount}
                                    />
                                    <label htmlFor="form_name7">Discount </label>
                                  </div>
                                </Col>
                                <Col span={8}>
                                  <div className="form-group me-2">
                                    <select
                                      className="form-select "
                                      id="floatingSelect"
                                      aria-label="Type"
                                      onChange={(e) => {
                                        const discountType = e.target.value;
                                       
                                        canteenItem.setFieldValue(
                                          "discountType",
                                          discountType
                                        );
                                      }}
                                      value={canteenItem.values.discountType}
                                    >
                                      <option  value="" disabled="true" >selecte</option>
                                      <option value="percentage">
                                        Percentage%
                                      </option>
                                      <option value="rupees">Rupees</option>
                                    </select>
                                    <label htmlFor="floatingSelect">Type</label>
                                  </div>
                                </Col>
                              </div>
                            </div>
                          </>
                        ) : (
                          <Col span={24}>
                            <div className="form-group">
                              <input
                                id="form_name6"
                                className="form-control ps-5 pe-4"
                                type="file"
                                ref={fileInputRef}
                                name="fileurl"
                                onChange={onFileChange}
                              />
                              <label htmlFor="form_name6">Uplode Sheet</label>
                              <button
                                className="btn"
                                onClick={() => {
                                  multyipalItme.setFieldValue("file", "");
                                  if (fileInputRef.current)
                                    fileInputRef.current.value = "";
                                }}
                              >
                                <img
                                  src="assets/images/delete.png"
                                  className="img-fluid delete-btn"
                                  alt="img"
                                />
                              </button>
                              <img
                                src="assets/images/image.png"
                                className="img-fluid uplod-btn"
                                alt="img"
                              />
                              {multyipalItme.touched.file &&
                              multyipalItme.errors.file ? (
                                <span className="error">
                                  {multyipalItme.errors.file}
                                </span>
                              ) : null}
                            </div>
                          </Col>
                        )}
                      </div>
                    </Row>
                  </div>
                </div>
              </div>

              <Col span={24} className="mt-4 p-0">
                <Button type="primary" htmlType="submit" className="mx-2">
                  {subloading ? (
                    <Spinner animation="border" size="sm" />
                  ) : CanteenMenurecord?.canteenMenuId ? (
                    "Update"
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button type="primary" onClick={() => setVisible(false)}>
                  Cancel
                </Button>
              </Col>
            </Col>
          </Row>
        </form>
      </Modal>

      <Modal
        footer={false}
        title="canteen item list"
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
                  <p>canteenmenu Id :</p>
                </Col>
                <Col span={16}>
                  <p>{view?.canteenMenuId}</p>
                </Col>
              </div>
              <div className="d-flex">
                <Col span={7}>
                  <p>Image:</p>
                </Col>
                <Col span={16}>
                  
                  <img  src={view?.imagePath}   width={130}   height={120}  className="img-thumbnail "  alt="img"/>
                </Col>
              </div>
              <div className="d-flex">
                <Col span={7}>
                  <p>Menu Name:</p>
                </Col>
                <Col span={16}>
                  <p>{view.canteenMenuItemName}</p>
                </Col>
              </div>
              <div className="d-flex">
                <Col span={7}>
                  <p>Price :</p>
                </Col>
                <Col span={16}>
                  <p>{view?.canteenMenuItemPrice}</p>
                </Col>
              </div>
              <Col span={24} className="mt-4 p-0">
                <Button
                  type="primary"
                  onClick={() => {
                    canteenItem.resetForm();
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

      <Modal
        footer={false}
        title="category"
        centered
        visible={categoryModel}
        onOk={() => {
          setCategoryModel(false);
        }}
        onCancel={() => {
          setCategoryModel(false);
        }}
        width={500}
      >
        <form className="mt-4" onSubmit={categoryItme.handleSubmit}>
          <Row className="Row-Height" gutter={[10, 10]}>
            <Col span={24}>
              <Col span={24} className=" register-canteen-box">
                <div className="form-group">
                  <input
                    id="form_name5"
                    className="form-control"
                    type="text"
                    onChange={categoryItme.handleChange}
                    name="categoryName"
                    value={categoryItme.values.categoryName}
                  />
                  <label htmlFor="form_name5">Add Categories</label>
                  {categoryItme.touched.categoryName &&
                  categoryItme.errors.categoryName ? (
                    <span className="error">
                      {categoryItme.errors.categoryName}
                    </span>
                  ) : null}
                </div>
              </Col>
              <Col span={24} className="mt-4 p-0">
                <Button type="primary" htmlType="submit" className="mx-2">
                  Submit
                </Button>
                <Button type="primary" onClick={() => setCategoryModel(false)}>
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

export default Canteenitem;
