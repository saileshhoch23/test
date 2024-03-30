
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Common/common.css'
import Dashboard from './Pages/Dashboard/dashboard';
import { Outlet, BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Sidebar from './Components/Sidebar/sidebar';
import Building from './Pages/Building/building';
import Office from './Pages/Office/office';
import Canteen from './Pages/Canteen/canteen';
import NotFound from './Pages/NotFound/NotFound';
import Login from './Pages/Login/login';
import ChnagePassword from './Pages/Password/chnagePassword';
import Subadmin from './Pages/Subadmin/subadmin';
import { PrivetRoute, PublicRoute } from './Pages/routes/routes';
import Subadminlist from './Pages/user/subadminlist';
import ForgotPassword from './Pages/Password/forgotPassword';
import { useSelector } from 'react-redux';
import Otpvarfaction from './Pages/Otpvarifaction/otpvarfaction';
import Canteenitem from './Pages/Canteen/canteenitem';
import { useState } from 'react';
import Orderlist from './Pages/Canteen/orderlist';
import Contectus from './Pages/Contectus/contectus';
import 'react-phone-input-2/lib/style.css';
import CanteenOrderList from './Pages/Office/canteenOrderList';
import Orderhistory from './Pages/Office/orderhistory';
import Canteenpayment from './Pages/Office/canteenpayment';
import OfficePyment from './Pages/Canteen/officePyment';
import ReturnOrder from './Pages/Canteen/returnOrder';
import Transaction from './Pages/Office/transaction';
import Adspost from './Pages/Canteen/adspost';
import Serving from './Pages/admin/serving';
import Canteenuser from './Pages/admin/canteenuser';
import Officeuser from './Pages/admin/officeuser';
import Buildinguser from './Pages/admin/buildinguser';
import CanteenOrderhistory from './Pages/Canteen/canteenOrderhistory';
import Catgory from './Pages/admin/catgory';
import Canteentransaction from './Pages/Canteen/canteentransaction';
import Contectlist from './Pages/admin/contectlist';
import Adstemplate from './Pages/admin/adstemplate';
import Paymentalltransaction from './Pages/admin/paymentalltransaction';
import Paymenttransactions from './Pages/Office/paymenttransactions';
import OrderlistAdmin from './Pages/admin/orderlistAdmin';
import ReturnorderList from './Pages/admin/returnorder';
import Check from './Pages/Office/check';
import EmailTemplate from './Pages/admin/configuration/emailtemplate';
import Notifications from './Pages/admin/configuration/notifcation/notifcation';
import Sendnotifcation from './Pages/admin/configuration/sendNotifcation/sendnotifcation';

function App() {
  const user = useSelector(state => state?.user)
  const AppOutLet = () => {
    const [toggel, Settoggle] = useState(false)
    return (
      <>
        <Sidebar toggel={toggel} Settoggle={Settoggle} />
        <div className='main-content p-3' style={!toggel ? { left: '78px', width: 'calc(100% - 78px)' } : { left: '315px', width: 'calc(100% - 315px)' }}>
          <Outlet />
        </div>
      </>
    )
  }
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PrivetRoute><AppOutLet /></PrivetRoute>}>
            <Route exact path="" element={<Dashboard />} />

            {user?.userType === "ADMIN" && (
            <>
              <Route exact path="/subadmin" element={<Subadmin />} />
              <Route exact path="/buildinguser" element={<Buildinguser />} />
              <Route exact path="/canteenuser" element={<Canteenuser />} />
              <Route exact path="/officeuser" element={<Officeuser />} />
              <Route exact path="/category" element={<Catgory />} />
              <Route exact path="/serving" element={<Serving />} />
              <Route exact path="/subadminlist" element={<Subadminlist />} />
              <Route exact path="/adstemplate" element={<Adstemplate />} />
              <Route exact path="/contectlist" element={<Contectlist />} />
              <Route exact path="/paymenttransaction" element={<Paymentalltransaction />} />
              <Route exact path="/orderlistadmin" element={<OrderlistAdmin />} />
              <Route exact path="/returnorderlist" element={<ReturnorderList />} />
              <Route exact path="/notifications" element={<Notifications />} />
              <Route exact path="/sendnotifcation" element={<Sendnotifcation />} />
            </>)}
            {user?.userType === "CANTEEN" && (
              <>
                <Route exact path="/canteenitem" element={<Canteenitem />} />
                <Route exact path="/orderlist" element={<Orderlist />} />
                <Route exact path="/officepayment" element={<OfficePyment />} />
                <Route exact path="/returnorder" element={<ReturnOrder />} />
                <Route exact path="/returnorderDelver" element={<CanteenOrderhistory />} />
                <Route exact path="/adspost" element={<Adspost />} />
                <Route exact path="/canteentransaction/:id" element={<Canteentransaction />} />
                <Route exact path="/paymenttransactions" element={<Paymenttransactions />} />
                <Route exact path="/contectus" element={<Contectus />} />
              </>
            )}
            {user?.userType === "USER" && (
              <>
                <Route exact path="/officeuser" element={<Office />} />
                <Route exact path="/canteenordelist" element={<CanteenOrderList />} />
                <Route exact path="/orderhistory" element={<Orderhistory />} />
                <Route exact path="/canteenpayment" element={<Canteenpayment />} />
                <Route exact path="/transaction/:id" element={<Transaction />} />
                <Route exact path="/payment" element={<Paymenttransactions />} />
                <Route exact path="/check" element={<Check />} />
                <Route exact path="/contectus" element={<Contectus />} />
               

              </>
            )}
          </Route>
          <Route exact path="otpvarefaction" element={<Otpvarfaction />} />
          <Route exact path="chnagepassword" element={<PrivetRoute><ChnagePassword /></PrivetRoute>} />
          <Route exact path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route exact path="/forgotpassword" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route exact path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
