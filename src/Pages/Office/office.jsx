import {  Input, Layout, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { post, postJson } from "../../Common/api-instance";
import { useDispatch, useSelector } from "react-redux";
import { setAddCanteen,  setAddcatgory, setCanteenCount, setRemovecart } from "../../redux/action";
import toast from "react-hot-toast";
import { Spinner } from "react-bootstrap";

const Office = () => {
  const userOffice = useSelector((state)=> state?.user)
  const Canteen = useSelector((state)=> state?.cateen)
  const addtocart = useSelector(state => state?.count)
  const userData = useSelector(state => state?.userdata)
  const [searchValue, setSearchValue] = useState("");
  const Catgory = useSelector((state)=> state?.catgory)
  const [selectCanteen, setSelectCanteen] = useState(Canteen?.canteenId ? Canteen?.canteenId:"");
  const [selectCategory, setselectCategory] = useState(Catgory?.categoryId ? Catgory?.categoryId:"");
  const [canteenList, setCanteenList] = useState([]); 
  const [category, setCategory] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [page, Setpage] = useState(1);
  const [pagesize, Setpagesize] = useState(10);
  const [totaldata,setTotaldata] = useState();
  const [user, setUser] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [coadingCount, setLoadingCount] = useState(false);
  const dispatch = useDispatch();
  const columns = [
    {
        title: "Id",
        dataIndex: "canteenMenuId",
    },
    {
        title: "Image ",
        dataIndex: "imagePath",
        render: (imagePath) => (
            <>
                <img
                    src={imagePath}
                    alt="Canteen Item"
                    style={{ width: 50, height: 50 }}
                />
            </>
        ),
    },
    {
        title: "MenuItem Name",
        dataIndex: "canteenMenuItemName",
    },
    {
        title: "Discounted ",
        dataIndex: "addDiscount",
    },
    {
        title: "Discounted Type",
        dataIndex: "discountType",
    },
    {
        title: "MenuItem Price",
        dataIndex: "canteenMenuItemPrice",
    },
    {
        title: "Serving Type",
        dataIndex: "servingType",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        const filteredCartItems =
          cardData?.cartDtoList?.filter(
            (item) => item.canteenMenuID === record.canteenMenuId
          ) || [];
        const totalCartItemQty = filteredCartItems.reduce(
          (acc, curr) => acc + curr.cartItemQty,
          0
        );
        return (
          <div key={record.canteenMenuId} className="more-btn  d-flex align-items-center justify-content-between">
            <button
              className="btn btn-outline-dark"
              onClick={() => handleAddToCart(record)}
              disabled={coadingCount}
            >
              +
            </button>{" "}
            {coadingCount &&  totalCartItemQty > 0 ? <Spinner  animation="border" size="sm" /> :      totalCartItemQty > 0 ? totalCartItemQty :null}
          { totalCartItemQty > 0 && <button
              className="btn btn-outline-dark"
              onClick={() => handleRemoveFromCart(record)}
              disabled={coadingCount}
            >
              -
            </button>}
          </div>
        );
      },
    }
];

const handleRemoveFromCart = async (record) => {

  setLoading(true);
  try {
    const filteredCartItem = cardData?.cartDtoList?.find(
      (item) => item.canteenMenuID === record.canteenMenuId
    );
    

    const cartItemQty = (filteredCartItem?.cartItemQty || 0) - 1;

    const responseData = await postJson("cart/save_cart_item", {
      cartItemQty,
      canteenMenuID: record?.canteenMenuId,
      userID: userOffice.userId,
      canteenID: record?.canteenId,
    });
    if (responseData.status == 200) {
      setLoading(false);
      toast.success("Item added to cart successfully");
    }
    getCardData(); 
    // getDataCanteen();
  } catch (error) {
    console.error(error);
    toast.error("Error adding item to cart");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
if(user?.userType=="USER"  && selectCanteen){
  getCardData();
}
}, [selectCanteen,addtocart]);

const getCardData = async () => {
  try {
    setLoadingCount(true)
    const responseData = await postJson("cart/get_cart_detail_by_user", {
      userID: userOffice?.userId,
      canteenID: selectCanteen,
      cartItemName:""
    });


    if (responseData && responseData?.data) {
    setCardData(responseData?.data)
    setLoadingCount(false)
    dispatch(setCanteenCount(responseData?.data?.cartDtoList?.length))
  }
  if(responseData.status === "404"){
    setCardData({})
    setLoadingCount(false)
    dispatch(setCanteenCount(0))
  }

  } catch (error) {
    dispatch(setCanteenCount(""))
    console.error(error);
  }
};


const handleAddToCart = async (record) => {
  setLoading(true);
  try {
    const filteredCartItem = cardData?.cartDtoList?.find(
      (item) => item.canteenMenuID === record.canteenMenuId
    );
  
    const cartItemQty = (filteredCartItem?.cartItemQty || 0) + 1;

    const responseData = await postJson("cart/save_cart_item", {
      cartItemQty,
      canteenMenuID: record?.canteenMenuId,
      userID: userOffice.userId,
      canteenID: record?.canteenId,
    });
    getCardData(); 
    // getDataCanteen();
    if (responseData.status == 200) {
      setLoading(false);
      toast.success("Item added to cart successfully");
 
    }
  } catch (error) {
    console.error(error);
    toast.error("Error adding item to cart");
  } finally {
    setLoading(false);
  }
};


  const dataSource = user?.map((item) => ({
    key: item.canteenMenuId,
  
    addDiscount: item.addDiscount,
    discountType: item.discountType,
    canteenMenuId: item.canteenMenuId,
    canteenMenuItemName: item.canteenMenuItemName,
    canteenMenuItemPrice: item.canteenMenuItemPrice,
    imagePath: item.imagePath,
    discountedPrice: item.discountedPrice,
    servingType: item.servingType,
    categoryId: item.categoryId.categoryId,
    categoryName: item.categoryId.categoryName,
    isActive: item.categoryId.isActive,
    isActive: item.canteenId.isActive,
    canteenId: item.canteenId.canteenId,
    canteenOwnerName: item.canteenId.canteenOwnerName,
    isActive: item.isActive,
  }));
  useEffect(() => {
    getData();
    getDataCanteen();
    getCategory();
  },[selectCanteen,page,pagesize,selectCategory,searchValue]);
  const { Option } = Select;
  const onChange = ( value,event) => {
    setSelectCanteen(value);
    dispatch(setAddCanteen(event.id))

  };
  const onChange1 = ( value,event) => {
    setselectCategory(value);
    dispatch(setAddcatgory(event.id))

  };

  const getData = async () => {
    try {
      setLoading(true);
      const responseData = await postJson("canteen/get_canteen_by_building_name",{
        buildingName:userData.buildingName
      });
      if (responseData && responseData.data) {
        setLoading(false);
        setCanteenList(responseData?.data);

      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  const getCategory = async () => {
    try {
      setLoading(true);
      const responseData = await postJson("category/get_all_category");
      setLoading(false);
      if (responseData && responseData.data) {
        setCategory(responseData.data);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  const getDataCanteen = async () => {
    try {
      const payload = {
        canteenId:selectCanteen,
        categoryId:selectCategory,
        canteenMenuItemName:searchValue,
        page:page,
       pageSize:pagesize
      }
      setLoading(true);
      const responseData = await postJson(
        "canteen/get_canteen_menu_list_by_category_id_web",payload
      );
      setLoading(false);
     if(responseData && responseData.data) {
        setUser(responseData.data.content);
        setTotaldata(responseData.data.totalElements)
      } 
   
    } catch (error) {
      dispatch(setCanteenCount("")) 

      setUser([]);
      setTotaldata()
      setLoading(false);
    }
  };

  return (
    <>
      <Layout className="bg-white p-5">
        <div className="container-fluid p-0 d-flex justify-content-between customers_header">
          <div className="d-flex w-100">
            
          <div  className="d-flex me-2">
            <label className="mt-1">
             Search:
            </label>
            <Input
              className="w-100 ms-2"
              type="text"
              name="searchValue"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
            <label> canteen:</label>
            <Select
              value={selectCanteen}
              className="w-25"
              showSearch
              optionFilterProp="children"
              onChange={onChange}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {canteenList.length > 0 &&
                canteenList.map((item) => (
                  <Option value={item?.canteenId} id={item}>{item?.canteenName}</Option>
                ))}
            </Select>
            <label className="ms-2"> Category:</label>
            <Select
              value={selectCategory}
              className="w-25"
              showSearch
              optionFilterProp="children"
              onChange={onChange1}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
               <Option value="">All</Option>
              {category.length > 0 &&
                category.map((item) => (
                  <Option value={item?.categoryId} id={item}>{item?.categoryName}</Option>
                ))}
            </Select>

          </div>
        </div>
        <div className="custom_TableWrapper container-fluid  ">
          <div className="d-flex"></div>
          <hr />
        </div>
        <div>
          <Table
            columns={columns}
            loading={loading}
            dataSource={dataSource}
            scroll={{ x: 1000 }}
            pagination={{
              total: totaldata,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 25, 100],
              onChange: (page, pagesize) => {
                Setpage(page);
                Setpagesize(pagesize);
              },
            }}
          />
        </div>
      </Layout>
    </>
  );
};

export default Office;
