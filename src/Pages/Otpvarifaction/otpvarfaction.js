import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import OTPInput from 'react-otp-input';
import { useDispatch, useSelector } from 'react-redux';
import "./otp.css"
import { BASE_URL, postJson } from "../../Common/api-instance";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { setCanteenData, setToken, setUser, setuserdetials } from '../../redux/action';
import axios from 'axios';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const user = useSelector((state) => state?.user?.data);
  const token = useSelector((state) => state?.user?.jwtResponse);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(59);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    setSubmitLoader(true);
    const config = {
      headers: {
        Authorization: `Bearer ${token?.accessToken}` // Include token in the Authorization header
      }
    };
    try {
      setSubmitLoader(true)
      const responseData = await axios.post(BASE_URL + "user/verify_otp", {
        userId: user?.userId,
        otp: otp
      }, config);

      if (responseData?.data?.userDetails?.accessToken) {
        navigate("/")
        dispatch(setCanteenData(responseData?.data?.canteenDetails))
        dispatch(setUser(responseData?.data?.data));
        dispatch(setToken(responseData?.data?.userDetails?.accessToken));
        dispatch(setuserdetials(responseData?.data?.ownerDetails));
        toast.success(`login successfully`);
        setSubmitLoader(false)
      }

      navigator("/login")
    } catch (error) {
    } finally {
      setSubmitLoader(false);
    }
    setSubmitLoader(false);
  };
  const handleResendOTP = async () => {

    try {
      const responseData = await postJson("user/resend_otp", { userId: user?.userId });
      toast.success(`OTP resent successfully`);
      setMinutes(0);
      setSeconds(59);
      dispatch(setUser(responseData));
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again later.');


    }
  };
  return (
    <>
      <Layout className="Login_Main">
        <div className='container w-50  m-auto width-container'>
          <div className='row'>
            <div className='col-md-6 pe-md-0'>
              <div className="LoginContianer">
                <h3 className="mt-3">Verification Code</h3>
                <form onSubmit={handleSubmit}>
                  <p className="p3">Enter your Code here</p>
                  <OTPInput
                    value={otp}
                    onChange={(otp) => {
                      setOtp(otp);
                      setError('');
                    }}
                    numInputs={4}
                    renderSeparator={<span> </span>}
                    inputStyle={`inputStyle form-control ${otp.length === 4 && (user?.tmpPassword === otp ? "otp-green" : "otp-red")
                      }`}
                    style={{ color: "red" }}
                    renderInput={(props) => <input {...props} />}
                  />
                  {error && <div className="error mt-1 ms-2">{error}</div>}

                  <div className="d-flex mt-3 justify-content-between">
                    <div className="mt-2"></div>
                  </div>

                  {seconds > 0 || minutes > 0 ? (
                    <p>
                      Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
                      {seconds < 10 ? `0${seconds}` : seconds}
                    </p>
                  ) : (
                    <p onClick={() => handleResendOTP()}>I don't receive a code! please resend</p>
                  )}

                  <div className='text-center'>
                    <button className="loginBtn" type="submit" style={{ marginTop: '20px' }}>
                      {submitLoader ? <Spinner animation="border" size="sm" /> : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-6 ps-md-0">
              <div className="img-box">
                <img src="./assets/images/otp1.webp" className="img-fluid" alt='img'/>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default OtpVerification;
