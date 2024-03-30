import { Input, Layout } from "antd";
import { useFormik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import * as Yup from "yup"
import { postJson } from "../../Common/api-instance";
import { Spinner } from "react-bootstrap";
const ForgotPassword = () => {
  const [submitloader, setSubmitLoader] = useState(false)
  const forgotPassFrom = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email is required")
        .matches(
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          "Invalid email address"
        ),
    }),
    onSubmit: async (values) => {
      try {
        setSubmitLoader(true)
        const responseData = await postJson("user/forgot_password", values);
        if(responseData){
          setSubmitLoader(false)
          toast.success(`${responseData.massage}`);
        }
      } catch (error) {
        setSubmitLoader(false)
        console.log(error);
      }
    },
  });
  return (
    <>
      <Layout className="Login_Main">
        <div className="container">
        <div className="row">
          <div className="col-md-6 pe-md-0">
          <div className="ForgotContianer">
          <h3>Password Recovery</h3>
          <p>
            Please fill in the Email You have used to create your account & we
            will send you a reset password
          </p>
          <form onSubmit={forgotPassFrom.handleSubmit}>
            <label className="inputLabel">Email</label>
            <Input
              id="email"
              name="email"
              type="text"
              values={forgotPassFrom.values.email}
              onChange={forgotPassFrom.handleChange}
            />
            <br />
            {forgotPassFrom.touched.email && forgotPassFrom.errors.email ? (
              <span className="error">{forgotPassFrom.errors.email}</span>
            ) : null}
            <div className="text-center">
            <button className="loginBtn" type="submit">
            {submitloader?(
                    <Spinner animation="border" size="sm" />
                  ) : ( "Submit" )}
            </button>
            </div>
          </form>
          <p className="text-center mt-3">
            Remember your password ? <Link to="/login">Login</Link>
          </p>
        </div>
          </div>
          <div className="col-md-6 ps-md-0">
            <div className="img-box">
              <img src="./assets/images/forgot1.webp" className="img-fluid" alt="img"/>
            </div>
          </div>
        </div>
        </div>
      </Layout>
    </>
  );
};

export default ForgotPassword;
