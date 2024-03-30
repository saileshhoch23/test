import React, { useEffect, useState } from 'react'
import { postJson } from '../../Common/api-instance';
import { Button, Input, Layout, Table } from 'antd';
import { EditOutlined } from "@ant-design/icons";
import Buldinguseredit from './editamodel/buldinguseredit';

const Buildinguser = () => {
    const [page, Setpage] = useState(0);
    const [pagesize, Setpagesize] = useState(10);
    const [totaldata,setTotaldata] = useState();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [buildingedit, setBuildingEdit] = useState(false);
    const [editerecord, setEditeRecorde] = useState({})
    const columns = [
        {
            title: "Id",
            dataIndex: "user_id",
        },
      
        {
            title: "First name",
            dataIndex: "first_name",
        },
        {
            title: "Last name ",
            dataIndex: "last_name",
        },
        {
            title: "email",
            dataIndex: "email",
        },
        {
            title: "mobile number",
            dataIndex: "mobile_number",
        },
        {
            title: "Is Full Profile",
            dataIndex: "is_full_profile",
        },
        {
            title: "Is Verify",
            dataIndex: "is_verify",
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Role",
            dataIndex: "role",
        },
        {
            title: "Address",
            dataIndex: "address1",
        },
        {
          title: "Actions",
          dataIndex: "actions",
          render: (text, record) => (
            <>
              <Button
            className="gray boderrmove mx-1"
            onClick={() =>{setBuildingEdit(true); setEditeRecorde(record);} }
            icon={<EditOutlined />}
          ></Button>
 
            </>
          ),
        },
    ];
    
    const dataSource = user?.map((item) => ({
        key: item.user_id,
        user_id: item.user_id,
        first_name: item.first_name,
        canteen_proof: item.canteen_proof,
        last_name: item.last_name,
        mobile_number: item.mobile_number,
        email: item.email,
        is_full_profile: item.is_full_profile,
        is_verify: item.is_verify,
        name: item.name,
        role: item.role,
        address1: item.address1,

      
      }));
    useEffect(()=>{
        getData()
    },[page,pagesize])
    const getData = async () => {
        try {
          const payload = {
            mobileNumber:"",
            userId:"",
            firstName:"",
            userType:"OWNER",
            address:"",
            searchText:"",
            isVerify:"",
            pageable: {
              pageno:page,
          pagesize:pagesize,
          filtertext:searchValue?`name like '%${searchValue}%' OR user_id like '%${searchValue}%' OR first_name like '%${searchValue}%'  OR last_name like '%${searchValue}%' OR email like '%${searchValue}%' OR role like  '%${searchValue}%' OR address1 like '%${searchValue}%' OR canteen_building_name like '%${searchValue}%'`:""
        }
          }
          setLoading(true);
          const responseData = await postJson(
            "user/get_all_users_page",payload
          );
          setLoading(false);
         if(responseData && responseData.data) {
            setUser(responseData.data);
            setTotaldata(responseData.pageable.totalItems)
          } 
       
        } catch (error) {
  
    
          setUser([]);
          setTotaldata()
          setLoading(false);
        }
      };
  return (
    <>
    <Layout className="bg-white p-5">
        <div className="container-fluid p-0 d-flex justify-content-between customers_header">
          <div className="w-50">
           
             <h3> Building User</h3>
            <div className="d-flex">
            <label className="mt-1">
             Search:
            </label>
            <Input
              className="w-25 ms-2"
              type="text"
              name="searchValue"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
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
                Setpage(page - 1);
                Setpagesize(pagesize);
              },
            }}
          />
        </div>
      </Layout>
      <Buldinguseredit onClose={()=>setBuildingEdit(false)} buildingedit={buildingedit} record={editerecord}  onClear={()=> setEditeRecorde({})}/>
      </>
  )
}

export default Buildinguser