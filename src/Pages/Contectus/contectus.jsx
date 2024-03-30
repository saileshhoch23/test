import { Col, Layout, Row } from "antd";
import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import "./contect.css";
import PhoneInput from "react-phone-input-2";
import swal from "sweetalert";
import { postJson } from "../../Common/api-instance";
import toast from "react-hot-toast";

const Contectus = () => {
  const [dialCode, setDialCode] = useState();
  const contectUsForm = useFormik({
    initialValues: {
      name: "",
      mobileNumber: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is Required"),
      mobileNumber: Yup.string().required("Mobile is Required"),
      message: Yup.string().required("Message is Required"),
    }),
    onSubmit: async (values) => {
      let payload = {
        name: values?.name,
        mobileNumber: values?.mobileNumber?.replace(dialCode, ""),
        message: values?.message,
      };
      try {
        const responseData = await postJson(
          "contact_us/save_contact_us",
          payload
        );
        if (responseData) {
          swal(
            "Thank You",
            "Your query's has been submitted. Our team contact you soon.",
            "success"
          );
          contectUsForm.resetForm();
        } else {
          toast.error(`${responseData}`);
          contectUsForm.resetForm();
        }
      } catch (error) {
        contectUsForm.resetForm();
        toast.error(`${error}`);
      }
    },
  });

  const onChangeHandler = (phone, country, e) => {
    setDialCode(country?.dialCode);
    contectUsForm.setFieldValue("mobileNumber", phone);
  };

  return (
    <Layout className="bg-white p-5">
      <div className="container-fluid p-0   customers_header">
        <h3>Contectus</h3>
        <form onSubmit={contectUsForm.handleSubmit} className="contect-form">
          <Row className="Row-Height" gutter={[10, 10]}>
            <Col span={24}>
              <div className="container-fluid">
                <div className="row">
                  <div className="canteenmenu-form w-100 register-canteen-box">
                    <Col span={24}>
                      <div className="form-group">
                        <input
                          id="form_name5"
                          className="form-control"
                          type="text"
                          onChange={contectUsForm.handleChange}
                          name="name"
                          value={contectUsForm.values.name}
                        />
                        <label htmlFor="form_name5">Name</label>
                        {contectUsForm.touched.name &&
                        contectUsForm.errors.name ? (
                          <div className="text-start">
                            <span className="error">
                              {contectUsForm.errors.name}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="form-group">
                        <PhoneInput
                       country={'in'}
                       localization={"in"}
                       regions={'asia'}
                       onlyCountries={['in']}
                          onChange={onChangeHandler}
                          className="w-100"
                          value={contectUsForm.values.mobileNumber}
                        />
                        {contectUsForm.touched.mobileNumber &&
                        contectUsForm.errors.mobileNumber ? (
                          <div className="text-start">
                            <span className="error">
                              {contectUsForm.errors.mobileNumber}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="form-group textarea">
                        <textarea
                          id="form_message"
                          className="form-control"
                          onChange={contectUsForm.handleChange}
                          name="message"
                          value={contectUsForm.values.message}
                        />
                        <label htmlFor="form_message">Message</label>
                        {contectUsForm.touched.message &&
                        contectUsForm.errors.message ? (
                          <div className="text-start">
                            <span className="error">
                              {contectUsForm.errors.message}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </Col>
                    <div>
                      <button
                        type="submit"
                        className="btn btn-secondary bg-gray"
                      >
                        {" "}
                        submit
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
  );
};

export default Contectus;
