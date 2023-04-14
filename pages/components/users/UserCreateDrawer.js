import React, { useEffect, useState } from "react";
import { Drawer, Button, message } from "antd";
import { connect } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import { Form } from "semantic-ui-react";
import axios from "axios";
import { useRouter } from "next/router";
import {fetchUsers} from '../../../store/actions'

export const UserCreateDrawer = (props) => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [formloading, setFormloading] = useState(false);

  const [data,setData]=useState({
    name:'',
    email:'',
    password:'',
    created_by:'admin',
    ipinfo:''
  })


  useEffect(()=>{
    axios.get('https://freeipapi.com/api/json')
    .then(response=>{
      setData({
      ...data,
      ipinfo:response.data
      })
    })
  },[])

  const handleChange =e=> {
    setData({
      ...data,[e.target.name]:e.target.value
    })
  }

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };


  const handleSubmit =e=> {
    setFormloading(true);
    axios.post(`${process.env.backendURL}/user/register_fromadmin`,data)
    .then(response=>{
      if(response.data.response){
        setVisible(false);
        props.fetchUsers();
        router.push('/users')
        setFormloading(false);
        message.success('Success');
        setData({
          name:'',
          email:'',
          password:'',
          created_by:'admin'
        })
      }else{
        setFormloading(false);
        message.warning(response.data.message)
      }
    })
    // 
  }
  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        Add User
      </Button>
      <Drawer
        title="Add User"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <Form onSubmit={handleSubmit} loading={formloading}>
          <Form.Input fluid label="Name" name='name' value={data.name} onChange={handleChange} placeholder="Name" required/>
          <Form.Input fluid label="Email" name='email' value={data.email} onChange={handleChange} placeholder="Email"  required/>
          <Form.Input fluid label="Password" name='password' value={data.password} onChange={handleChange} placeholder="Password"  required/>
          <Button type="primary" htmlType="submit" onClick={showDrawer}>
            Create
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {fetchUsers})(UserCreateDrawer);
