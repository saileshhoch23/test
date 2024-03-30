import React from 'react'
import './NotFound.css'
import { useNavigate } from 'react-router-dom';
import AppStore from '../../redux/store';


export default function NotFound() {
  const token = AppStore?.store?.getState()?.token;
  const navigate = useNavigate();
  const onClickNext = () => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/");
    }
  };

  return (
    <div>
      <div className="container-xxl">
        <div className="row g-0">
          <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
            <div
              className="w-100 p-3 p-md-5 card border-0 bg-violet text-light"
              style={{ maxWidth: "32rem", marginTop: "80px" }}
            >
              <form className="row g-1 p-3 p-md-4">
                <div className="col-12 text-center mb-1 mb-lg-5">
                  <img
                    src="./assets/images/404.svg"
                    className="img-fluid mb-4"
                    alt="img"
                  />
                  <h5>OOP! PAGE NOT FOUND</h5>
                  <span className="text-light">
                    Sorry, the page you're looking for doesn;t exist. if you
                    think something is brlken, report a problem.
                  </span>
                </div>
                <div className="col-12 text-center">
                  <button
                    onClick={onClickNext}
                    className="btn btn-light text-uppercase"
                  >
                    Back to {token ? "Home" : "Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-center align-items-center rounded-lg auth-h100">
            <div style={{ maxWidth: "25rem" }}>
              <div className="text-center mb-5">
                <svg
                  width="4rem"
                  fill="currentColor"
                  className="bi bi-clipboard-check"
                  viewBox="0 0 16 16"
                >
                  <path
                    className="fill-primary"
                    fillRule="evenodd"
                    d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                  />
                  <path
                    className="fill-primary"
                    d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"
                  />
                  <path
                    className="fill-primary"
                    d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"
                  />
                </svg>
              </div>
              <div></div>
              <div >
                <img src="./assets/images/login-img.svg" alt="login-img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
