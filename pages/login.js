import { message } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { Grid, Form } from "semantic-ui-react";
import {setAuthUser} from '../store/actions'
import { useRouter } from "next/router";
import { LoadingOutlined } from '@ant-design/icons';
import {Button,Spin} from 'antd'
import {osName,osVersion,browserName,browserVersion,deviceType,mobileVendor,mobileModel,fullBrowserVersion,isMobile,isDesktop,isTablet} from 'react-device-detect';
import ls from 'localstorage-slim';
import * as ACTION  from '../store/types'


export const Login = (props) => {
  const router = useRouter();
  const [data,setData]=useState({email:'',password:'',ipinfo:'',deviceinfo:{
    osName:osName,
    osVersion:osVersion,
    mobileVendor:mobileVendor,
    mobileModel:mobileModel,
    deviceType:deviceType,
    browserName:browserName,
    browserVersion:browserVersion,
    fullBrowserVersion:fullBrowserVersion,
    isMobile,isDesktop,isTablet
  }})

  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    axios.get('https://freeipapi.com/api/json')
    .then(response=>{
      setData({
      ...data,
      ipinfo:response.data
      })
    })

    // if(ls.get(ACTION.AUTH_USER_INFORMATION)===undefined || ls.get(ACTION.AUTH_USER_INFORMATION)===null){
      setLoading(false)
    // }else{
    //   router.push('/')
    // }


  },[props])

  const handleChange = e => {
    setData({
      ...data,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = () => {
  
    axios.post(`${process.env.backendURL}/user/loginadmin`,data)
    .then(response=>{

      if(response.data.response){

        var data=response.data.data;
        if(data.allow_access_desktop===false){
          if(isDesktop){
              message.warning('Desktop access blocked.')
          }
        }
        if(data.allow_access_tablet===false){
          if(isTablet){
            message.warning('Tablet access blocked.')
          }
        }
        if(data.allow_access_mobile===false){
          if(isMobile){
            message.warning('Mobile access blocked.')
          }
        }
        
        
        message.success(response.data.message);
        props.setAuthUser(response.data.data);
        router.push('/');
        

      }else{
        message.warning(response.data.message);
      }
    })
    


  }

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  return (
    <body>
    <div className="background_login_register login-img">
      <div className="container-login100">
      <div className="wrap-login100">
        <center style={{    position: 'absolute', left:' 45%', marginTop: '-13rem'}}>
          <img src='http://localhost:3001/myimages/logo.png' style={{maxWidth:'200px'}} />
        </center>
          {loading
          ?<center><Spin indicator={antIcon} /></center>
          :
          <>
          <div>
            <center>
            <h1 className="loginhead">Login</h1>
            </center>
            <Form onSubmit={handleSubmit} className='login100-form'>
              <Form.Input icon='mail' iconPosition='left' fluid placeholder='Email' name='email' value={data.email} onChange={handleChange} required/>
              <Form.Input icon='key' iconPosition='left' fluid placeholder='Password' type='password' name='password' value={data.password} onChange={handleChange} required/>
              <Button type="primary" htmlType="submit" className='loginbutton' loading={false}>Login</Button>
            </Form>
          </div>
          
          {/* <div>
            <center>
            <h1 className="loginhead">Enter verification code</h1>
            <p className="loginsubhead">A text message with a verification code <br/> was just send to email@email.com</p>
            </center>
            <Form onSubmit={handleSubmit} className='login100-form'>
              <Form.Input icon='key' iconPosition='left' fluid placeholder='Verification code' name='code' value={data.code} onChange={handleChange} required/>
              <Button type="primary" htmlType="submit" className='loginbutton'>Verify</Button>
            </Form>
          </div> */}



          </>
          }
      </div>
      </div>
    </div>
    </body>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {setAuthUser})(Login);
