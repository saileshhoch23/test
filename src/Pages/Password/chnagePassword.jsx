import { Button, Layout, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup"
import { useSelector } from "react-redux";
import { postJson } from "../../Common/api-instance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
const ChnagePassword = () => {
  const user = useSelector(state => state.user)
  const [submitloader, setSubmitLoader] = useState(false)
  const navigate = useNavigate();
  
  const chnangeFrom = useFormik({
    initialValues: {
      emailOrMobileNo:user?.email,
      newPassword: "",
      passwordconfirm: "",
    },
    validationSchema: Yup.object().shape({
      newPassword: Yup.string()
        .required("Enter new password")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        ),
      passwordconfirm: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required(" Enter Confirm Password"),
    }),
    onSubmit: async(values) => {
      delete values.passwordconfirm;
      setSubmitLoader(true)
      try {
        const responseData = await postJson("user/admin_reset_password", values);
         navigate("/")
         setSubmitLoader(false)
        toast.success(`Successfully password chnage`);
      } catch (error) {
        setSubmitLoader(false)
        console.log(error);
      }
    },
  });
  return (
    <>
      <Layout className="Login_Main">
        <div className="LoginContianer">
          <h4>Change Password</h4>
          <form onSubmit={chnangeFrom.handleSubmit}>
            <div className=" container">
              <label className="inputLabel">Enter New Password *</label>
              <br />
              <Input.Password
                id="passwordsdata"
                name="newPassword"
                value={chnangeFrom.values.newPassword}
                onChange={chnangeFrom.handleChange}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
                {chnangeFrom.touched.newPassword &&
              chnangeFrom.errors.newPassword ? (
                <span className="error">
                  {chnangeFrom.errors.newPassword}
                </span>
              ) : null}
              <br />
              <label className="inputLabel">Confirm New Password *</label>
              <br />
              <Input.Password
                id="passwordconfirm"
                name="passwordconfirm"
                value={chnangeFrom.values.passwordconfirm}
                onChange={chnangeFrom.handleChange}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
              {chnangeFrom.touched.passwordconfirm &&
              chnangeFrom.errors.passwordconfirm ? (
                <span className="error">
                  {chnangeFrom.errors.passwordconfirm}
                </span>
              ) : null}
              <br />
              <Button type="primary" htmlType="submit" className=" mt-3">
              {submitloader?(
                    <Spinner animation="border" size="sm" />
                  ) : ( "Update" )}
              </Button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default ChnagePassword;
