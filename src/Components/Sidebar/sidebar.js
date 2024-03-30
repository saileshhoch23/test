import React, { useState } from "react";
import "../Sidebar/sidebar.css";
import { FaBars } from "react-icons/fa";
import { AiOutlineUser, AiFillDashboard, AiOutlineAreaChart } from "react-icons/ai";
import { ShoppingCartOutlined } from '@ant-design/icons';
import { CiViewList } from "react-icons/ci";
import { MdHistoryEdu } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { MdOutlinePayment } from "react-icons/md";
import { FaAddressBook } from "react-icons/fa";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoFastFoodSharp } from "react-icons/io5";
import { PiOfficeChairDuotone } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { logout, setCanteenData } from "../../redux/action";
import { Badge, Modal } from "antd";
import Addtocart from "../../Pages/Office/addtocart";
import { postJson } from "../../Common/api-instance";
import toast from "react-hot-toast";
import Officeprofile from "../../Pages/Office/officeprofile";
import CanteenProfile from "../../Pages/Canteen/canteenProfile";
import { FaBuilding } from "react-icons/fa6";
import { MdNotifications } from "react-icons/md";
import { BsFillImageFill } from "react-icons/bs";
export default function Sidebar({ toggel, Settoggle }) {
  const location = useLocation();

  const [visible, setVisible] = useState(false)
  const navigate = useNavigate();
  const user = useSelector(state => state?.user);
  const CanteenDetals = useSelector(state => state?.canteenDetails);


  const addtocart = useSelector(state => state?.count);
  const dispatch = useDispatch();
  const logOut = () => {
    dispatch(logout());
    navigate("/login");
  };
  const [toggles, setToggles] = useState({
    toggel1: true,
    toggel2: true,
    toggel3: true,
    toggel4: true,
    toggel5: true,
    toggel6: true,
    toggel7: true,
    toggel8: true,
    toggel9: true,
    toggel10: true,
    toggel11: true,
    toggel12: true,
    toggel13: true,
    toggel14: true,
    toggel15: true,
    toggel16: true,
    toggel17: true,
    toggel18: true,
    toggel19: true,
    toggel20: true,
    toggel21: true,
    toggel22: true,
    toggel23: true,
    toggel24: true,
    toggel25: true,
    toggel26: true,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(CanteenDetals?.open ? "Open" : "Close");


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const [showWebOC, setShowWebOC] = useState(false);

  const handleCloseWebOC = () => setShowWebOC(false);
  const handleShowWebOC = () => setShowWebOC(true);
  const toggleSection = (section) => {
    setToggles((prevToggles) => ({
      ...Object.fromEntries(Object.keys(prevToggles).map((key) => [key, key === section ? !prevToggles[key] : true])),

    }));
  };
  let sidebar = document.querySelector(".sidebar");
  let sidebarBtn = document.querySelector(".bx-menu");
  sidebarBtn?.addEventListener("click", () => {
    sidebar?.classList.toggle("close");
  });

  const Canteenactive = async (item) => {
    try {
      const responseData = await postJson("/canteen/update_open_close_canteen_staus", {
        canteenId: user?.userId,
        open: item,
      });

      if (responseData) {
        dispatch(setCanteenData(responseData?.data));
      }
    } catch (error) {
      console.error(error);
      toast.error(`${error}`);
    } finally {

    }
  };

  return (
    <>
      <div className={toggel ? "sidebar" : "sidebar close"}>
        <div className="logo-details">
          <span className="logo_name text-center">
          </span>
        </div>
        <ul className="nav-links pt-0">
          <li className={toggles?.toggel1 ? "" : "active showMenu"}>
            <Link
              to="/"
              className={`${location.pathname === "/" ? "active-sidbar" : ""}`}
            >
              <AiFillDashboard className="bx bx-grid-alt" onClick={() => { toggleSection("toggel1") }} />
              <span className="link_name">Dashboard</span>
            </Link>
          </li>
          {user?.userType === "ADMIN" &&(
            <>
            <li className={toggles?.toggel2 ? "" : "active showMenu"}>
              <div className="iocn-link">
                <Link
                  to="/subadminlist"
                  className={`${location.pathname === "/subadminlist" ? "active-sidbar" : ""
                    }`}
                >
                  <AiOutlineAreaChart className="bx" onClick={() => { toggleSection("toggel2") }} />
                  <span className="link_name">Admin userList</span>
                </Link>
              </div>
            </li>
           <li className={toggles?.toggel3 ? "" : "active showMenu"}>
             <div className="iocn-link">
               <Link
                 to="/canteenuser"
                 className={`${location.pathname === "/canteenuser" ? "active-sidbar" : ""
                   }`}
               >
                 <IoFastFoodSharp className="bx" onClick={() => { toggleSection("toggel3") }} />
                 <span className="link_name">Canteen user</span>
               </Link>
             </div>
           </li>
           <li className={toggles?.toggel4 ? "" : "active showMenu"}>
             <div className="iocn-link">
               <Link
                 to="/officeuser"
                 className={`${location.pathname === "/officeuser" ? "active-sidbar" : ""
                   }`}
               >
                 <PiOfficeChairDuotone className="bx" onClick={() => { toggleSection("toggel4") }} />
                 <span className="link_name">Office User</span>
               </Link>
             </div>
           </li>
           <li className={toggles?.toggel5 ? "" : "active showMenu"}>
             <div className="iocn-link">
               <Link
                 to="/buildinguser"
                 className={`${location.pathname === "/buildinguser" ? "active-sidbar" : ""
                   }`}
               >
                 <FaBuilding className="bx" onClick={() => { toggleSection("toggel5") }} />
                 <span className="link_name">Building User</span>
               </Link>
             </div>
           </li>
       
           <li className={toggles?.toggel24 ? "" : "active showMenu"}>
             <div className="iocn-link">
               <Link
                 to="/orderlistadmin"
                 className={`${location.pathname === "/orderlistadmin" ? "active-sidbar" : ""
                   }`}
               >
                 <MdHistoryEdu className="bx" onClick={() => { toggleSection("toggel24") }} />
                 <span className="link_name">order list </span>
               </Link>
             </div>
           </li>
           <li className={toggles?.toggel25 ? "" : "active showMenu"}>
             <div className="iocn-link">
               <Link
                 to="/returnorderlist"
                 className={`${location.pathname === "/returnorderlist" ? "active-sidbar" : ""
                   }`}
               >
                 <CiViewList className="bx" onClick={() => { toggleSection("toggel25") }} />
                 <span className="link_name">Return Order List </span>
               </Link>
             </div>
           </li>
           <li className={toggles?.toggel6 ? "" : "active showMenu"}>
             <div className="iocn-link">
               <Link
                 to="/paymenttransaction"
                 className={`${location.pathname === "/paymenttransaction" ? "active-sidbar" : ""
                   }`}
               >
                 <GrTransaction className="bx" onClick={() => { toggleSection("toggel6") }} />
                 <span className="link_name">Payment Transaction </span>
               </Link>
             </div>
           </li>
           <li className={toggles?.toggel7 ? "" : "active showMenu"}>
             <div className="iocn-link">
               <Link
                 to="/category"
                 className={`${location.pathname === "/category" ? "active-sidbar" : ""
                   }`}
               >
                 <MdOutlinePayment className="bx" onClick={() => { toggleSection("toggel7") }} />
                 <span className="link_name">Category</span>
               </Link>
             </div>
           </li>
           <li className={toggles?.toggel8 ? "" : "active showMenu"}>
             <div className="iocn-link">
               <Link
                 to="/serving"
                 className={`${location.pathname === "/serving" ? "active-sidbar" : ""
                   }`}
               >
                 <AiOutlineAreaChart className="bx" onClick={() => { toggleSection("toggel8") }} />
                 <span className="link_name">serving type</span>
               </Link>
             </div>
           </li>
           <li className={toggles?.toggel9 ? "" : "active showMenu"}>
             <div className="iocn-link">
               <Link
                 to="/adstemplate"
                 className={`${location.pathname === "/adstemplate" ? "active-sidbar" : ""
                   }`}
               >
                 <BsFillImageFill className="bx" onClick={() => { toggleSection("toggel9") }} />
                 <span className="link_name">Template Img</span>
               </Link>
             </div>
           </li>
           <li className={toggles?.toggel15 ? "" : "active showMenu"}>
             <div className="iocn-link">
               <Link
                 to="/notifications"
                 className={`${location.pathname === "/notifications" ? "active-sidbar" : ""
                   }`}
               >
                 <CiViewList className="bx" onClick={() => { toggleSection("toggel15") }} />
                 <span className="link_name">Notifications</span>
               </Link>
             </div>
           </li>
           <li className={toggles?.toggel26 ? "" : "active showMenu"}>
             <div className="iocn-link">
               <Link
                 to="/sendnotifcation"
                 className={`${location.pathname === "/sendnotifcation" ? "active-sidbar" : ""
                   }`}
               >
                 <MdNotifications className="bx" onClick={() => { toggleSection("toggel26") }} />
                 <span className="link_name">send notifcation</span>
               </Link>
             </div>
           </li>
           <li className={toggles?.toggel10 ? "" : "active showMenu"}>
             <div className="iocn-link">
               <Link
                 to="/contectlist"
                 className={`${location.pathname === "/contectlist" ? "active-sidbar" : ""
                   }`}
               >
                 <FaAddressBook className="bx" onClick={() => { toggleSection("toggel10") }} />
                 <span className="link_name">Contect List</span>
               </Link>
             </div>
           </li>
           </> )}


           
          {user?.userType === "USER" &&
            <>
              <li className={toggles?.toggel11 ? "" : "active showMenu"}>
                <div className="iocn-link">
                  <Link
                    to="/officeuser"
                    className={`${location.pathname === "/officeuser" ? "active-sidbar" : ""
                      }`}
                  >
                    <AiOutlineAreaChart className="bx" onClick={() => { toggleSection("toggel11") }} />
                    <span className="link_name">office</span>
                  </Link>
                </div>
              </li>
              <li className={toggles?.toggel12 ? "" : "active showMenu"}>
                <div className="iocn-link">
                  <Link
                    to="/canteenordelist"
                    className={`${location.pathname === "/canteenordelist" ? "active-sidbar" : ""
                      }`}
                  >
                    <CiViewList className="bx" onClick={() => { toggleSection("toggel12") }} />
                    <span className="link_name">Order List</span>
                  </Link>
                </div>
              </li>
              <li className={toggles?.toggel13 ? "" : "active showMenu"}>
                <div className="iocn-link">
                  <Link
                    to="/orderhistory"
                    className={`${location.pathname === "/orderhistory" ? "active-sidbar" : ""
                      }`}
                  >
                    <MdHistoryEdu className="bx" onClick={() => { toggleSection("toggel13") }} />
                    <span className="link_name">Order History</span>
                  </Link>
                </div>
              </li>

              <li className={toggles?.toggel14 ? "" : "active showMenu"}>
                <div className="iocn-link">
                  <Link
                    to="/canteenpayment"
                    className={`${location.pathname === "/canteenpayment" ? "active-sidbar" : ""
                      }`}
                  >
                    <IoFastFoodSharp className="bx" onClick={() => { toggleSection("toggel14") }} />
                    <span className="link_name">Canteen</span>
                  </Link>
                </div>
              </li>
              <li className={toggles?.toggel15 ? "" : "active showMenu"}>
                <div className="iocn-link">
                  <Link
                    to="/payment"
                    className={`${location.pathname === "/payment" ? "active-sidbar" : ""
                      }`}
                  >
                    <MdOutlinePayment className="bx" onClick={() => { toggleSection("toggel15") }} />
                    <span className="link_name">Payment</span>
                  </Link>
                </div>
              </li>
              <li className={toggles?.toggel16 ? "" : "active showMenu"}>
            <div className="iocn-link">
              <Link
                to="/contectus"
                className={`${location.pathname === "/contectus" ? "active-sidbar" : ""
                  }`}
              >
                <FaAddressBook className="bx" onClick={() => { toggleSection("toggel16") }} />
                <span className="link_name">Contect Us</span>
              </Link>
            </div>
          </li>
              <li className={toggles?.toggel25 ? "" : "active showMenu"}>
            <div className="iocn-link">
              <Link
                to="/check"
                className={`${location.pathname === "/check" ? "active-sidbar" : ""
                  }`}
              >
                <FaAddressBook className="bx" onClick={() => { toggleSection("toggel25") }} />
                <span className="link_name">Check</span>
              </Link>
            </div>
          </li>
            </>
          }

          {user?.userType === "CANTEEN" &&
            <>
              <li className={toggles?.toggel17 ? "" : "active showMenu"}>
                <div className="iocn-link">
                  <Link
                    to="/canteenitem"
                    className={`${location.pathname === "/canteenitem" ? "active-sidbar" : ""
                      }`}
                  >
                    <IoFastFoodSharp className="bx" onClick={() => { toggleSection("toggel17") }} />
                    <span className="link_name">Canteen Menu</span>
                  </Link>
                </div>
              </li>
              <li className={toggles?.toggel18 ? "" : "active showMenu"}>
                <div className="iocn-link">
                  <Link
                    to="/orderlist"
                    className={`${location.pathname === "/orderlist" ? "active-sidbar" : ""
                      }`}
                  >
                    <CiViewList className="bx" onClick={() => { toggleSection("toggel18") }} />
                    <span className="link_name">Order List</span>
                  </Link>
                </div>
              </li>
              <li className={toggles?.toggel19 ? "" : "active showMenu"}>
                <div className="iocn-link">
                  <Link
                    to="/returnorderDelver"
                    className={`${location.pathname === "/returnorderDelver" ? "active-sidbar" : ""
                      }`}
                  >
                    <MdHistoryEdu className="bx" onClick={() => { toggleSection("toggel19") }} />
                    <span className="link_name">Delivered List</span>
                  </Link>
                </div>
              </li>
              <li className={toggles?.toggel20 ? "" : "active showMenu"}>
                <div className="iocn-link">
                  <Link
                    to="/returnorder"
                    className={`${location.pathname === "/returnorder" ? "active-sidbar" : ""
                      }`}
                  >
                    <MdOutlinePayment className="bx" onClick={() => { toggleSection("toggel20") }} />
                    <span className="link_name">Returned Order</span>
                  </Link>
                </div>
              </li>
              <li className={toggles?.toggel21 ? "" : "active showMenu"}>
                <div className="iocn-link">
                  <Link
                    to="/officepayment"
                    className={`${location.pathname === "/officepayment" ? "active-sidbar" : ""
                      }`}
                  >
                    <PiOfficeChairDuotone className="bx" onClick={() => { toggleSection("toggel21") }} />
                    <span className="link_name">office </span>
                  </Link>
                </div>
              </li>
              <li className={toggles?.toggel26 ? "" : "active showMenu"}>
                <div className="iocn-link">
                  <Link
                    to="/paymenttransactions"
                    className={`${location.pathname === "/paymenttransactions" ? "active-sidbar" : ""
                      }`}
                  >
                    <MdOutlinePayment className="bx" onClick={() => { toggleSection("toggel26") }} />
                    <span className="link_name">Payment</span>
                  </Link>
                </div>
              </li>
              <li className={toggles?.toggel22 ? "" : "active showMenu"}>
                <div className="iocn-link">
                  <Link
                    to="/adspost"
                    className={`${location.pathname === "/adspost" ? "active-sidbar" : ""
                      }`}
                  >
                    <AiOutlineAreaChart className="bx" onClick={() => { toggleSection("toggel22") }} />
                    <span className="link_name">Ads Post </span>
                  </Link>
                </div>
              </li>
              <li className={toggles?.toggel23 ? "" : "active showMenu"}>
            <div className="iocn-link">
              <Link
                to="/contectus"
                className={`${location.pathname === "/contectus" ? "active-sidbar" : ""
                  }`}
              >
                <FaAddressBook className="bx" onClick={() => { toggleSection("toggel23") }} />
                <span className="link_name">Contect Us</span>
              </Link>
            </div>
          </li>
            </>
          }
          
        </ul>
      </div>
      <section className="home-section">
        <div className="home-content">
          <FaBars
            className="bx bx-menu"
            onClick={() => {
              toggel ? Settoggle(false) : Settoggle(true);
            }}
          />
          <div className="header  p-3  text-end d-flex">
            {user?.userType === "CANTEEN" && (
              <div className='dropdown'>

                <div className={`select ${isOpen ? 'open' : ''} ${selectedOption == "Open" ? "bg-green" : "bg-red"}`} onClick={toggleDropdown}>
                  <div className={`selected ${selectedOption == "Open" ? "bg-green" : "bg-red"}`}>
                    {selectedOption}
                  </div>
                  <div className={`caret ${isOpen ? 'caret-rotate' : ''} ${selectedOption == "Open" ? "bg-green" : "bg-red"}`}></div>
                </div>
                <ul className={`menu ${isOpen ? 'menu-open' : ''}`}>
                  <li onClick={() => { selectOption('Open'); Canteenactive(true) }}>Open</li>
                  <li onClick={() => { selectOption('Close'); Canteenactive(false) }}>Close</li>

                </ul>
              </div>
            )}
            {user?.userType === "USER" && <Badge count={addtocart} offset={[-10, 13]} className=" d-flex align-items-center">

              <button className="btn" type="button" onClick={() => handleShowWebOC()}>
                <ShoppingCartOutlined /></button>
            </Badge>}
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                <AiOutlineUser />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setVisible(true)
                  }}
                >
                  Account
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    logOut()
                  }}
                >
                  loggout
                </Dropdown.Item>

              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </section>
      <Addtocart showWebOC={showWebOC} handleCloseWebOC={handleCloseWebOC} />
      <Modal
        footer={false}
        title=""
        centered
        visible={visible}
        onOk={() => {
          setVisible(false);
        }}
        onCancel={() => {
          setVisible(false);
        }}
        width={500}
      >
        {user?.userType === "USER" && <Officeprofile />}
        {user?.userType === "CANTEEN" && <CanteenProfile />}
      </Modal>
    </>
  );
}
