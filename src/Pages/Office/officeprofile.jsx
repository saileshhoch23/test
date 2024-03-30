import React, { useEffect, useRef, useState } from "react";
import "./office.css";
import "../../Common/common.css";
import { MdEdit } from "react-icons/md";
import { post, postJson } from "../../Common/api-instance";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Spinner } from "react-bootstrap";
const Officeprofile = () => {
  const [selectedTab, setSelectedTab] = useState("my_profile");
  const [profileImg, setProfileImg] = useState(null);
  const [compnaylog, setComnaylog] = useState(null);
  const user = useSelector((state) => state?.user);
  const [officeOwnerProof, setOfficeOwnerProof] = useState("");
  const [loading, setLoading] = useState(false);
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const clearFileInput = () => {
    setOfficeOwnerProof(""); // Clearing the state variable
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clearing the file input
    }
  };

  const fileInputRef = useRef(null);

  const profileUpload = (e) => {
    var file = e.target.files[0];

    const selectedFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        if(selectedTab == "my_profile"){
          setProfileImg(URL.createObjectURL(selectedFile));
          Profileform.setFieldValue("userDocument", file);
        }else{
          
          setComnaylog(URL.createObjectURL(selectedFile));
          Profileform.setFieldValue("companyLogo", file);
        }
      };
    };
    reader.readAsDataURL(selectedFile);
  };

  const onFileChange = (e) => {
    var file = e.target.files[0];

    Profileform.setFieldValue("officeOwnerProof", file);
    setOfficeOwnerProof(file?.name);
  };
  useEffect(() => {
    getData();
    getBuildingList();
  }, []);
  const getData = async () => {
    try {
      const responseData = await postJson("user/get_user_profile", {
        userId: user?.userId,
      });
      if (responseData && responseData?.data) {
        Profileform.setFieldValue("firstName", responseData?.data?.firstName);
        Profileform.setFieldValue("email", responseData?.data?.email);
        Profileform.setFieldValue("lastName", responseData?.data?.lastName);
        Profileform.setFieldValue("mobileNumber",responseData?.data?.mobileNumber);
        Profileform.setFieldValue("officeName",responseData?.data?.officeOwnerDto?.officeName);
        Profileform.setFieldValue("officeNo",responseData?.data?.officeOwnerDto?.officeNo);
        Profileform.setFieldValue("companyLocation",responseData?.data?.officeOwnerDto?.companyLocation);
        Profileform.setFieldValue("buildingName",responseData?.data?.officeOwnerDto?.buildingName)
        fetchImageAndConvertToFile(responseData?.data?.officeOwnerDto?.companyLogo)
        .then(file => {
            if (file) {
              Profileform.setFieldValue("companyLogo",  file);
            } else {
                console.error('Failed to fetch image or convert it to File object.');
            }
        })
        fetchImageAndConvertToFile(responseData?.data?.userDocument)
        .then(file => {
            if (file) {
              Profileform.setFieldValue("userDocument",  file);
            } else {
                console.error('Failed to fetch image or convert it to File object.');
            }
        })
        fetchImageAndConvertToFile(responseData?.data?.officeOwnerDto?.officeOwnerProof)
        .then(file => {
            if (file) {
              Profileform.setFieldValue("officeOwnerProof",   file);
        
            } else {
                console.error('Failed to fetch image or convert it to File object.');
            }
        })
        .catch(error => console.error('Error:', error));
        setOfficeOwnerProof(
          responseData?.data?.officeOwnerDto?.officeOwnerProof
        );
        setComnaylog(responseData?.data?.officeOwnerDto?.companyLogo);
        setProfileImg(responseData?.data?.userDocument);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [buildingList, setBuildingList] = useState([]);
  const getBuildingList = async () => {
    try {
      const responseData = await postJson("building/get_building_list", {});

      if (responseData && responseData.data) {
        setBuildingList(responseData.data);
      }
    } catch (error) {
      console.error(error);
    }
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


  const Profileform = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      mobileNumber: "",
      officeName: "",
      officeNo: "",
      companyLocation: "",
      buildingName: "",
      officeOwnerProof: "",
      companyLogo: "",
      userDocument: "",
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      mobileNumber: Yup.string().required("Phone number is required"),
      officeName: Yup.string().required("Company name is required"),
      officeNo: Yup.string().required("Office number is required"),
      companyLocation: Yup.string().required("Company location is required"),
      buildingName: Yup.string().required("Company building is required"),
      officeOwnerProof: Yup.string().required("Electricity bill is required"),
      companyLogo: Yup.string().required("company Logo is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      let formData = new FormData();
  
      let payload = {
        email: values?.email,
        firstName: values?.firstName,
        lastName: values?.lastName,
        mobileNumber: values?.mobileNumber,
        isActive: "true",
        userId: user?.userId,
        userType: "USER",
        officeOwnerDetails: {
          officeName: values?.officeName,
          companyLocation: values?.companyLocation,
          officeNo: values?.officeNo,
          buildingName: values?.buildingName,
          imagePath: values?.officeOwnerProof?.name,
          companyLogo: values?.companyLogo?.name,
        },
      };
      formData.append("updateUserProfileDtoStr", JSON.stringify(payload));
      formData.append("document1", values?.companyLogo); 
      formData.append("document2",values?.officeOwnerProof);
      formData.append("profilePicture",values?.userDocument);
      try {
        const responseData = await post(
          "user/update_user_profile_mobile_app_doc",
          formData
        );
        if (responseData.status === 101) {
          setLoading(false);
          toast.error(`${responseData.message}`);
        } else {
          toast.success("update successfully");
          setLoading(false);
          getData();
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <div className="container mt-5">
      <form onSubmit={Profileform.handleSubmit}>
        <div className="row">
          <h5 className="text-center">My profile</h5>

          <div className="profilePictureContainerMain">
            <div className="profilePictureContainer">
              <img
          src={ selectedTab === "my_profile"  ? profileImg ?  profileImg :"./assets/images/user-img.png" : compnaylog }
                className="img-fluid w-100"
                alt="img"
              />
            </div>
            <div className="w-100 d-flex justify-content-center edit-label">
              <label htmlFor="profileInput">
                <MdEdit className="editImgBtn" />
              </label>
            </div>

            <input
              type="file"
              id="profileInput"
              name="companyLogo"
              onChange={profileUpload}
              className="profileInput"
            />
          </div>
          {Profileform.touched.companyLogo && Profileform.errors.companyLogo ? (
            <div className="text-start">
              <span className="error">{Profileform.errors.companyLogo}</span>
            </div>
          ) : null}
          <div className="profile-form">
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
              <li className="nav-item " role="presentation">
                <button
                  className={`nav-link w-200  bold01  ${
                    selectedTab === "my_profile" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("my_profile")}
                  type="button"
                  role="tab"
                  aria-selected={selectedTab === "my_profile"}
                >
                  My Profile
                </button>
              </li>
              <li className="nav-item " role="presentation">
                <button
                  className={`nav-link w-200  bold01 ${
                    selectedTab === "Office" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("Office")}
                  type="button"
                  role="tab"
                  aria-selected={selectedTab === "Office"}
                >
                  Office Info
                </button>
              </li>
            </ul>

            <div className=" w-100 register-canteen-box">
              {selectedTab === "my_profile" && (
                <>
                  {" "}
                  <div className="form-group">
                    <input
                      id="form_name4"
                      className="form-control"
                      type="text"
                      name="firstName"
                      value={Profileform?.values?.firstName}
                      onChange={Profileform?.handleChange}
                    />
                    <label htmlFor="form_name4">Frist Name*</label>
                    {Profileform.touched.firstName &&
                    Profileform.errors.firstName ? (
                      <div className="text-start">
                        <span className="error">
                          {Profileform.errors.firstName}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <input
                      id="form_name4"
                      className="form-control"
                      type="text"
                      name="lastName"
                      value={Profileform?.values?.lastName}
                      onChange={Profileform?.handleChange}
                    />
                    <label htmlFor="form_name4">Second Name*</label>
                    {Profileform.touched.lastName &&
                    Profileform.errors.lastName ? (
                      <div className="text-start">
                        <span className="error">
                          {Profileform.errors.lastName}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <input
                      id="form_name4"
                      className="form-control"
                      type="text"
                      name="mobileNumber"
                      value={Profileform?.values?.mobileNumber}
                      onChange={Profileform?.handleChange}
                    />
                    <label htmlFor="form_name4">Phone Number*</label>
                    {Profileform.touched.mobileNumber &&
                    Profileform.errors.mobileNumber ? (
                      <div className="text-start">
                        <span className="error">
                          {Profileform.errors.mobileNumber}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <input
                      id="form_name4"
                      className="form-control"
                      type="text"
                      name="email"
                      value={Profileform?.values?.email}
                      onChange={Profileform?.handleChange}
                    />
                    <label htmlFor="form_name4">email*</label>
                    {Profileform.touched.email && Profileform.errors.email ? (
                      <div className="text-start">
                        <span className="error">
                          {Profileform.errors.email}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
              {selectedTab === "Office" && (
                <>
                  {" "}
                  <div className="form-group">
                    <input
                      id="form_name4"
                      className="form-control"
                      type="text"
                      name="officeName"
                      value={Profileform?.values?.officeName}
                      onChange={Profileform?.handleChange}
                    />
                    <label htmlFor="form_name4">Company Name*</label>
                    {Profileform.touched.officeName &&
                    Profileform.errors.officeName ? (
                      <div className="text-start">
                        <span className="error">
                          {Profileform.errors.officeName}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <input
                      id="form_name4"
                      className="form-control"
                      type="text"
                      name="officeNo"
                      value={Profileform?.values?.officeNo}
                      onChange={Profileform?.handleChange}
                    />
                    <label htmlFor="form_name4">Office no*</label>
                    {Profileform.touched.officeNo &&
                    Profileform.errors.officeNo ? (
                      <div className="text-start">
                        <span className="error">
                          {Profileform.errors.officeNo}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <input
                      id="form_name4"
                      className="form-control"
                      type="text"
                      name="companyLocation"
                      value={Profileform?.values?.companyLocation}
                      onChange={Profileform?.handleChange}
                    />
                    <label htmlFor="form_name4">Company location*</label>
                    {Profileform.touched.companyLocation &&
                    Profileform.errors.companyLocation ? (
                      <div className="text-start">
                        <span className="error">
                          {Profileform.errors.companyLocation}
                        </span>
                      </div>
                    ) : null}
                  </div>
      
                  <div className="form-group">
                    <div className="form-group me-2">
                      <select
                        className="form-select"
                        id="floatingSelect"
                        aria-label="Floating label select example"
                        value={Profileform.values.buildingName}
                        onChange={(e) => {
                          const buildingname = e.target.value;
                          Profileform.setFieldValue("buildingName", buildingname);
                        }}
                      >
                        <option value="">-Select-</option>
                        {buildingList?.map((item, id) => (
                          <option
                            key={id}
                            value={item?.building_name}   
                          >
                            {item?.building_name}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="floatingSelect">Company Building*</label>
                      {Profileform.touched.buildingName &&
                      Profileform.errors.buildingName ? (
                        <div className="text-start">
                          {" "}
                          <span className="error">
                            {Profileform.errors.buildingName}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      id="form_name6"
                      className="form-control ps-5 pe-4"
                      type={officeOwnerProof ? "text" : "file"}
                      ref={fileInputRef}
                      name="officeOwnerProof"
                      value={officeOwnerProof} 
                      onChange={onFileChange}
                    />
                    <label htmlFor="form_name6">Electricity bill*</label>
                    <button
                      className="btn delete-btn"
                      type="button"
                      onClick={clearFileInput}
                    >
                      <img
                        src="assets/images/delete.png"
                        className="img-fluid "
                        alt="Delete button"
                      />
                    </button>
                    <img
                      src="assets/images/image.png"
                      className="img-fluid uplod-btn"
                      alt="Upload button"
                    />
                    {/* Add error handling if needed */}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <button
          className="btn w-100  btn-secondary bg-gray radious-10"
          type="submit"
        >
        {loading ?  (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Edite"
                    )}
        </button>
      </form>
    </div>
  );
};

export default Officeprofile;
