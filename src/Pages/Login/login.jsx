import { Layout, Input } from "antd";
import "./login.css";
import { useFormik } from "formik";
import { postJson } from "../../Common/api-instance";
import { setUser } from "../../redux/action";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitloader, setSubmitLoader] = useState(false);
  const loginForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      userNameOrMobileNo: "",
    },
    validationSchema: Yup.object({
      userNameOrMobileNo: Yup.string()
        .required("Email or phone number is required")
        .test("is-email-or-phone", "Invalid email or phone number", (value) => {
          const isEmail =
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
          const isPhone = /^\d{10}$/.test(value);

          return isEmail || isPhone;
        }),
    }),
    onSubmit: async (values) => {
      const isEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
        values.userNameOrMobileNo
      );
      const isPhone = /^\d{10}$/.test(values.userNameOrMobileNo);
      try {
        setSubmitLoader(true);
        const responseData = await postJson("user/signup_mobile_app", {
          email: isEmail ? values.userNameOrMobileNo : "",
          mobile: isPhone ? values.userNameOrMobileNo : "",
          appId: "",
          deviceId: "",
        });
        if (
          responseData?.jwtResponse?.accessToken &&
          responseData?.data?.isFullProfile == "Y"
        ) {
          dispatch(setUser(responseData));

          navigate("/otpvarefaction");
          toast.success(
            `send ${
              isEmail
                ? "Otp email"
                : "Otp Phone" + responseData?.data?.tmpPassword
            }`
          );
          setSubmitLoader(false);
        } else {
          toast.error("please register in app ");
        }
      } catch (error) {
      } finally {
        setSubmitLoader(false);
      }
    },
  });
  return (
    <Layout className="Login_Main">
      <div className="container w-50 m-auto width-container">
        <div className="row">
          <div className="col-md-6 pe-md-0">
            <div className="LoginContianer">
              <h3 className="mt-3">Login</h3>
              <p className="mt-3">Log in to your account to continue.</p>
              <form onSubmit={loginForm.handleSubmit}>
                <div>
                  <label
                    className="inputLabel mt-3"
                    htmlFor="userNameOrMobileNo"
                  >
                    Your email/mobile
                  </label>
                  <Input
                    id="userNameOrMobileNo"
                    name="userNameOrMobileNo"
                    type="text"
                    values={loginForm.values.userNameOrMobileNo}
                    onChange={loginForm.handleChange}
                  />
                  {loginForm.touched.userNameOrMobileNo &&
                  loginForm.errors.userNameOrMobileNo ? (
                    <span className="error">
                      {loginForm.errors.userNameOrMobileNo}
                    </span>
                  ) : null}
                </div>

                <div className="d-flex mt-3 justify-content-between">
                  <div className="mt-2"></div>
                </div>
               
                <div className="text-center">
                  <button
                    className="loginBtn"
                    type="submit"
                    style={{ marginTop: "20px" }}
                  >
                    {submitloader ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 ps-md-0">
            <div className="img-box">
              <img
                src="./assets/images/login1.webp"
                className="img-fluid"
                alt="img"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
