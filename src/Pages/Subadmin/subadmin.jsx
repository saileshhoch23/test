import { Button, Input, Layout, Select } from "antd";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { postJson } from "../../Common/api-instance";
import toast from "react-hot-toast";
import { Spinner } from "react-bootstrap";

const Subadmin = () => {
  const [submitloader, setSubmitLoader] = useState(false)
  const adminForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      userType:""
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Frist name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().required("Email is required").matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,'Invalid email address'),
      userType: Yup.string().required("User Type is required"),
    }),
    onSubmit: async (values) => {
      setSubmitLoader(true)
      try {
        const responseData = await postJson("user/admin_signup", values);

        if(responseData.status === 101){
          setSubmitLoader(false)
          toast.error(`${responseData.massage}`);
        }else{
          setSubmitLoader(false)
          toast.success("create successfully")
        }
      } catch (error) {
        setSubmitLoader(false)
        console.log(error);
      }
    },
  });
  const { Option } = Select;
  const onChange = (value) => {
    adminForm.setFieldValue("userType",value);
  };
  return (
    <>
      <Layout className="bg-white">
        <div className="container p-0 d-flex justify-content-between">
          <h3>Create Admin User</h3>
        </div>
        <form onSubmit={adminForm.handleSubmit}>
          <div className="container mt-3">
            <div>
              <label className="inputLabel">Frist Name*</label>
               <br />
              <Input
                name="firstName"
                className="w-25"
                type="text"
                values={adminForm.values.firstName}
                onChange={adminForm.handleChange}
              />
               <br />
              {adminForm.touched.firstName && adminForm.errors.firstName ? (
                <span className="error">{adminForm.errors.firstName}</span>
              ) : null}
            </div>
            <div>
              <label className="inputLabel">Last Name*</label>
               <br />
              <Input
                name="lastName"
                className="w-25"
                type="text"
                values={adminForm.values.lastName}
                onChange={adminForm.handleChange}
              />
               <br />
              {adminForm.touched.lastName && adminForm.errors.lastName ? (
                <span className="error">{adminForm.errors.lastName}</span>
              ) : null}
            </div>
            <div>
              <label className="inputLabel">Email Address*</label>
               <br />
              <Input
                id="email"
                name="email"
                className="w-25"
                type="email"
                values={adminForm.values.email}
                onChange={adminForm.handleChange}
              />
               <br />
              {adminForm.touched.email && adminForm.errors.email ? (
                <span className="error">{adminForm.errors.email}</span>
              ) : null}
            </div>
            <div>
               <label className="inputLabel">User Type *</label> <br />
                <Select
                  value={adminForm.values.userType}
                  className="w-25"
                  showSearch
                  optionFilterProp="children"
                  onChange={onChange}
                >
                  <Option value="SUBADMIN">Subadmin User</Option>
                  <Option value="canteen_user">Canteen User</Option>
                  <Option value="building_user">Building User</Option>
                  <Option value="office_user">Office User</Option>
                </Select>
                <br/>
                {adminForm.touched.userType && adminForm.errors.userType ? (
                <span className="error">{adminForm.errors.userType}</span>
              ) : null}
            </div>
            <div className="d-flex mt-3 justify-content-between">
              <div className="mt-2"></div>
            </div>
            <Button
            type="primary"
            htmlType="submit"
            className=" mt-1"
          >
           
           {submitloader?(
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Submit"
                  )}
           
          </Button>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default Subadmin;
