import { EditOutlined } from '@ant-design/icons';
import { Button, message, Modal, Tooltip } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Form } from 'semantic-ui-react';

export const ModalUpdateOrderPaymentinformation = (props) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const [data,setData]=useState({
    payment_type:'',
    payment_status:'',
    // transaction_id:'',
  });
  
  // const [status,setStatus]=useState(props.order_status);
  // const [payment_status,setPaymentStatus]=useState(props.payment_type);



  useEffect(()=>{
    // setStatus(props.order_status);
    // setPaymentStatus(props.payment_type);
    setData({
      payment_type:props.data.payment_type,
      payment_status:props.data.payment_status,
      // transaction_id:props.data.transaction_id,
    })
  },[props])


  const handleChnage =(e)=> {
    setData({
      ...data,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = () => {
    setLoading(true);
    var tmp_data={
        id:props.data._id,
        payment_type:data.payment_type,
        payment_status:data.payment_status,
        // transaction_id:data.transaction_id,
    }
    axios.post(`${process.env.backendURL}/order/update_order_status`,tmp_data)
    .then(respose=>{
        message.success('Success');
        props.generateInvoice();
        setIsModalOpen(false);
        setLoading(false);

    })
  }

  return (
    <>
      <Tooltip title='Edit Payment Information'>
        <Button type="primary" size='small' onClick={()=>setIsModalOpen(true)} icon={<EditOutlined />}>
          
        </Button>
      </Tooltip>
      
      <Modal title="Update payment information" visible={isModalOpen} onOk={()=>setIsModalOpen(false)} onCancel={()=>setIsModalOpen(false)}
        footer={[
            <Button key="back" onClick={()=>setIsModalOpen(false)}>
              Close
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={()=>document.getElementById('btn879890').click()}>
              Update
            </Button>,
          ]}
      
      >
        <Form loading={loading} id='form9658545265' onSubmit={handleSubmit}>
            <Form.Field label='Payment Type' control='select' name='payment_status' value={data.payment_status} onChange={handleChnage} required>
                <option value='Unpaid'>Unpaid</option>
                <option value='Paid'>Paid</option>
            </Form.Field>
            <Form.Field label='Payment Type' control='select' name='payment_type' value={data.payment_type} onChange={handleChnage} required>
                {/* <option value='1'>Waiting</option> */}
                <option value='Cash on delivery'>Cash on delivery</option>
                <option value='Paypal'>Paypal</option>
                <option value='Stripe'>Stripe</option>
                <option value='Bank Transfer'>Bank Transfer</option>
                <option value='Cash'>Cash</option>
                <option value='Checks'>Checks</option>
                <option value='Mobile payments'>Mobile payments</option>
                <option value='Electronic bank transfers'>Electronic bank transfers</option>
            </Form.Field>
            {/* <Form.Input label='Transaction ID' fluid name='transaction_id' value={data.transaction_id} onChange={handleChnage}  placeholder='Enter Transaction ID'/> */}
            <Button key="submit" htmlType="submit" hidden  id='btn879890'>
              Update
            </Button>
        </Form>


        {/* Canceled – Grey
                Completed – Blue
                Failed – Red
                On Hold – Orange
                Pending Payment – Grey
                Processing – Green
                Refunded – Grey */}
      </Modal>
    </>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ModalUpdateOrderPaymentinformation)