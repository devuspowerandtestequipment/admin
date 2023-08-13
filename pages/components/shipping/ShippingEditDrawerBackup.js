import React, { useState, useEffect, useRef } from "react";
import { Drawer, Button, message } from "antd";
import { connect } from "react-redux";
import { SaveOutlined, EditOutlined } from "@ant-design/icons";
import { Form } from "semantic-ui-react";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import {fetchShipping} from '../../../store/actions'

export const ShippingEditDrawer = (props) => {
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  const [data, setData] = useState({
    name: "",
    desc: "",
    time: "",
    fetchShippingpercentage: 0,
    amount:0,
    type:'1',
    status: "Active",
  });


  useEffect(()=>{
    setData(props.data)
  },[props])

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  function handleUpdate(e) {

    setData((previousState) => {
        return { ...previousState, [e.target.name]: e.target.value };
      });
  }


  const handleSubmit = () => {
    // const formValid = simpleValidator.current.allValid();
    // if (!formValid) {
    //   simpleValidator.current.showMessages();
    //   forceUpdate(1);
    // } else {

    //     console.log(data)

    //   setLoading(true)
    //   axios.post(`${process.env.backendURL}/shipping/update`,data)
    //   .then(response=>{
    //     if(response.data.response){
    //       setLoading(false)
    //       props.fetchShipping();
    //       setVisible(false);
    //       message.success('Success');
    //     }
    //   })
    // }
    setLoading(true)
    axios.post(`${process.env.backendURL}/shipping/update`,data)
      .then(response=>{
        if(response.data.response){
          setLoading(false)
          props.fetchShipping();
          setVisible(false);
          message.success('Success');
        }
      })
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<EditOutlined />}>
        Edit
      </Button>
      <Drawer
        title="Edit Shipping"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <Form onSubmit={handleSubmit}>
        <Form.Input
            fluid
            label="Name"
            placeholder=""
            name="name"
            value={data.name}
            onChange={handleUpdate}
            required
          />

      <Form.Input
            fluid
            label="Description"
            placeholder=""
            name="desc"
            value={data.desc}
            onChange={handleUpdate}
          />

<Form.Input
            fluid
            label="Description"
            placeholder="Shipping Time"
            name="time"
            value={data.time}
            onChange={handleUpdate}
     
          />


          <Form.Field
            label="Type"
            control="select"
            name="type"
            value={data.type}
            onChange={handleUpdate}
            required
          >
            <option value="2">Amount</option>
            <option value="1">Percentage</option>
          </Form.Field>


          {data.type==='1'
          ?
          <>
          <Form.Input
            fluid
            type='number'
            label="Percentage"
            placeholder="Tax Percentage"
            name="percentage"
            value={data.percentage}
            onChange={handleUpdate}
            required
          />
          </>
          :
          <>
          <Form.Input
            fluid
            type='number'
            label="Amount"
            placeholder="Amount"
            name="amount"
            value={data.amount}
            onChange={handleUpdate}
            required
          />
          </>
          }



          {/* <Form.Field
            label="Status"
            control="select"
            name="status"
            value={data.status}
            onChange={handleUpdate}
          >
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </Form.Field>
          <span className="myerrormessage">
            {simpleValidator.current.message(
              "status",
              data.status,
              "required"
            )}
          </span> */}
          <Button type="primary" htmlType="submit" onClick={showDrawer} icon={<SaveOutlined />}  loading={loading}>
             Update
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({});


export default connect(mapStateToProps, {fetchShipping})(ShippingEditDrawer);
