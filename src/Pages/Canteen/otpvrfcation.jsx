import React, { useState } from 'react'

import { useFormik } from "formik";
import * as Yup from "yup";
import { Spinner } from "react-bootstrap";
import { Modal } from 'antd';
import { postJson } from '../../Common/api-instance';
const Otpvrfcation = (props) => {
    const [otploader, setOtpLoader] =useState(false)
    const otpForm = useFormik({
      initialValues: {
        orderOtp: "",
      },
      validationSchema: Yup.object({
        orderOtp: Yup.string().required("Otp is required*"),
      }),
      onSubmit: async (values) => {
        setOtpLoader(true)
       let item = {
        userId: props?.otpList?.officeOwnerDto?.officeOwnerId,
        orderId: props?.otpList?.orderId,
        canteenId: props?.otpList?.canteenDto?.canteenId,
        orderOtp:values?.orderOtp
       }
       
    try {
    const responseData = await postJson("order/verify_order_otp", item);
    if (responseData?.status == "200") {
 
      props.getData()
      props.onClose()
    }
  } catch (error) {
    console.error(error);
  }
  
      },
    });
  return (
    <div>
    <Modal
      footer={false}
      title=""
      centered
      visible={props.otpModel}
      onOk={() => {
          props.onClose()
        otpForm.resetForm();
      }}
      onCancel={() => {
          props.onClose()
        otpForm.resetForm();
      }}
      width={400}
    >
      <form onSubmit={otpForm.handleSubmit}>
        <div className="container">
          <div className="card-body px-1">
            <div className="d-flex align-items-center justify-content-between">
              <div className="usre-img-details mb-3 d-flex align-items-center justify-content-between">
                <div className="user-img me-3">
                  <img  src={ props?.otpList?.officeOwnerDto?.companyLogo ? props?.otpList?.officeOwnerDto?.companyLogo :"assets/images/user-img.png"} className="img-fluid"   alt="img" />
                </div>
                <div className="user-details">
                  <h5 className="mb-0">{ props?.otpList?.officeOwnerDto?.officeName}</h5>
                  <h5 className="mb-0">{ props?.otpList?.officeOwnerDto?.buildingName}</h5>
                </div>
              </div>
              <div className="more-btn">
                <p>#{ props?.otpList?.orderId}</p>
              </div>
            </div>
            <div className="register-canteen-box mt-0">
              <div className="form-group">
                <input
                  id="form_name1"
                  className="form-control"
                  type="text"
                  name="orderOtp"
                  onChange={otpForm.handleChange}
                  value={otpForm.values.orderOtp}
                
                />
                <label htmlFor="form_name1">
                  Enter OTP<span className="gl-form-asterisk"></span>
                </label>
                {otpForm.touched.orderOtp && otpForm.errors.orderOtp ? (
                  <div className="text-start">
                    {" "}
                    <span className="error">
                      {otpForm.errors.orderOtp}
                    </span>{" "}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end pt-3">
              <div className="menu-btns">
                <button
                  type="button"
                  className="btn btn-dark me-2"
                  onClick={() => {
                      props.onClose()
                    otpForm.resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-dark">
                {otploader ? <Spinner  animation="border" size="sm" /> : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal></div>
  )
}

export default Otpvrfcation