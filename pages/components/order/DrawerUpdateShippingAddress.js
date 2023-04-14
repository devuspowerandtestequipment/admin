import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Drawer,Tooltip, Button, message } from 'antd'
import { AiFillEdit, } from "react-icons/ai";
import { SaveOutlined } from '@ant-design/icons';
import { Form } from 'semantic-ui-react'
import axios from 'axios';

export const DrawerUpdateShippingAddress = (props) => {


  const [formLoader,setFormLoader]=useState(false);
  const [drawer,setDrawer]=useState(false);
  const [dataaddress,setDataAddress]=useState(props.data.user_shipping_address);


  useEffect(()=>{
    setDataAddress(props.data.user_shipping_address)
  },[props])

  const handleChnage=(e)=>{
    setDataAddress({
      ...dataaddress,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit =()=> {

    var tmp_data=props.data;
    tmp_data.user_shipping_address=dataaddress;
    setFormLoader(true);
    axios.post(`${process.env.backendURL}/order/update_order_address`,tmp_data)
    .then(response=>{
        if(response.data.response){
          props.getData();
          message.success('Success');
          setFormLoader(false);
          
        }else{
          alert('Failed');
          setFormLoader(false);
        }
    })

    
  }

  return (
    <>
    <Tooltip title='Edit Billing / Shipping Address'>
        <Button type='primary' size='small' icon={<AiFillEdit />} className='float-right' onClick={()=>setDrawer(true)} />
    </Tooltip>
    <Drawer
        title="Edit Billing / Shipping Address"
        placement="right"
        // closable={false}
        onClose={()=>setDrawer(false)}
        visible={drawer}
        // size='large'
        // style={{width:'900px'}}
        // width={700}
>
        <Form onSubmit={handleSubmit} loading={formLoader}>
          <Form.Input fluid label='Name' name='name' value={dataaddress.name} onChange={handleChnage} placeholder='' required/>
          <Form.Input fluid label='Email' name='email' value={dataaddress.email} onChange={handleChnage} placeholder='' required />
          <Form.Input fluid label='Contact 1' name='phone1' value={dataaddress.phone1} onChange={handleChnage} placeholder='' required />
          <Form.Input fluid label='Contact 2' name='phone2' value={dataaddress.phone2} onChange={handleChnage} placeholder='' required />
          <Form.Input fluid label='Country' name='country' value={dataaddress.country} onChange={handleChnage} placeholder='' required />
          <Form.Input fluid label='State' name='state' value={dataaddress.state} onChange={handleChnage} placeholder='' required />
          <Form.Input fluid label='Town/City' name='towncity' value={dataaddress.towncity} onChange={handleChnage} placeholder='' required />
          <Form.Input fluid label='Zip' name='zip' value={dataaddress.zip} onChange={handleChnage} placeholder='' required />
          <Form.Input fluid label='House Number' name='houseno' value={dataaddress.houseno} onChange={handleChnage} placeholder='' required />
          <Form.Input fluid label='Area/Street' name='areastreet' value={dataaddress.areastreet} onChange={handleChnage} placeholder='' required />
          <Form.Input fluid label='Landmark' name='landmark' value={dataaddress.landmark} onChange={handleChnage} placeholder='' required />
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Update
          </Button>
        </Form>
    </Drawer>
    </>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerUpdateShippingAddress)