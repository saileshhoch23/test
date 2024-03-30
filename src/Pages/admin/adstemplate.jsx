import { Button, Input, Layout, Table, Modal, Col, Row, Select } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { post, postJson } from "../../Common/api-instance";
import { useFormik } from "formik";
import * as Yup from "yup";
import { imageFormat, imageMessage } from "../../Common/img-validation";
import toast from "react-hot-toast";
import { Spinner } from "react-bootstrap";
const Adstemplate = () => {
  const [loading, setLoading] = useState("");
  const [page, Setpage] = useState(0);
  const [pagesize, Setpagesize] = useState(10);
  const [totaldata, setTotaldata] = useState();
  const [data, setData] = useState([]);
  const [image, setImage] = useState("");
  const [visible, setVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [imgupload, setImgupload] = useState();
  const [submitloader, setSubmitLoader] = useState(false);
  const [visibleview, setVisibleview] = useState(false);
  const [view, setView] = useState({});
  const imageInputRef = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditeId] = useState("")
  useEffect(() => {
    getData();
  }, [page, pagesize, searchValue]);
  const cleareData = () =>{
    temapleForm.resetForm();
    setFile(null);
    setImgupload();
    setImage("")
    if(imageInputRef?.current){
      imageInputRef.current.value = "";
    }
  }
  const columns = [
    {
      title: "Id",
      dataIndex: "image_id",
    },
    {
      title: "Template name",
      dataIndex: "template",
    },
    {
      title: "Image URL",
      dataIndex: "image_url",
      render: (image_url) => (
        <img width="50px" alt={image_url} src={image_url} />
      ),
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
    key: item.image_id,
    image_id: item.image_id,
    template: item.template,
    image_url: item.image_url,
  }));
  const handleView = (record) => {
    setView(record);
    setVisibleview(true);
  };
  const handleEdit = (record) => {
    temapleForm.setFieldValue("template", record?.template)
    temapleForm.setFieldValue("imageurl", record?.image_url)
    fetchImageAndConvertToFile(record?.image_url)
    .then(file => {
        if (file) {
          temapleForm.setFieldValue("document", file)
        } else {
            console.error('Failed to fetch image or convert it to File object.');
        }
    })
    
    setEditeId(record?.image_id)
    setFile(record.image_url);
    setImage(record.image_url);
    setImgupload(true);
    setIsEdit(true);
    setVisible(true);
    setVisible(true);
  };
  const getData = async () => {
    try {
      const payload = {
        id: "",
        template: searchValue,
        pageable: {
          pageno: page,
          pagesize: pagesize,
        },
      };
      setLoading(true);
      const responseData = await postJson(
        "common/images/get_all_images_pages",
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
        temapleForm.setFieldValue("document", selectedFile);
      };
    };
    reader.readAsDataURL(selectedFile);
  };

  async function fetchImageAndConvertToFile(imageUrl) {
    try {

        const response = await fetch(imageUrl);
        const imageData = await response.blob();
        const fileName = "images.jpg";
        const fileType = imageUrl.substring(imageUrl.lastIndexOf('.') + 1);
        const file = new File([imageData], fileName, {
            type: `image/${fileType}`,
            lastModified: new Date().getTime(),
            lastModifiedDate: new Date(),
        });

        return file;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}
  const temapleForm = useFormik({
    initialValues: {
      id: "",
      imageurl: "",
      template: "",
      document: "",
    },
    validationSchema: Yup.object({
      template: Yup.string().required("template name is required"),
      document: Yup.string().required("Img is required"),
    }),
    onSubmit: async (values) => {
        setSubmitLoader(true)
        let formData = new FormData();
        const payload = {
            id: editId ? editId : "",
            imageurl: values?.imageurl,
            template:values?.template,
        }
        formData.append("document", values.document);
        formData.append("imageDto", JSON.stringify(payload));
        try {
            const responseData = await post("common/images/add_image", formData);
            if (responseData.status === 101) {
              toast.error(`${responseData.message}`); 
            } else {
              toast.success(editId ? "update successfully": "add successfully");
              temapleForm.resetForm();
              setVisible(false);
              setSubmitLoader(false)
              getData()
              cleareData()
            }
          } catch (error) {
            console.error(error);
            setSubmitLoader(false)
          } finally {
            setSubmitLoader(false)
          }
    },
  });

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
        title="Template img"
        centered
        visible={visible}
        onOk={() => {
          setVisible(false);
          cleareData()
        }}
        onCancel={() => {
          setVisible(false);
          cleareData()
        }}
        width={500}
      >
        <form onSubmit={temapleForm.handleSubmit}>
          <Row className="Row-Height" gutter={[10, 10]}>
            <Col span={24}>
              {/* <Row gutter={[10, 10]}> */}

              <Col span={24}>
                <label className="inputLabel">Template Name*</label>
                <Input
                  name="template"
                  type="text"
                  value={temapleForm.values.template}
                  onChange={temapleForm.handleChange}
                />
                {temapleForm.touched.template && temapleForm.errors.template ? (
                  <span className="error">
                    {temapleForm.errors.template}
                  </span>
                ) : null}
              </Col>
              <Col span={24} className="mt-3" >
                <div className="form-group">
                  {image === "" ? (
                    <>
                      <label htmlFor="form_name6">Image*</label>
                      <input
                        id="form_name5"
                        className="form-control ps-5 pe-4 w-100"
                        type="file"
                        ref={imageInputRef}
                        placeholder="electricity bill.png"
                        name="document1"
                        onChange={onChangeImage}
                      />
                    
                    </>
                  ) : (
                    <div className="imageContainer col-md-3">
                      <label htmlFor="form_name5" style={{ top: "-8px" }}>
                        Image*
                      </label>
                      <img
                        src={imgupload && isEdit ? image : file}
                        width={130}
                        height={120}
                        alt="img"
                        className="img-thumbnail imgDtata"
                      />
                      <button
                        className="btn delete-btn "
                        style={{position:"absolute", top:"18px" , backgroundColor:"transparent", right:"-5px"}}
                        onClick={() => {
                          setImage("");
                          temapleForm.setFieldValue("document1", "");
                          if (imageInputRef.current) {
                            imageInputRef.current.value = "";
                            temapleForm.setFieldValue("document1", "");
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
                        temapleForm.setFieldValue("document", "");
                      }
                    }}
                  ></button>
                  {image === "" ? (
                    <img
                      src="assets/images/image.png"
                      className="img-fluid uplod-btn"
                      style={{top:"33px"}}
                      alt="img"
                    />
                  ) : (
                    ""
                  )}
                  {temapleForm.touched.document &&
                  temapleForm.errors.document ? (
                    <div className="text-start">
                      {" "}
                      <span className="error">
                        {temapleForm.errors.document}
                      </span>
                    </div>
                  ) : null}
                </div>
              </Col>
          
              <Col span={24} className="mt-4 p-0">
                <Button type="primary" htmlType="submit" className="mx-2">
                  {submitloader ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setVisible(false);
                    cleareData()
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
      title="template img"
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
                <p> Id :</p>
              </Col>
              <Col span={16}>
                <p>{view.image_id}</p>
              </Col>
            </div>
            <div className="d-flex">
              <Col span={8}>
                <p>Template Name :</p>
              </Col>
              <Col span={15}>
                <p>{view.template}</p>
              </Col>
            </div>
            <div className="d-flex">
              <Col span={8}>
                <p>Image :</p>
              </Col>
              <Col span={15}>
                <img src={view?.image_url} alt="img"  className="img-fluid" width={100} />
              </Col>
            </div>
            <Col span={24} className="mt-4 p-0">
              <Button
                type="primary"
                onClick={() => {
                  temapleForm.resetForm();
                  setEditeId();
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

export default Adstemplate;
