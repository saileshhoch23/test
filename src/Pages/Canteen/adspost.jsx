import { Col, Input, Layout, Modal, Row } from "antd";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import swal from "sweetalert";
import { post } from "../../Common/api-instance";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import "./canteen.css";
import { Spinner } from "react-bootstrap";
const Adspost = () => {
  const canteenuser = useSelector((state) => state.user);
  const [tempalet, setTempalet] = useState([]);
  const [category, setCategory] = useState([]);
  const [isOpencheck, setIsOpencheck] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [visible, setVisible] = useState(false);
  const [editedImage, setEditedImage] = useState(null);
  const [editedImages, setEditedImages] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getData();
    getDatactogory();
    // getDataadspost();
  }, []);

  const getData = async () => {
    try {
      let res = await post("common/images/get_all_images");
      setTempalet(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getDatactogory = async () => {
    try {
      let res = await post("category/get_all_category");
      setCategory(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const elementToImageWithText = (imageUrl, text, callback) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const fontSize = 15;
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = "black";
      ctx.textBaseline = "top";
      const maxWidth = canvas.width - 120;
      const lineHeight = fontSize + 5;
      let y = 40;
      let textChunk = "";

      for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i);
        const textWidth = ctx.measureText(textChunk + char).width;

        if (textWidth < maxWidth || char === " " || char === "\n") {
          textChunk += char;
        } else {
          ctx.fillText(textChunk, 60, y);
          y += lineHeight;
          textChunk = char === " " ? "" : char;
        }
      }

      ctx.fillText(textChunk, 60, y);

      const imageData = canvas.toDataURL("image/png");
      if (typeof callback === "function") {
        callback(imageData);
      }
    };

    img.src = imageUrl;
  };

  const contectUsForm = useFormik({
    initialValues: {
      templateId: "",
      categoryIds: "",
      adTitle: "",
      adSubject: "",
      addDiscount: "",
      canteenId: canteenuser?.userId,
      discountType: "",
    },
    validationSchema: Yup.object({
      templateId: Yup.string().required("Template is Required"),
      categoryIds: Yup.string().required("Category is Required"),
      adTitle: Yup.string().required("Ads Title is Required"),
      adSubject: Yup.string().required("Ads Subject is Required"),
      addDiscount: Yup.string().required("Discount is Required"),
      discountType: Yup.string().required("Discount type is Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true)
        elementToImageWithText(
          selectedOption?.imageurl,
          values?.adSubject,
          (imageData) => {
            setEditedImage(imageData);
          }
        );
      
      let formData = new FormData();

      const paylode = {
        templateId: values.templateId,
        categoryIds: values.categoryIds,
        adTitle: values.adTitle,
        adSubject: values.adSubject,
        addDiscount: values.addDiscount,
        discountType: values.discountType,
        mobileNumber: "",
        name: "",
        companyName: "",
        canteenId: canteenuser?.userId,
      };
      if (editedImage) {
        const filename = "edited_image.png";
        const mimeType = "image/png";
        const fileConvert = dataURLtoFile(editedImage,  filename, mimeType)

        formData.append("postAdsDto", JSON.stringify(paylode));
        formData.append(
          "document",
          fileConvert
        );
      }

      try {
        if (editedImage) {
          const responseData = await post("post_add/save_post_add", formData);
          if (responseData.status === 101) {
            toast.error(`${responseData.message}`);
          } else {
            setSelectedOptions([]);
            setSelectedOption(null);
            contectUsForm.resetForm();
            swal(
              "Thank You",
              "Ad details has been submitted. Our team contact you soon.",
              "success"
            );
            setLoading(false)
            toast.success("send successfully");
          }
        }
      } catch (error) {
        console.error(error);
        setLoading(false)
      } finally {
        setLoading(false)
      }
    },
  });


  function dataURLtoFile(dataUrl, filename, mimeType) {
    const byteString = atob(dataUrl.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeType });
    const file = new File([blob], filename, {
        type: mimeType,
        lastModified: new Date().getTime(),
        lastModifiedDate: new Date(),
    });

    return file;
}


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    contectUsForm.setFieldValue("templateId", option?.id);
  };

  const toggleDropdowncheck = () => {
    setIsOpencheck(!isOpencheck);
    contectUsForm.setFieldValue("categoryIds", selectedOptions.join(","));
  };

  const handleOptionClickcheck = (option) => {
    const isSelected = selectedOptions.includes(option.categoryId);
    if (isSelected) {
      setSelectedOptions(
        selectedOptions.filter((item) => item !== option.categoryId)
      );
    } else {
      setSelectedOptions([...selectedOptions, option.categoryId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedOptions.length === category.length) {
      setSelectedOptions([]);
    } else {
      const allOptions = category.map((option) => option.categoryId);
      setSelectedOptions(allOptions);
    }
  };

  const handelcheckNewImg = () => {
    setVisible(true);
    let data = contectUsForm?.values?.adSubject;

    if (selectedOption?.imageurl && data) {
      elementToImageWithText(selectedOption?.imageurl, data, (imageData) => {
        setEditedImages(imageData);
      });
    }
  };

  return (
    <>
      <Layout className="bg-white p-5">
        <div className="container-fluid p-0   customers_header">
          <h3>Post Your ads</h3>
          <form onSubmit={contectUsForm.handleSubmit} className="contect-form">
            <Row className="Row-Height" gutter={[10, 10]}>
              <Col span={24}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="canteenmenu-form w-100 register-canteen-box">
                      <Col span={24}>
                        <div className="custom-dropdown w-100 mb-3">
                          <label className="tamp-label">template Type</label>
                          <div
                            className="selected-option form-select "
                            style={{
                              height: `${selectedOption ? "auto" : "50px"}`,
                            }}
                            onClick={toggleDropdown}
                          >
                            {selectedOption ? (
                              <>
                              <img
                                src={selectedOption.imageurl}
                                className="option-img"
                                alt={selectedOption.template}
                              />
                              <span className="ms-3">{selectedOption?.template} </span>
                              </>
                            ) : (
                              "Select an option"
                            )}
                          </div>
                          {isOpen && (
                            <ul className="dropdown-menu show">
                              {tempalet.length > 0 &&
                                tempalet?.map((option) => (
                                  <li
                                    key={option.id}
                                    onClick={() => handleOptionClick(option)}
                                  >
                                    <img
                                      src={option?.imageurl}
                                      alt={option?.template}
                                      className={`${
                                        selectedOption === option
                                          ? "selected"
                                          : ""
                                      } option-img`}
                                    />
                                    <span className="ms-3">{option?.template} </span>
                                  </li>
                                ))}
                            </ul>
                          )}
                          {contectUsForm.touched.templateId &&
                          contectUsForm.errors.templateId ? (
                            <div className="text-start">
                              <span className="error">
                                {contectUsForm.errors.templateId}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col span={24}>
                        <div className="custom-dropdown w-100 mb-3 check-box">
                          <label className="tamp-label">
                            Offer On Category
                          </label>
                          <div
                            className="selected-option form-select"
                            onClick={toggleDropdowncheck}
                          >
                            {selectedOptions.length > 0 ? (
                              <span className="selected-item">{`Selected Categories (${selectedOptions.length})`}</span>
                            ) : (
                              "Select an option"
                            )}
                          </div>
                          {isOpencheck && (
                            <ul className="dropdown-menu show">
                              <li key="select-all" onClick={handleSelectAll}>
                                <div className="form-group">
                                  <input
                                    type="checkbox"
                                    id="select-all"
                                    checked={
                                      selectedOptions.length === category.length
                                    }
                                    onChange={handleSelectAll}
                                  />
                                  <label htmlFor="select-all">Select All</label>
                                </div>
                              </li>
                              {category.length > 0 &&
                                category?.map((option) => (
                                  <li
                                    key={option.categoryId}
                                    onClick={() =>
                                      handleOptionClickcheck(option)
                                    }
                                  >
                                    <div className="form-group mb-0">
                                      <input
                                        type="checkbox"
                                        id={option.categoryId}
                                        checked={selectedOptions.includes(
                                          option.categoryId
                                        )}
                                        onChange={() =>
                                          handleOptionClickcheck(option)
                                        }
                                      />
                                      <label htmlFor={option.categoryId}>
                                        {option.categoryName}
                                      </label>
                                    </div>
                                  </li>
                                ))}
                            </ul>
                          )}
                          {contectUsForm.touched.categoryIds &&
                          contectUsForm.errors.categoryIds ? (
                            <div className="text-start">
                              <span className="error">
                                {contectUsForm.errors.categoryIds}
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
                            onChange={contectUsForm.handleChange}
                            name="adTitle"
                            value={contectUsForm.values.adTitle}
                          />
                          <label htmlFor="form_name5">Ads Title</label>
                          {contectUsForm.touched.adTitle &&
                          contectUsForm.errors.adTitle ? (
                            <div className="text-start">
                              <span className="error">
                                {contectUsForm.errors.adTitle}
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
                            onChange={contectUsForm.handleChange}
                            name="adSubject"
                            value={contectUsForm.values.adSubject}
                          />
                          <label htmlFor="form_name5">Ads Subject</label>
                          {contectUsForm.touched.adSubject &&
                          contectUsForm.errors.adSubject ? (
                            <div className="text-start">
                              <span className="error">
                                {contectUsForm.errors.adSubject}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <div className="d-flex">
                        <Col span={12}>
                          <div className="form-group me-2">
                            <Input
                              id="form_name7"
                              className="form-control "
                              type="text"
                              onChange={contectUsForm.handleChange}
                              name="addDiscount"
                              value={contectUsForm.values.addDiscount}
                            />
                            <label htmlFor="form_name7">Discount </label>
                            {contectUsForm.touched.addDiscount &&
                            contectUsForm.errors.addDiscount ? (
                              <div className="text-start">
                                <span className="error">
                                  {contectUsForm.errors.addDiscount}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="form-group me-2">
                            <select
                              className="form-select "
                              id="floatingSelect"
                              aria-label="Type"
                              onChange={(e) => {
                                const discountType = e.target.value;

                                contectUsForm.setFieldValue(
                                  "discountType",
                                  discountType
                                );
                              }}
                              value={contectUsForm.values.discountType}
                            >
                              <option value="" disabled={true}>
                                selecte
                              </option>
                              <option value="percentage">Percentage%</option>
                              <option value="rupees">Rupees</option>
                            </select>
                            <label htmlFor="floatingSelect">Type</label>
                          </div>
                        </Col>
                      </div>
                      <div>
                  
                        <button
                          type="button"
                          className="btn btn-outline-secondary me-3"
                          disabled={
                            contectUsForm?.values?.adSubject &&
                            selectedOption?.imageurl
                              ? false
                              : true
                          }
                          onClick={() => handelcheckNewImg()}
                        >
                          {" "}
                          preview
                        </button>
                        <button
                          type="submit"
                          className="btn btn-secondary bg-gray"
                        >
                        {loading ?  (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Submit"
                    )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </form>
        </div>
      </Layout>
      <div className="modal-bg">
        <Modal
          footer={false}
          title=""
          centered
          visible={visible}
          onOk={() => {
            setVisible(false);
          }}
          onCancel={() => {
            setVisible(false);
          }}
          width={400}
     
        >
          <img src={editedImages} style={{ width: "100%" }} alt="img"/>
        </Modal>
      </div>
    </>
  );
};

export default Adspost;
