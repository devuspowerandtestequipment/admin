import React, { useState, useRef } from "react";
import { Drawer, Button, message } from "antd";
import { connect } from "react-redux";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Form } from "semantic-ui-react";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import {fetchShipping} from '../../../store/actions'

export const ShippingCreateDrawer = (props) => {
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  const [data, setData] = useState({
    name: "",
    desc: "",
    time: "",
    percentage: 0,
    amount:0,
    type:"1",
    status: "Active",
  });

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
    setLoading(true)
      axios.post(`${process.env.backendURL}/shipping`,data)
      .then(response=>{
        if(response.data.response){
          setLoading(false)
          setData({
            ...data,
            name: "",
            desc: "",
            time: "",
            percentage: 0,
            amount:0,
            type:"1",
            status: "Active",
          });
          props.fetchShipping();
          setVisible(false);
          message.success('Success');
        }
      })
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        Add
      </Button>
      <Drawer
        title="Category Create"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <Form onSubmit={handleSubmit} >
          <Form.Input
            fluid
            label="Name"
            placeholder="Shipping Name"
            name="name"
            value={data.name}
            onChange={handleUpdate}
            required
          />

          <Form.Input
            fluid
            label="Description"
            placeholder="Shipping Description"
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
            step='any'
            required
          />
          
          </>
          }

          <Button type="primary" htmlType="submit" onClick={showDrawer} loading={loading} icon={<PlusOutlined />}>
             Create
          </Button>
          </Form>
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({});


export default connect(mapStateToProps, {fetchShipping})(ShippingCreateDrawer);
