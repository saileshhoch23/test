import React, { useEffect, useState } from "react";
import { postJson } from "../../Common/api-instance";
import { useDispatch, useSelector } from "react-redux";
import { Input, Layout } from "antd";
import PaginationComponent from "../../Components/Pagnation/pagination";
import { useNavigate } from "react-router-dom";
import { setcateenPyment } from "../../redux/action";
const OfficePyment = () => {
  const user = useSelector((state) => state?.user);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [canteenPymentlist, setCanteenPaymentlist] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    getData();
  }, [searchValue , page , pageSize]);
  const getData = async () => {
    try {
      const payload = {
        canteenId: user?.userId,
        officeName: searchValue,
        pageable:{
          pageno: page,
          pagesize: pageSize,
              }
      };
      const responseData = await postJson(
        "canteen/get_canteen_offices_orders_list",
        payload
      );
      if (responseData && responseData.data) {
        setCanteenPaymentlist(responseData.data);
        setTotalPages(responseData?.pageable?.totalItems)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaginationClick = (pageNum) => {
    setPage(pageNum);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
  };

  const pageSizeOptions = [5, 10, 20, 30, 50, 100];
  return (
    <>
      <Layout className="bg-white p-5">
        <div className="custom_TableWrapper container-fluid  ">
          <div className="d-flex">
            <label className="mt-1">
              <b>Search:</b>
            </label>
            <Input
              className="w-25 ms-2"
              type="text"
              name="searchValue"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <hr />
        </div>
        <div className="row gap-1" >
          {canteenPymentlist?.length > 0 &&
            canteenPymentlist?.map((item, index) => (
              <div className="col-lg-3 col-md-5 col-sm-12   " key={index}>
                <div className="card add-tocart">
                  <div className="card-body" onClick={()=>{navigate(`/canteentransaction/${item?.officeOwnerId}`); 
                     dispatch(setcateenPyment(item))}}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="usre-img-details d-flex align-items-center justify-content-between">
                        <div className="user-img me-3">
                          <img
                            src={item?.companyLogo != "null" ? item?.companyLogo: "assets/images/user-img.png"}
                            className="img-fluid"
                            style={{height:"50px"}}
                            alt="img"
                          />
                        </div>
                        <div className="user-details">
                          <h5 className="mb-0 text-black">
                            {item?.officeNo} {item?.officeName}
                          </h5>
                          <p className="mb-0">{item?.buildingName}</p>
                        </div>
                      </div>
                      <div className="more-btn d-flex align-items-center justify-content-between">
                        {item?.totalAmount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <PaginationComponent
          totalPages={Math.ceil(totalPages / pageSize)}
          handlePaginationClick={handlePaginationClick}
          pageSizeOptions={pageSizeOptions}
          pageSize={pageSize}
          handlePageSizeChange={handlePageSizeChange}
          page={page}
        />
      </Layout>
    </>
  );
};

export default OfficePyment;
