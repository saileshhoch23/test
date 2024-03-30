import React, { useEffect, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { postJson } from "../../Common/api-instance";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import './office.css';
import { setCanteenCount } from "../../redux/action";
import { Spinner } from "react-bootstrap";
import { Input } from "antd";


const Addtocart = (props) => {
  const user =  useSelector((state)=> state.user );
  const CanteenId =  useSelector((state)=> state?.cateen )
  const [cardData, setCardData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingamount, setLoadingamount] = useState(false);
  const [lodingDesbels, setLodingDesbels] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const  dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    if(user?.userType=="USER" && CanteenId){
    getData();
  }
  }, [props?.showWebOC]);
  useEffect(() => {
 
    if (cardData?.data?.cartDtoList) {
      let count = 0;
      cardData.data.cartDtoList.forEach(item => {
        count += item.cartItemQty || 0;
      });
      setTotalCount(count);
    }
  }, [cardData]);

  const getData = async () => {
    setLodingDesbels(true)
    try {
      const responseData = await postJson("cart/get_cart_detail_by_user", {
        userID: user?.userId,
        canteenID: CanteenId?.canteenId || "",
        cartItemName:searchValue
      });

      if (responseData && responseData.data) {
        setCardData(responseData)
        setLodingDesbels(false)
        setTotalCount(0)
        dispatch(setCanteenCount(responseData?.data?.cartDtoList?.length))
      }
      if(responseData.status === "404"){
        setCardData({})
        dispatch(setCanteenCount(0))
        setLodingDesbels(false)
      }

    } catch (error) {
      setLodingDesbels(false)
      console.error(error);
    }
  };

  const handleRemoveFromCart = async (record) => {
    setLoading(true);
    try {
      const filteredCartItem = record?.cartItemQty
      
  
      const cartItemQty = (filteredCartItem || 0) - 1;
  
      const responseData = await postJson("cart/save_cart_item", {
        cartItemQty,
        canteenMenuID: record?.canteenMenuID,
        userID: user.userId,
       canteenID: CanteenId?.canteenId,
      });
      getData()
      if (responseData.status == 200) {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (record) => {
  
    setLoading(true);
    try {
      const filteredCartItem = record?.cartItemQty
    
      const cartItemQty = (filteredCartItem || 0) + 1;
  
      const responseData = await postJson("cart/save_cart_item", {
        cartItemQty,
        canteenMenuID: record?.canteenMenuID,
        userID: user.userId,
       canteenID: CanteenId?.canteenId,
      });
      getData();
      if (responseData.status == 200) {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOrderConforime = async () => {
    setLoadingamount(true);
    setLodingDesbels(true)
    try {
      const responseData = await postJson("order/create_order", {
        userId: user.userId,
        canteenId: CanteenId?.canteenId,
       orderId:null
      });
      getData();
      setTotalCount(0);
      setLodingDesbels(false)
      if (responseData.status == 200) {
        setLoadingamount(false);
        setLodingDesbels(false)
      }
    } catch (error) {
      console.error(error);
      setLodingDesbels(false)
    } finally {
      setLoadingamount(false);
      setLodingDesbels(false)
    }
  };

  return (
    <>
      <Offcanvas
        placement="end"
        className="gradient-bg text-white"
        show={props?.showWebOC}
        onHide={props?.handleCloseWebOC}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="black">Add to Cart</Offcanvas.Title>
         
        </Offcanvas.Header>
        <Offcanvas.Body className="sidemenu-item pe-0">
        <div className="container">
        <div className="custom_TableWrapper container-fluid  ">
          <div className="d-flex">
            <label className="mt-1 black">
              <b>Search:</b>
            </label>
            <Input
              className="w-100 ms-2"
              type="text"
              name="searchValue"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <hr />
        </div>

          {cardData?.data?.cartDtoList?.map((item,index)=>(
          <div className="card add-tocart mt-3" key={index}>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="usre-img-details d-flex align-items-center justify-content-between">
                    <div className="user-img me-3">
                      <img
                        src={item.itemImagePath}
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                    <div className="user-details">
                      <h5 className="mb-0 text-black">{item.cartItemName}</h5>
                      <p className="mb-0">₹{item.cartItemPrice}</p>
                    </div>
                  </div>
                  <div className="more-btn d-flex align-items-center justify-content-between">
                    <button type="button" className="btn btn-outline-dark" onClick={()=>handleRemoveFromCart(item)}  disabled={loading != lodingDesbels }>
                      -
                    </button>
                    {loading ?  <Spinner  animation="border" size="sm"   className="mx-2" /> :<p className="mx-2 text-center mb-0" >{item.cartItemQty}</p>}
                    <button type="button" className="btn btn-outline-dark" onClick={()=>handleAddToCart(item)} disabled={loading != lodingDesbels}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>))}
            <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
              <div className="menu-list2">
                <p className="mb-0 text-black">Subtotal</p>
              </div>
              <div className="menu-total2">
                <p className="mb-0">₹{loading ? <Spinner  animation="border" size="sm"  className="mx-2"/> :cardData?.data?.totalItemPrice}</p>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
              <div className="menu-list2">
                <p className="mb-0">Tax and Fees</p>
              </div>
              <div className="menu-total2">
                <p className="mb-0">₹{loading ? <Spinner  animation="border" size="sm"  className="mx-2" /> :cardData?.data?.totalTax}</p>
              </div>
             
            </div>
            <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
              <div className="menu-list2">
                <p className="mb-0">
                  Total <small>({loading ? <Spinner  animation="border" size="sm"  className="mx-2" /> :totalCount} items)</small>
                </p>
              </div>
              <div className="menu-total2">
                <p className="mb-0">₹{loading ? <Spinner  animation="border" size="sm" /> :cardData?.data?.totalWithTax}</p>
              </div>
            </div>
          </div>


          <div className="mt-5 add-order d-flex justify-content-between align-item-center px-3 py-3">
            <div className="">
            <p className="mb-0 ">
                  Total items <small>{totalCount}.</small>
                </p>
                <h6>₹{cardData?.data?.totalWithTax}</h6>
            </div>
            <div className="">
                <button className="btn  btn-light w-200" type="button" onClick={()=>handleOrderConforime()} >{loadingamount ? <Spinner  animation="border" size="sm"  />:"Confirm"}</button>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Addtocart;
