import React, { useEffect } from "react";
import { Button, Input, Modal, Row, Col, Select, Progress } from "antd";
import { Spinner } from "react-bootstrap";
import { useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { postJson } from "../../../../Common/api-instance";
import toast from "react-hot-toast";
import axios from "axios";
import AppStore from "../../../../redux/store";
const NotifcationModel = (props) => {
  const [progress, setProgress] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [videoLoader, setVideoLoader] = useState(false);
  const videoInputRef = useRef(null);
  let [video, setVideo] = useState("");
  const imageInputRef = useRef(null);
  let [img, setimg] = useState("");
  const [progress1, setProgress1] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [isEdit, setisEdited] = useState(false);

  const { Option } = Select;
  useEffect(() => {
    if (props.data?.notificationtempleteid) {
      // Set initial form values based on props
      notfactionFrom.setValues({
        notificationtempleteid: props?.data?.notificationtempleteid,
        type: props?.data?.type.split(), // Convert string to array
        title: props?.data?.title,
        subtitle: props?.data?.subtitle,
        imageurl: props?.data?.imageurl,
        videourl: props?.data?.videourl,
        description: props?.data?.description,
        parameter: props?.data?.parameter,
        isactive: props?.data?.isActive === "In-Active"?"N":"Y",
      });
      setimg(props?.data?.imageurl);
      setVideo(props?.data?.videourl);
    }
  }, [props.data?.notificationtempleteid]);
  let handleChangeimg = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error("No file selected");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes?.includes(file.type)) {
      toast.error("Unsupported file type");
      notfactionFrom.setFieldValue("imageurl", "");
      setimg("");
      if (imageInputRef.current) imageInputRef.current.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}common/images/add_image_video`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${AppStore?.store?.getState()?.token}`,
          },
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percentCompleted = Math.round((loaded * 100) / total);
            setProgress1(percentCompleted);
          },
        }
      );

      const imageUrl = response.data.data;
      notfactionFrom.setFieldValue("imageurl", imageUrl);
      setimg(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  let handleChangeVideo = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      console.error("No file selected");
      return;
    }

    const allowedTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
    if (!allowedTypes?.includes(file.type)) {
      setVideo("");
      notfactionFrom.setFieldValue("videourl", "");
      if (videoInputRef.current) videoInputRef.current.value = "";
      console.error("Unsupported file type");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}common/images/add_image_video`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${AppStore?.store?.getState()?.token}`,
          },
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percentCompleted = Math.round((loaded * 100) / total);
            setProgress(percentCompleted);
          },
        }
      );

      const videoUrl = response.data.data;
      notfactionFrom.setFieldValue("videourl", videoUrl);
      setVideo(videoUrl);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  const onChange = (value) =>{
    notfactionFrom.setFieldValue("isactive",value)
  }
  const notfactionFrom = useFormik({
    initialValues: {
      notificationtempleteid: props?.data?.notificationtempleteid
        ? props?.data?.notificationtempleteid
        : "",
      type: [],
      title: "",
      subtitle: "",
      imageurl: "",
      videourl: "",
      description: "",
      parameter: "",
      isactive: "" 
    },
    validationSchema: Yup.object({
      notificationtempleteid: Yup.string().required(
        "noatification type required"
      ),
      type: Yup.array().min(1, "At least one type must be selected"),
      title: Yup.string().required("Title is required"),
      subtitle: Yup.string().required("Subtitle is required"),
      imageurl: Yup.string().required("Imageurl is required"),
      videourl: Yup.string().required("videourl is required"),
      description: Yup.string().required("Description is required"),
      parameter: Yup.string().required("Parameter is required"),
      isactive: Yup.string().required("Status is required")
    }),
    onSubmit: async (values) => {
      const typeString = values.type.join(", ");
      const newValues = { ...values, type: typeString };
      // setSubmitLoader(true)
      try {
        const responseData = await postJson(
          "common/notification/save_notificationtemplete",
          newValues
        );
        if (responseData.status == 101) {
          toast.error(`${responseData.massage}`);
          props.onCancel();
          notfactionFrom.resetForm();
        } else {
          toast.success(
            `${isEdit ? "Update Successfully" : "Add Successfully"}`
          );
          props.onCancel();
          notfactionFrom.resetForm();
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <>
      <Modal
        footer={false}
        title="Notification Page"
        centered
        visible={props?.visible}
        onOk={() => {
          props.onClose();
        }}
        onCancel={() => {
          props.onClose();
        }}
        width={700}
      >
        <form onSubmit={notfactionFrom.handleSubmit}>
          <Row className="Row-Height" gutter={[10, 10]}>
            <Col span={24}>
              <label className="inputLabel"> Templete Name*</label>
              <br />
              <Input
                name="notificationtempleteid"
                id="notificationtempleteid"
                disabled={props.data?.notificationtempleteid ? true : false}
                onChange={notfactionFrom.handleChange}
                value={notfactionFrom.values.notificationtempleteid}
              />
              {notfactionFrom.errors.notificationtempleteid &&
                notfactionFrom.touched.notificationtempleteid && (
                  <span className="error">
                    {notfactionFrom.errors.notificationtempleteid}
                  </span>
                )}
            </Col>

            <Col span={24}>
              <label className="inputLabel">Type *</label> <br />
              <div className="d-flex">
                <div className="">
                  <label>
                    <input
                      type="checkbox"
                      name="type"
                      value="USER"
                      checked={notfactionFrom.values.type?.includes("USER")}
                      className="me-1"
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        notfactionFrom.setFieldValue(
                          "type",
                          isChecked
                            ? [...notfactionFrom.values.type, "USER"]
                            : notfactionFrom.values.type.filter(
                                (t) => t !== "USER"
                              )
                        );
                      }}
                    />
                    USER
                  </label>
                </div>
                <div className="mx-4">
                  <label>
                    <input
                      type="checkbox"
                      name="type"
                      value="CANTEEN"
                      checked={notfactionFrom?.values?.type?.includes(
                        "CANTEEN"
                      )}
                      className="me-1"
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        notfactionFrom.setFieldValue(
                          "type",
                          isChecked
                            ? [...notfactionFrom.values.type, "CANTEEN"]
                            : notfactionFrom.values.type.filter(
                                (t) => t !== "Canteen User"
                              )
                        );
                      }}
                    />
                    Canteen User
                  </label>
                </div>
                {/* <div>
                        <label>
                            <input
                                type="checkbox"
                                name="type"
                                value="Other"
                                checked={notfactionFrom.values.type.includes('Other')}
                                className="me-2"
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    notfactionFrom.setFieldValue(
                                        'type',
                                        isChecked
                                            ? [...notfactionFrom.values.type, 'Other']
                                            : notfactionFrom.values.type.filter((t) => t !== 'Other')
                                    );
                                }}
                            />
                            Other
                        </label>
                    </div> */}
              </div>
              {notfactionFrom.errors.type && notfactionFrom.touched.type && (
                <div className="error">{notfactionFrom.errors.type}</div>
              )}
            </Col>
            <Col span={24}>
              <label className="inputLabel">Title *</label>

              <Input
                name="title"
                id="title"
                onChange={notfactionFrom.handleChange}
                value={notfactionFrom.values.title}
              />
              {notfactionFrom.errors.title && notfactionFrom.touched.title && (
                <span className="error">{notfactionFrom.errors.title}</span>
              )}
            </Col>
            <Col span={24}>
              <label className="inputLabel">Sub Title *</label>
              <Input
                name="subtitle"
                id="subtitle"
                onChange={notfactionFrom.handleChange}
                value={notfactionFrom.values.subtitle}
              />
              {notfactionFrom.errors.subtitle &&
                notfactionFrom.touched.subtitle && (
                  <span className="error">
                    {notfactionFrom.errors.subtitle}
                  </span>
                )}
            </Col>
            <Col span={24}>
              <label className="inputLabel">Description *</label>
              <Input
                name="description"
                id="description"
                onChange={notfactionFrom.handleChange}
                value={notfactionFrom.values.description}
              />
              {notfactionFrom.errors.description &&
                notfactionFrom.touched.description && (
                  <span className="error">
                    {notfactionFrom.errors.description}
                  </span>
                )}
            </Col>
            <Col span={24}>
              <label className="inputLabel">Icon Image(optional)</label>
              {img === "" ? (
                <div style={{ position: "relative" }}>
                  {imageLoading && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "rgba(255, 255, 255, 0.8)",
                        zIndex: 1,
                      }}
                    >
                      <Spinner animation="border" size="sm" />
                    </div>
                  )}

                  <input
                    className="form-control"
                    ref={imageInputRef}
                    name="imageurl "
                    accept="image/*"
                    id="imageurl"
                    type="file"
                    onChange={handleChangeimg}
                  />
                  {notfactionFrom.errors.imageurl &&
                    notfactionFrom.touched.imageurl && (
                      <span className="error">
                        {notfactionFrom.errors.imageurl}
                      </span>
                    )}
                </div>
              ) : (
                <div className="imageContainer">
                  <img
                    src={img}
                    width={130}
                    alt=""
                    height={120}
                    className="img-thumbnail"
                  />
                  <button
                    onClick={() => {
                      notfactionFrom.setFieldValue("imageurl", "");
                      setimg("");
                      if (imageInputRef.current)
                        imageInputRef.current.value = "";
                    }}
                  >
                    X
                  </button>
                </div>
              )}
              {!img ? (
                progress1 == progress1 ? (
                  <Progress percent={progress1} size="small" />
                ) : (
                  ""
                )
              ) : (
                ""
              )}
            </Col>

            <Col span={24}>
              <label className="inputLabel">Video(optional)</label>
              {video === "" ? (
                <div style={{ position: "relative" }}>
                  {videoLoader && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "rgba(255, 255, 255, 0.8)",
                        zIndex: 1,
                      }}
                    >
                      <Spinner animation="border" size="sm" />
                    </div>
                  )}
                  <input
                    className="form-control"
                    ref={videoInputRef}
                    onChange={handleChangeVideo}
                    name="videourl "
                    id="videourl "
                    accept="video/*"
                    type="file"
                    //   onChange={saveVideoFile}
                  />
                  {notfactionFrom.errors.videourl &&
                    notfactionFrom.touched.videourl && (
                      <span className="error">
                        {notfactionFrom.errors.videourl}
                      </span>
                    )}
                </div>
              ) : (
                <div className="imageContainer">
                  <video
                    src={video}
                    controls
                    width={200}
                    height={120}
                    className="img-thumbnail"
                  ></video>

                  <button
                    onClick={() => {
                      setVideo("");
                      notfactionFrom.setFieldValue("videourl", "");
                      if (videoInputRef.current)
                        videoInputRef.current.value = "";
                    }}
                  >
                    X
                  </button>
                </div>
              )}
              {!video ? (
                progress == progress ? (
                  <Progress percent={progress} size="small" />
                ) : (
                  ""
                )
              ) : (
                ""
              )}
            </Col>
            <Col span={24}>
              <label className="inputLabel">Parameter Being Use *</label>
              <Input
                name="parameter"
                id="parameter"
                onChange={notfactionFrom.handleChange}
                value={notfactionFrom.values.parameter}
              />
              {notfactionFrom.errors.parameter &&
                notfactionFrom.touched.parameter && (
                  <span className="error">
                    {notfactionFrom.errors.parameter}
                  </span>
                )}
            </Col>
            <Col span={24}>
              <label className="inputLabel">Status *</label> <br />
              <Select
                value={notfactionFrom.values.isactive}
                className="w-100"
                showSearch
                optionFilterProp="children"
                onChange={onChange}
              >
                <Option value="Y">Active</Option>
                <Option value="N">In-Active</Option>
              </Select>
              {notfactionFrom.errors.isactive && notfactionFrom.touched.isactive && (
    <span className="error">
      {notfactionFrom.errors.isactive}
    </span>
  )}
            </Col>
            <Col span={24} className="mt-4 p-0">
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
                  props.onClose();
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

export default NotifcationModel;
