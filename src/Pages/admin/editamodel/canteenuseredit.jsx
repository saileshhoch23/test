import { Button, Col, Image, Input, Modal, Row } from "antd";
import React from "react";
import "../admin.css";

const Canteenuseredit = (props) => {

  return (
    <Modal
    footer={false}
    title="Canteen user"
    centered
    visible={props?.canteenedit}
    onOk={() => {props?.onClose(); props.onClear();}}
    onCancel={() => {props?.onClose(); props.onClear();}}
    width={600}
>
    <Row gutter={[5, 10]}>
        <Col span={12}>
            <label>Frist Name:</label>
            <Input
                className="form-control"
                name="first_name"
                value={props?.record?.first_name}
                disabled={true}
            />
        </Col>
        <Col span={12}>
            <label>Last Name:</label>
            <Input
                className="form-control"
                name="last_name"
                value={props?.record?.last_name}
                disabled={true}
            />
        </Col>
        <Col span={12}>
            <label>Email:</label>
            <Input
                className="form-control"
                name="last_name"
                value={props?.record?.email}
                disabled={true}
            />
        </Col>
        <Col span={12}>
            <label>Mobile Number:</label>
            <Input
                className="form-control"
                name="last_name"
                value={props?.record?.mobile_number}
                disabled={true}
            />
        </Col>
        <Col span={12}>
            <label>Canteen Name:</label>
            <Input
                className="form-control"
                name="last_name"
                value={props?.record?.name}
                disabled={true}
            />
        </Col>
        <Col span={12}>
            <label>Building Name:</label>
            <Input
                className="form-control"
                name="last_name"
                value={props?.record?.canteen_building_name}
                disabled={true}
            />
        </Col>

        <Col span={12}>
            <label>Building Address:</label>
            <Input
                className="form-control"
                name="last_name"
                value={props?.record?.address1}
                disabled={true}
            />
        </Col>
        <Col span={12}>
            <label>Is Verify:</label>
            <Input
                className="form-control"
                name="last_name"
                value={props?.record?.is_verify}
                disabled={true}
            />
        </Col>
        <Col span={12}>
            <label>Is Full Profile:</label>
            <Input
                className="form-control"
                name="last_name"
                value={props?.record?.is_full_profile}
                disabled={true}
            />
        </Col>
        <Col span={12}>
            <label>Canteen Opening time:</label>
            <Input
                className="form-control"
                name="last_name"
                value={props?.record?.start_time}
                disabled={true}
            />
        </Col>
        <Col span={12}>
            <label>Canteen Closeing time:</label>
            <Input
                className="form-control"
                name="last_name"
                value={props?.record?.end_time}
                disabled={true}
            />
        </Col>
        <Col span={24} >
            <div>
            <label>Canteen Proof:</label>
            </div>
            <Image
                width={200}
                src={`${props?.record?.canteen_proof}?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200`}
                preview={{
                    src: props?.record?.canteen_proof,
                }}
            />
        </Col>
    </Row>
    <Button
        className="mt-3"
        type="primary"
        onClick={() => {props?.onClose(); props.onClear();}}>
        Cancel
    </Button>
</Modal>
  )
}

export default Canteenuseredit