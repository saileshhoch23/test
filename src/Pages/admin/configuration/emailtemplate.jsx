import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Button, Table, Layout, Input, Modal, Row, Col, Select } from "antd";
import { Spinner } from "react-bootstrap";
import { postJson } from '../../../Common/api-instance';
const EmailTemplate = () => {
    const [visible, setVisible] = useState(false);
    const [isEdit, setisEdited] = useState(false);
    const [page, Setpage] = useState(0);
    const [pagesize, Setpagesize] = useState(10);
    const [emailData, setEmailData] =  useState([])
    const [totaldata, setTotaldata] = useState()
    const [searchValue, setSearchValue] = useState("");
    const [modalData, setModalData] = useState({} );

    const [mode, setMode] = useState("html");
    const [htmlContent, setHtmlContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const handleModeChange = (event) => {
        setMode(event.target.value);
    }
      
    
      const handleHtmlChange = (event) => {
        setHtmlContent(event.target.value);
      };
      const modalHandleforEdit = (record, isEdit) => {
        setisEdited(isEdit);
        setVisible(true);
       
        setMode("html");
      
        setModalData(record);
      };
      const { Option } = Select;
     
  const columns = [
    {
      title: "Id",
      dataIndex: "emailtempleteid",
      sorter: {
        compare: (a, b) =>
          a?.emailtempleteid?.localeCompare(b?.emailtempleteid),
        multiple: 1,
      },
    },
    {
      title: "Tamplate Name",
      dataIndex: "title",
      sorter: {
        compare: (a, b) => a?.title?.localeCompare(b?.title),
        multiple: 1,
      },
      onCell: (record) => {
        return {
          onClick: () => {
            modalHandleforEdit(record, true);
          },
        };
      },
      className: "hasFormHover",
    },
    // {
    //   title: "Email Body",
    //   dataIndex: "description",
    //   ellipsis: true,
    //   width: 300,
    //   sorter: {
    //     compare: (a, b) => a?.description?.localeCompare(b?.description),
    //     multiple: 1
    //   },
    // },
    {
      title: "Subject",
      dataIndex: "subject",
      sorter: {
        compare: (a, b) => a?.subject?.localeCompare(b?.subject),
        multiple: 1,
      },
    },
    {
      title: "From Name ",
      dataIndex: "from_name",
      sorter: {
        compare: (a, b) => a?.from_name?.localeCompare(b?.from_name),
        multiple: 1,
      },
    },
    {
      title: "From Email",
      dataIndex: "from_email",
      sorter: {
        compare: (a, b) => a?.from_email?.localeCompare(b?.from_email),
        multiple: 1,
      },
    },
    {
      title: "CC",
      dataIndex: "cc",
      sorter: {
        compare: (a, b) => a?.cc?.localeCompare(b?.cc),
        multiple: 1,
      },
    },
    // {
    //   title: "Bcc",
    //   dataIndex: "bcc",
    //   sorter: {
    //     compare: (a, b) => a?.bcc?.localeCompare(b?.bcc),
    //     multiple: 1
    //   },
    // },
    // {
    //   title: "Created By",
    //   dataIndex: "createdBy",
    //   sorter: {
    //     compare: (a, b) => a?.createdBy?.localeCompare(b?.createdBy),
    //     multiple: 1
    //   },
    // },
    {
      title: "Created On",
      dataIndex: "createdOn",
      sorter: {
        compare: (a, b) => a?.createdOn?.localeCompare(b?.createdOn),
        multiple: 1,
      },
    },
    {
      title: "Modified On",
      dataIndex: "modifiedOn",
      sorter: {
        compare: (a, b) => a?.modifiedOn?.localeCompare(b?.modifiedOn),
        multiple: 1,
      },
    },
    // {
    //   title: "Modified by",
    //   dataIndex: "modifiedBy",
    //   sorter: {
    //     compare: (a, b) => a?.modifiedBy?.localeCompare(b?.modifiedBy),
    //     multiple: 1
    //   },
    // },
    {
      title: "Is Active",
      dataIndex: "isActive",
      sorter: {
        compare: (a, b) => a?.isActive?.localeCompare(b?.isActive),
        multiple: 1,
      },
    },
  ];
  const dataSource = emailData.map((item) => ({
    key: item?.emailtempleteid,
    emailtempleteid: item?.emailtempleteid,
    title: item?.title,
    description: item?.description,
    subject: item?.subject,
    from_name: item?.from_name,
    from_email: item?.from_email,
    cc: item?.cc,
    bcc: item?.bcc,
    createdBy: item?.createdby ?? "",
    createdOn: moment(item?.createdon).format("DD/MM/YYYY") ?? "",
    modifiedBy: item?.modifiedby ?? "",
    modifiedOn: moment(item?.modifiedon).format("DD/MM/YYYY") ?? "",
    isActive: item?.isactive === "Y" ? "Active" : "In-Active",
  }));
  const getEmailData = async () => {
    try {
        
    
    setLoading(true);
    const payload = {
      isactive: "",
      pageable: {
        pageno: page,
        pagesize: pagesize,
        filtertext: `emailtempleteid like '%${searchValue}%' OR bcc like '%${searchValue}%' OR cc like '%${searchValue}%' OR description like '%${searchValue}%' OR from_email like '%${searchValue}%' OR from_name like '%${searchValue}%' OR title like '%${searchValue}%' OR subject like '%${searchValue}%' OR isactive like '%${searchValue.toLowerCase() == "active" ? "Y" : searchValue.toLowerCase() == "in-active" ? "N": searchValue }%'`,
      },
    };
    const responseData = await postJson(
        "email/getemailtemplete",payload
      );
      setLoading(false);
     if(responseData && responseData.data) {
   
        setTotaldata(responseData.pageable.totalItems)
      } 
   
    } catch (error) {


    //   setUser([]);
      setTotaldata()
      setLoading(false);
    }
  }

  useEffect(()=>{
    getEmailData()
  },[])
  return (
    <>
    <Layout className="custom_MainBackground">
    <div className="container-fluid p-0 d-flex justify-content-between customers_header">
      <h4>Email Tamplate</h4>
      <div className="d-flex">
            
            <Button
              type="primary"
              className="custom_activeInactive_btn"
              onClick={() => setVisible(true)}
            >
              Add New
            </Button>
          </div>
    </div>
    <div className="custom_TableWrapper container-fluid">
      <div className="d-flex">
        <label className="mt-1">
          <b>Search:</b>
        </label>
        <Input
          className="w-50 ms-2"
          type="text"
          defaultValue={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
      </div>
      <hr />
      <Table
        className="custom_table"
        // rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
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
  <Modal
    footer={false}
    title="Email"
    centered
    visible={visible}
    onOk={() => {

      setVisible(false);
    }}
    onCancel={() => {

      setVisible(false);
    }}
    width={700}
  >
    <Row className="Row-Height" gutter={[10, 10]}>
      <form >
        <Col>
          <Row>
            <Col span={24}>
              <label className="inputLabel">Email Tamplate Id *</label>
              <Input
                name="emailtempleteid"
                id="emailtempleteid"
                // disabled={isEdit}
                // onChange={handleChange}
                // value={emailtempleteid}
              />
             
            </Col>
            <Col span={24}>
              <label className="inputLabel">Tamplate Name *</label>
              <Input
                name="title"
                id="title"
                // onChange={handleChange}
                // value={title}
              />
             
            </Col>
            <Col span={24}>
              <label className="inputLabel">Subject *</label>
              <Input
                name="subject"
                id="subject"
                // onChange={handleChange}
                // value={subject}
              />
            
            </Col>
            <Col span={24}>
              <label className="inputLabel">From Name *</label>
              <Input
                name="from_name"
                id="from_name"
                // onChange={handleChange}
                // value={from_name}
              />
            
            </Col>
            <Col span={24}>
              <label className="inputLabel">From Email *</label>
              <Input
                name="from_email"
                id="from_email"
                // onChange={handleChange}
                // value={from_email}
              />
              
            </Col>
            <Col span={24}>
              <label className="inputLabel">cc</label>
              <Input
                name="cc"
                id="cc"
                // onChange={(e) => setCC(e.target.value)}
                // value={cc}
              />
            </Col>
            <Col span={24}>
              <label className="inputLabel">bcc</label>
              <Input
                name="bcc"
                id="bcc"
                // onChange={(e) => setBCC(e.target.value)}
                // value={bcc}
              />
            </Col>
            <Col span={24}>
              <label className="inputLabel">Email Body *</label>
              <div className="row mt-1">
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="body"
                      id="htmlArea"
                      value="html"
                      checked={mode === "html"}
                      onChange={handleModeChange}
                    />
                    <label
                      className="form-check-label cursor-pointer"
                      htmlFor="htmlArea"
                    >
                      Html
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="body"
                      id="preview"
                      value="preview"
                      checked={mode === "preview"}
                      onChange={handleModeChange}
                    />
                    <label
                      className="form-check-label cursor-pointer"
                      htmlFor="preview"
                    >
                      Preview
                    </label>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={24}>
              <div className="row">
                <div className="col-12">
                  {mode === "preview" && (
                    <div className="card p-0 htmlPreview">
                      <div
                        className="card-body"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                      />
                    </div>
                  )}

                  {mode === "html" && (
                    <textarea
                      value={htmlContent}
                      rows={8}
                      cols={50}
                      className="form-control"
                      onChange={handleHtmlChange}
                    />
                  )}
                  {/* {errors?.htmlContent && !htmlContent ? (
                    <span className="error">{errors?.htmlContent}</span>
                  ) : null} */}
                </div>
              </div>
            </Col>
            <Col span={24}>
              <label className="inputLabel">Status *</label> <br />
              <Select
                // value={isactive}
                className="w-100"
                showSearch
                optionFilterProp="children"
                // onChange={onChange}
                // filterOption={(input, option) =>
                  
                //     .toLowerCase()
                //     .includes(input.toLowerCase())
                // }
              >
                <Option value="Y">Active</Option>
                <Option value="N">Inactive</Option>
              </Select>
           
            </Col>
          </Row>
        </Col>
        <Col span={24} className="mt-4 p-0">
          <Button
            type="primary"
            htmlType="submit"
            className="custom_activeInactive_btn"
          >
            {submitLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Save"
            )}
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setVisible(false);
            }}
            className="custom_activeInactive_btn"
          >
            Cancel
          </Button>
        </Col>
      </form>
    </Row>
  </Modal>
  </>
  )
}

export default EmailTemplate