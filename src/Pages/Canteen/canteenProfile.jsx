import React, { useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import { post, postJson } from "../../Common/api-instance";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Spinner } from "react-bootstrap";

const CanteenProfile = () => {
  const [selectedTab, setSelectedTab] = useState("my_profile");
  const [startTime, setStartTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [canteenImg, setcanteenImg] = useState(null);
  const [canteenProof, setCanteenProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buildingList, setBuildingList] = useState([]);
  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
    Profileform.setFieldValue("startTime", event.target.value);
  };

  const handleCloseTimeChange = (event) => {
    setCloseTime(event.target.value);

    Profileform.setFieldValue("endTime", event.target.value);
  };

  const user = useSelector((state) => state?.user);
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  
  const profileUpload = (e) => {
    const selectedFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (selectedTab === "my_profile") {
        setProfileImg(URL.createObjectURL(selectedFile));
        Profileform.setFieldValue("userDocument", selectedFile);
      } else {
        setcanteenImg(URL.createObjectURL(selectedFile));
        Profileform.setFieldValue("imagePath", selectedFile);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  useEffect(() => {
    getData();
    getBuildingList();
  }, []);
  async function fetchImageAndConvertToFile(imageUrl) {
    try {
      const response = await fetch(imageUrl);
      const imageData = await response.blob();
      const fileName = "images.jpg";
      const fileType = imageUrl.substring(imageUrl.lastIndexOf(".") + 1);
      const file = new File([imageData], fileName, {
        type: `image/${fileType}`,
        lastModified: new Date().getTime(),
        lastModifiedDate: new Date(),
      });

      return file;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  }

  function convertToIndianTime(time) {

    const [hours, minutes, seconds] = time.split(":").map(Number);

  
    const period = hours >= 12 ? "PM" : "AM";


    let hours12 = hours % 12;
    hours12 = hours12 === 0 ? 12 : hours12; 


    const formattedTime = `${hours12}:${minutes < 10 ? "0" + minutes : minutes} ${period}`;

    return formattedTime;
}

  const getData = async () => {
    try {
      const responseData = await postJson("user/get_user_profile", {
        userId: user?.userId,
      });
      if (responseData && responseData?.data) {
        Profileform.setFieldValue("email", responseData?.data?.email);
        Profileform.setFieldValue("firstName", responseData?.data?.firstName);
        Profileform.setFieldValue("lastName", responseData?.data?.lastName);
        Profileform.setFieldValue(
          "mobileNumber",
          responseData?.data?.mobileNumber
        );
        Profileform.setFieldValue(
          "canteenName",
          responseData?.data?.canteenDetailDto?.canteenName
        );
        Profileform.setFieldValue(
          "buildingName",
          responseData?.data?.canteenDetailDto?.buildingName
        );
        Profileform.setFieldValue(
          "address",
          responseData?.data?.canteenDetailDto?.canteenLocation
        );
        Profileform.setFieldValue(
          "startTime",
          convertToIndianTime(responseData?.data?.canteenDetailDto?.startTime)
        );
        Profileform.setFieldValue(
          "endTime",
          convertToIndianTime(responseData?.data?.canteenDetailDto?.endTime)
        );
        
        setStartTime(convertToIndianTime(responseData?.data?.canteenDetailDto?.startTime));
        setCloseTime(convertToIndianTime(responseData?.data?.canteenDetailDto?.endTime));
        fetchImageAndConvertToFile(
          responseData?.data?.canteenDetailDto?.imagePath
        ).then((file) => {
          if (file) {
            Profileform.setFieldValue("imagePath", file);
          } else {
            console.error(
              "Failed to fetch image or convert it to File object."
            );
          }
        });

        setcanteenImg(responseData?.data?.canteenDetailDto?.imagePath);
        fetchImageAndConvertToFile(responseData?.data?.userDocument).then(
          (file) => {
            if (file) {
              Profileform.setFieldValue("userDocument", file);
            } else {
              console.error(
                "Failed to fetch image or convert it to File object."
              );
            }
          }
        );
        setProfileImg(responseData?.data?.userDocument);
        setCanteenProof(responseData?.data?.canteenDetailDto?.canteenProof);
        fetchImageAndConvertToFile(
          responseData?.data?.canteenDetailDto?.canteenProof
        ).then((file) => {
          if (file) {
            Profileform.setFieldValue("canteenProof", file);
          } else {
            console.error(
              "Failed to fetch image or convert it to File object."
            );
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBuildingList = async () => {
    try {
      const responseData = await postJson("building/get_building_list", {
        // Parameters: null,
      });

      if (responseData && responseData.data) {
        setBuildingList(responseData.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fileInputRef = useRef(null);
  const onFileChange = (e) => {
    var file = e.target.files[0];

    Profileform.setFieldValue("canteenProof", file);
  };
  const Profileform = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      mobileNumber: "",
      canteenName: "",
      canteenOwnerName: "",
      startTime: "",
      endTime: "",
      buildingName: "",
      canteenProof: "",
      address: "",
      imagePath: "",
      userDocument: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required("email name is required"),
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      mobileNumber: Yup.string().required("Phone number is required"),
      canteenName: Yup.string().required("canteenName name is required"),
      startTime: Yup.string().required("startTime is required"),
      endTime: Yup.string().required("endTime is required"),
      buildingName: Yup.string().required("BuildingName is required"),
      address: Yup.string().required("address is required"),
      canteenProof: Yup.string().required("canteenProof is required"),
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
        userType: "CANTEEN",
        canteenDetails: {
          canteenName: values?.canteenName,
          canteenOwnerName: values?.canteenOwnerName,
          address: values?.address,
          startTime: values?.startTime,
          endTime: values?.endTime,
          officeNo: values?.officeNo,
          open: true,
          officeNo: values?.officeNo,
          buildingName: values?.buildingName,
          complexName: null,
        },
      };
      formData.append("updateUserProfileDtoStr", JSON.stringify(payload));
      formData.append("document1", values?.canteenProof);
      formData.append("document2", values?.imagePath);
      formData.append("profilePicture", values?.userDocument);
      try {
        const responseData = await post(
          "user/update_user_profile_mobile_app_doc",
          formData
        );
        if (responseData.status === 101) {
          toast.error(`${responseData.message}`);
        } else {
          setLoading(false);
          toast.success("update successfully");
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
                src={
                  selectedTab === "my_profile"
                    ? profileImg
                      ? profileImg
                      : "./assets/images/user-img.png"
                    : canteenImg
                }
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
              name="imagePath"
              onChange={profileUpload}
              className="profileInput"
            />
          </div>
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
                    selectedTab === "canteen" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("canteen")}
                  type="button"
                  role="tab"
                  aria-selected={selectedTab === "canteen"}
                >
                  Canteen
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
                    <label htmlFor="form_name4">Email*</label>
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
              {selectedTab === "canteen" && (
                <>
                  {" "}
                  <div className="form-group">
                    <input
                      id="form_name4"
                      className="form-control"
                      type="text"
                      name="canteenName"
                      value={Profileform?.values?.canteenName}
                      onChange={Profileform?.handleChange}
                    />
                    <label htmlFor="form_name4">Canteen Name*</label>
                    {Profileform.touched.canteenName &&
                    Profileform.errors.canteenName ? (
                      <div className="text-start">
                        <span className="error">
                          {Profileform.errors.canteenName}
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
                      <label htmlFor="floatingSelect">Complex Name*</label>
                      {Profileform.touched.categoryId &&
                      Profileform.errors.categoryId ? (
                        <div className="text-start">
                          {" "}
                          <span className="error">
                            {Profileform.errors.categoryId}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      id="form_name4"
                      className="form-control"
                      type="text"
                      name="address"
                      value={Profileform?.values?.address}
                      onChange={Profileform?.handleChange}
                    />
                    <label htmlFor="form_name4">Canteen location*</label>
                    {Profileform.touched.address &&
                    Profileform.errors.address ? (
                      <div className="text-start">
                        <span className="error">
                          {Profileform.errors.address}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <input
                      id="form_name6"
                      className="form-control ps-5 pe-4"
                      type={canteenProof ? "text" : "file"}
                      ref={fileInputRef}
                      name="canteenProof"
                      value={canteenProof}
                      onChange={onFileChange}
                    />
                    <label htmlFor="form_name4">Canteen Proof*</label>
                    <button
                      className="btn delete-btn"
                      type="button"
                      onClick={() => {
                        Profileform.setFieldValue("canteenProof", "");
                        setCanteenProof("");
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                    >
                      <img
                        src="assets/images/delete.png"
                        className="img-fluid"
                        alt="img"
                      />
                    </button>
                    <img
                      src="assets/images/image.png"
                      className="img-fluid uplod-btn"
                      alt="img"
                    />
                    {Profileform.touched.canteenProof &&
                    Profileform.errors.canteenProof ? (
                      <span className="error">
                        {Profileform.errors.canteenProof}
                      </span>
                    ) : null}
                  </div>
                  <div className="d-flex gap-2">
                    <div className="form-group">
                      <select
                        className="form-select"
                        id="floatingSelect"
                        value={startTime}
                        onChange={handleStartTimeChange}
                      >
                       <option value="">Select Time</option>
                        {[...Array(24).keys()].map((hour) => (
                          <option
                            key={hour}
                            value={`${
                              hour < 10
                                ?  hour
                                : hour > 12
                                ? hour - 12
                                : hour
                            }:00 ${hour < 12 ? "AM" : "PM"}`}
                          >
                            {`${
                              hour < 10
                                ? hour
                                : hour > 12
                                ? hour - 12
                                : hour
                            }:00 ${hour < 12 ? "AM" : "PM"}`}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="form_name4" style={{ top: "-7px" }}>
                        Open Time*
                      </label>
                    </div>
                    <div className="form-group">
                      <select
                        className="form-select"
                        id="floatingSelect"
                        value={closeTime}
                        onChange={handleCloseTimeChange}
                      >
                        <option value="">Select Time</option>
                        {[...Array(24).keys()].map((hour) => (
                          <option
                            key={hour}
                            value={`${
                              hour < 10
                                ?  hour
                                : hour > 12
                                ? hour - 12
                                : hour
                            }:00 ${hour < 12 ? "AM" : "PM"}`}
                          >
                            {`${
                              hour < 10
                                ?  hour
                                : hour > 12
                                ? hour - 12
                                : hour
                            }:00 ${hour < 12 ? "AM" : "PM"}`}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="form_name4" style={{ top: "-7px" }}>
                        Close Time*
                      </label>
                    </div>
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
          {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Edite"
                    )}
        </button>
      </form>
    </div>
  );
};

export default CanteenProfile;
