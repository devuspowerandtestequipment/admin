import React, { useEffect, useState } from 'react';
import { Drawer, Button, Switch, message } from 'antd'
import { connect } from 'react-redux'
import { EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Form } from 'semantic-ui-react';
import axios from 'axios';
import {fetchAllRoles} from '../../../store/actions'

export const DrawerRoleEdit = (props) => {

    const [open, setOpen] = useState(false);
    const [submitButtonLoading,setSubmitButtonLoading]=useState(false);

    const [data, setData] = useState(false);

    useEffect(()=>{
        setData(props.role)
    },[props])

    const handleChange = (name,value) => {
        setData({
            ...data,
            [name]:value
        })
    }
    
    const handleChangeName = e => {
        setData({
            ...data,
            [e.target.name]:e.target.value
        })
    }

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        setSubmitButtonLoading(true);
       
        axios.post(`${process.env.backendURL}/rolesadmin/update`,data)
        .then(response=>{
          if(response.data.response){
            props.fetchAllRoles();
            setOpen(false);
            setSubmitButtonLoading(false);
            message.success('Success');
          }else{
            message.warning('Failed')
          }
        })
    
      }

    return (
        <>
        {/* <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
            Add new
        </Button> */}
        {/* <p> */}
            
            <span onClick={showDrawer} className='text-primary cursor-pointer'><EditOutlined /></span>
            
            {/* <Button type='primary' icon={<EditOutlined />} onClick={showDrawer}>Edit</Button> */}
        {/* </p> */}
        <Drawer
            title="Edit role"
            placement="right"
            onClose={onClose}
            visible={open}
        >
            <div className='admin_role_create'>
                {data
                ?
                <Form onSubmit={handleSubmit}>
                <Form.Input fluid label="Role Name" name='name' value={data.name} onChange={handleChangeName}  required/>
                <h5>Dashboard Information</h5>
                <p>Dashboard  <span><Switch checked={data.is_view_dashboard} onChange={(e)=>handleChange('is_view_dashboard',e)} /></span></p>
                
                <h5>User Information</h5>
                <p>User List View <span><Switch checked={data.user_index} onChange={(e)=>handleChange('user_index',e)} /></span></p>
                <p>User Create <span><Switch checked={data.user_create} onChange={(e)=>handleChange('user_create',e)} /></span></p>
                <p>User Details View <span><Switch checked={data.user_view} onChange={(e)=>handleChange('user_view',e)} /></span></p>
                <p>User Edit <span><Switch checked={data.user_edit} onChange={(e)=>handleChange('user_edit',e)} /></span></p>
                <p>User Delete <span><Switch checked={data.user_delete} onChange={(e)=>handleChange('user_delete',e)} /></span></p>
                <p>User Profile Login <span><Switch checked={data.user_login_as_user_account} onChange={(e)=>handleChange('user_login_as_user_account',e)} /></span></p>
               
                <h5>Login Information</h5>
                <p>Login List View <span><Switch checked={data.login_record_index} onChange={(e)=>handleChange('login_record_index',e)} /></span></p>
                <p>Login Details View <span><Switch checked={data.login_record_view} onChange={(e)=>handleChange('login_record_view',e)} /></span></p>
                <p>Clear Login Info <span><Switch checked={data.login_record_clear} onChange={(e)=>handleChange('login_record_clear',e)} /></span></p>
                <p>Delete Login Info <span><Switch checked={data.login_record_delete} onChange={(e)=>handleChange('login_record_delete',e)} /></span></p>

                <h5>Email Records</h5>
                <p>Send Email List <span><Switch checked={data.email_record_index} onChange={(e)=>handleChange('email_record_index',e)} /></span></p>
                <p>View Send Email Details <span><Switch checked={data.email_record_view} onChange={(e)=>handleChange('email_record_view',e)} /></span></p>
                <p>Delete Email Details <span><Switch checked={data.email_record_delete} onChange={(e)=>handleChange('email_record_delete',e)} /></span></p>

                
                <h5>Order Information</h5>
                <p>Order List <span><Switch checked={data.order_record_index} onChange={(e)=>handleChange('order_record_index',e)} /></span></p>
                <p>Order View <span><Switch checked={data.order_record_view} onChange={(e)=>handleChange('order_record_view',e)} /></span></p>
                <p>Order Update <span><Switch checked={data.order_record_update_status} onChange={(e)=>handleChange('order_record_update_status',e)} /></span></p>
                <p>Order Update Courier <span><Switch checked={data.order_record_update_courier} onChange={(e)=>handleChange('order_record_update_courier',e)} /></span></p>
                <p>Order Update Payment <span><Switch checked={data.order_record_update_paymentinfo} onChange={(e)=>handleChange('order_record_update_paymentinfo',e)} /></span></p>
                <p>Order Update Shipping <span><Switch checked={data.order_record_update_billingshipping} onChange={(e)=>handleChange('order_record_update_billingshipping',e)} /></span></p>
                <p>Order Download Invoice <span><Switch checked={data.order_record_invoice} onChange={(e)=>handleChange('order_record_invoice',e)} /></span></p>
                <p>Order Delete <span><Switch checked={data.order_record_delete} onChange={(e)=>handleChange('order_record_delete',e)} /></span></p>
                
                <Form.Field>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitButtonLoading}>Update</Button>
                </Form.Field>
                </Form>
                :
                <>Loading...</>
                }
                

            </div>
        </Drawer>
        </>
    )
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {fetchAllRoles})(DrawerRoleEdit)