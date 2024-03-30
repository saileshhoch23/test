import React, { useEffect,useState } from 'react'
import { MdClose } from "react-icons/md";
import { Modal } from "antd";
import { postJson } from '../../Common/api-instance';
import toast from 'react-hot-toast';
const Editeorder = (props) => {
  const [orderDetailbyid, setOrderDetailbyid] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    if (orderDetailbyid?.orderDetailDtoList) {
      let count = 0;
      orderDetailbyid?.orderDetailDtoList.forEach((item) => {
        count += item.itemQty || 0;
      });
      setTotalCount(count);
    }
  }, [props?.orderDetailbyid]);

  useEffect(() => {
    if(props?.editeData?.orderId){
    getData();
    }
  }, [props?.editeData]);
  const getData = async () => {
    try {
      const payload = {
        orderId: props?.editeData?.orderId,
        canteenId: props?.editeData?.canteenDto?.canteenId,
      };
      const responseData = await postJson("order/get_order", payload);
      if (responseData && responseData?.data) {
        setOrderDetailbyid(responseData?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
      const updateOrder = async (item) => {
        // console.log(first)
        try {
          const responseData = await postJson("order/update_order", {
            orderId: orderDetailbyid?.orderId,
            orderDetailId: item,
          });
          if (responseData) {
            // props?.onClose()
            props.getData();
          }
        } catch (error) {
          console.error(error);
          toast.error(`${error}`);
        } finally {
        }
      };
  return (
    <Modal
    footer={false}
    title="Edite Order"
    centered
    visible={props.editModel}
    onOk={() => {
      props.onClose()
      setOrderDetailbyid({});
      setTotalCount();
    }}
    onCancel={() => {
      props.onClose()
      setTotalCount();
      setOrderDetailbyid({});
    }}
    width={500}
  >
    <form>
      <h5 className="text-center">
        {orderDetailbyid?.officeOwnerDto?.officeName}
      </h5>
      <p className="text-center">
        {orderDetailbyid?.officeOwnerDto?.officeNo}
      </p>
      {orderDetailbyid?.orderDetailDtoList?.map((item, index) => (
        <div className="card add-tocart mt-3" key={index}>
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div className="usre-img-details d-flex align-items-center justify-content-between">
                <div className="user-img me-3">
                  <img
                    src={item?.itemImage}
                    className="img-fluid"
                    alt="img"
                  />
                </div>
                <div className="user-details">
                  <h5 className="mb-0 text-black">{item?.itemName}</h5>
                  <p className="mb-0">Total item ({item?.itemQty})</p>
                </div>
              </div>
              <div className="more-btn d-flex align-items-center justify-content-between">
                <button
                  type="button"
                  className="btn  btn-outline-secondary"
                  onClick={() => updateOrder(item?.orderDetailId)}
                >
                  <MdClose />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1 mt-5">
        <div className="menu-list2">
          <p className="mb-0 text-black">Subtotal</p>
        </div>
        <div className="menu-total2">
          <p className="mb-0">₹{orderDetailbyid?.totalItemPrice}</p>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
        <div className="menu-list2">
          <p className="mb-0">Tax and Fees</p>
        </div>
        <div className="menu-total2">
          <p className="mb-0">₹{orderDetailbyid?.taxAndFees}</p>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between border-bottom pt-1 pb-1">
        <div className="menu-list2">
          <p className="mb-0">
            Total <small>({totalCount} items)</small>
          </p>
        </div>
        <div className="menu-total2">
          <p className="mb-0">₹{orderDetailbyid?.totalWithTax}</p>
        </div>
      </div>

      <div>
        <button
          className="btn w-100 btn-secondary bg-gray mt-5"
          type="button"
          onClick={() => {
            props.onClose()
            setOrderDetailbyid({});
            setTotalCount();
          }}
        >
          Save
        </button>
      </div>
    </form>
  </Modal>
  )
}

export default Editeorder