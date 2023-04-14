import { EditOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Form } from 'semantic-ui-react';

export const ModalUpdateOrderStatus = (props) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [status,setStatus]=useState(props.order_status)


  useEffect(()=>{
    setStatus(props.order_status)
  },[props])


  
  const handleUpdate = () => {
    

    if(status==='6' || status==='7'){ //check courier information is availabe or not

      if(props.data.courier_id && props.data.courier_tracking_id){
        setLoading(true);
        var tmp_data={
            id:props.order_id,
            order_status:status,
        }
        axios.post(`${process.env.backendURL}/order/update_order_status`,tmp_data)
        .then(respose=>{
            message.success('Success');
            props.generateInvoice();
            setIsModalOpen(false);
            setLoading(false);
        }) 
      }else{
        message.warning('Please update courier information first.')
      }

    }else{

      setLoading(true);
      var tmp_data={
          id:props.order_id,
          order_status:status,
      }
      axios.post(`${process.env.backendURL}/order/update_order_status`,tmp_data)
      .then(respose=>{
          message.success('Success');
          props.generateInvoice();
          setIsModalOpen(false);
          setLoading(false);
      })

    }



  }

  return (
    <>
      <Button type="primary" onClick={()=>setIsModalOpen(true)} icon={<EditOutlined />}>
        Update Status
      </Button>
      <Modal title="Update your order status" visible={isModalOpen} onOk={()=>setIsModalOpen(false)} onCancel={()=>setIsModalOpen(false)}
        footer={[
            <Button key="back" onClick={()=>setIsModalOpen(false)}>
              Close
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={handleUpdate}>
              Update
            </Button>,
          ]}
      
      >
        <Form>
            <Form.Field control='select' value={status} onChange={(e)=>setStatus(e.target.value)}>
                {/* <option value='1'>Waiting</option> */}
                <option value='2'>Accepted</option>
                <option value='3'>In Progress</option>
                <option value='4'>Packing</option>
                <option value='5'>Ready For Pickup</option>
                <option value='6'>Shipped</option>
                <option value='7'>Delivered</option>
                <option value='0'>Canceled</option>
            </Form.Field>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUpdateOrderStatus)