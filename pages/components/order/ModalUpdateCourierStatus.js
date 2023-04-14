import { Button, message, Modal } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Form } from 'semantic-ui-react';

export const ModalUpdateCourierStatus = (props) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [data,setData]=useState(props.data);
  const [courier_id,setCourierId]=useState('');
  const [courier_tracking_id,setTrackingId]=useState('');



  useEffect(()=>{
    setData(props.data);
    if(data.courier_tracking_id){
      setTrackingId(data.courier_tracking_id);
    }
    if(data.courier_id){
      setCourierId(data.courier_id._id)
    }
  },[props])


  // const handleChange = e => setData({...data,[e.target.name]:e.target.value});

  const handleUpdate = () => {

    setLoading(true);
    var tmp_data={
        id:data._id,
        courier_id,
        courier_tracking_id,
        order_status:'8'
    }
    axios.post(`${process.env.backendURL}/order/update_order_status`,tmp_data)
    .then(respose=>{
        if(respose.data.response){
            message.success('Success');
            props.getData();
            setIsModalOpen(false);
            setLoading(false);
        }else{
            alert('Failed')
        }
        
    })
    
  }


  return (
    <>
      <Button type="primary" size='small' onClick={()=>setIsModalOpen(true)}>
      Update Courier
      </Button>
      <Modal title="Update your courier information" visible={isModalOpen} onOk={()=>setIsModalOpen(false)} onCancel={()=>setIsModalOpen(false)}
        footer={[
            <Button key="back" onClick={()=>setIsModalOpen(false)}>
              Close
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={handleUpdate}>
              Update
            </Button>,
          ]}
      
      >

        <Form loading={loading} >

            <Form.Input
                fluid
                label="Courier Tracking ID"
                placeholder="Courier Tracking ID"
                name="courier_tracking_id"
                value={courier_tracking_id}
                onChange={(e)=>setTrackingId(e.target.value)}
                required
            />

            <Form.Field label="Select Courier" control='select' name='courier_id' value={courier_id} onChange={(e)=>setCourierId(e.target.value)} required>
                <option value=''>Select Courier Service</option>
                {props.couriers.map((courier)=>{
                    return(
                        <option value={courier._id} key={courier._id}>{courier.name}</option>
                    )
                })}
                
            </Form.Field>
        </Form>


      </Modal>
    </>
  )
}

const mapStateToProps = (state) => ({
    couriers:state.all_couriers
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ModalUpdateCourierStatus)