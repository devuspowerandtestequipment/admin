import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, message, Popconfirm, Switch } from 'antd'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { connect } from 'react-redux'
import { Form, Grid } from 'semantic-ui-react'
import axios from 'axios'
import {osName,osVersion,browserName,browserVersion,deviceType,mobileVendor,mobileModel,fullBrowserVersion} from 'react-device-detect';
import ls from 'localstorage-slim';
import {setAuthUser} from '../../../store/actions'
import { useRouter } from 'next/router'

export const SettingsSecurity = (props) => {

  const router = useRouter();
  const [submitButtonLoading,setSubmitButtonLoading]=useState(false);
  const [adminSettings,setAdminSettings]=useState(false);
  const [authuser,setAuthuser]=useState(false);
  const [ipinfo,setIpInfo]=useState({})
  const [deviceinfo,setDeviceinfo]=useState({
    osName:osName,
    osVersion:osVersion,
    mobileVendor:mobileVendor,
    mobileModel:mobileModel,
    deviceType:deviceType,
    browserName:browserName,
    browserVersion:browserVersion,
    fullBrowserVersion:fullBrowserVersion,
  })


  useEffect(()=>{
    axios.get('https://freeipapi.com/api/json')
    .then(response=>{
      setIpInfo(response.data)
    })

    setAuthuser(props.auth);

    axios.get(`${process.env.backendURL}/settingsadmin`)
    .then(response=>{
      if(response){
        setAdminSettings(response.data.data)
      }
    })
  },[])





  const handleChangeAdminSettings = (value,name) => {

    // console.log(value);
    // console.log(name);
    setAdminSettings({
      ...adminSettings,
      [name]:value
    })
    var tmpdata=adminSettings;
    tmpdata[name]=value;

    axios.post(`${process.env.backendURL}/settingsadmin/update`,tmpdata)
    .then(response=>{

      console.log(response.data)

      if(response){
        setAdminSettings(response.data.data);
        message.success('Saved')
      }
    })
    
  }

  



  const handleSubmit = () => {
    setSubmitButtonLoading(true);

    var tmpdata=authuser;
    tmpdata.ipinfo=ipinfo;
    tmpdata.deviceinfo=deviceinfo;

    // axios.post(`${process.env.backendURL}/user/admin_account_information_update`,tmpdata)
    // .then(response=>{
    //   if(response.data.response){
    //     // props.setAuthUser(response.data.data)
    //     console.log('response.data',response.data);
    //     setSubmitButtonLoading(false);
    //     message.success('Success');

        
    //   }else{
    //     message.warning('Failed')
    //   }
      
    // })

  } 



  const handleAdminLogoutFromAllDevice=()=>{

    axios.get(`${process.env.backendURL}/settingsadmin/logoutadminfromalldevices`)
    .then(response=>{
      if(response.data.response){
        props.setAuthUser(null);
        ls.clear();
        router.push('/login');
        message.success('Success');
      }else{
        message.warning('False');

      }
    })

  }

  const handleMyAccountLogoutFromAllDevice=()=>{
    axios.get(`${process.env.backendURL}/settingsadmin/logoutmyaccountfromalldevices/${props.auth._id}`)
    .then(response=>{
      if(response.data.response){
        props.setAuthUser(null);
        ls.clear();
        router.push('/login');
        message.success('Success');
      }else{
        message.warning('False');

      }
    })
  }




  return (
    <>
    {/* <h4>Personal Information</h4> */}
    {/* <Form style={{maxWidth:'700px',pointerEvents:submitButtonLoading?'none':'all'}} onSubmit={handleSubmit} disabled>
        <Form.Input icon='key' iconPosition='left' fluid label="Current password" type='password' name='current_password' value={authuser.current_password} onChange={handleChange}  required/>
        <Form.Input icon='key' iconPosition='left' fluid label="New password" type='password' name='new_password' value={authuser.new_password} onChange={handleChange}  required/> */}
        
        <Grid>
            <Grid.Column mobile={16} tablet={16} computer={8}>
            <div>
            <br/>
            <p style={{marginBottom:'-5px',fontSize:'15px'}}>Device Information and IP Location Tracking</p>
            <small>Protects you against password theft by requesting an authentication code via email on every login.<span className='float-right'><Switch checkedChildren="Yes" unCheckedChildren="No" checked={true} /></span></small>
            <br/>
            </div>

            {authuser &&
            <>
            <div>
            <br/>
            <p style={{marginBottom:'-5px',fontSize:'15px'}}>Enable 2-step authentication</p>
            <small>Protects you against password theft by requesting an authentication code via email on every login.<span className='float-right'><Switch checkedChildren="Yes" unCheckedChildren="No" defaultChecked /></span></small>
            <br/>
            </div>
            </>
            }
            

            {adminSettings &&
            <>
            {/* <div>
              <br/>
              <p style={{marginBottom:'-5px'}}>Multiple Device Login  </p>
              <small>A simple but an effective way to be protected against data leaks and password theft. <span className='float-right'><Switch checkedChildren="Yes" unCheckedChildren="No" checked={adminSettings.} /></span></small>
              <br/>
            </div> */}

            <div>
              <br/>
              <p style={{marginBottom:'-5px',fontSize:'15px'}}>Allow access from Desktop / Laptop</p>
              <small>Login via all windows and mac os laptop/desktop. <span className='float-right'><Switch checkedChildren="Yes" unCheckedChildren="No" onChange={(e)=>handleChangeAdminSettings(e,'allow_access_desktop')} checked={adminSettings.allow_access_desktop} /></span></small>
              <br/>
            </div>

        
            <div>
              <br/>
              <p style={{marginBottom:'-5px',fontSize:'15px'}}>Enable Tablet Login</p>
              <small>Login via all ios, android and windows phone. <span className='float-right'><Switch checkedChildren="Yes" unCheckedChildren="No" onChange={(e)=>handleChangeAdminSettings(e,'allow_access_tablet')} checked={adminSettings.allow_access_tablet} /></span></small>
              <br/>
            </div>

            <div>
              <br/>
              <p style={{marginBottom:'-5px',fontSize:'15px'}}>Enable Mobile Login</p>
              <small>Login via all ios, android and windows phone. <span className='float-right'><Switch checkedChildren="Yes" unCheckedChildren="No" onChange={(e)=>handleChangeAdminSettings(e,'allow_access_mobile')} checked={adminSettings.allow_access_mobile} /></span></small>
              <br/>
            </div>
            

            {/* <div>
              <br/>
              <p style={{marginBottom:'-5px',fontSize:'15px'}}>IP Access Rules <span className='float-right'><Switch checkedChildren="Yes" unCheckedChildren="No" onChange={(e)=>handleChangeAdminSettings(e,'allow_access_all_ip')} checked={adminSettings.allow_access_all_ip} /></span></p>
              <small> </small>
              <br/>
              {adminSettings.allow_access_all_ip &&
              <>
              <br/>
              <Grid>
                <Grid.Column mobile={16} tablet={16} computer={8}>
                  <div className='ipsetbox'>
                      <h3>Whitelist</h3>
                      <p>192.168.0.1 <span><DeleteOutlined /></span></p>
                      <p>192.168.0.2</p>
                      <p>192.168.0.3</p>
                      <p>192.168.0.4</p>
                  </div>
                  <div><br />
                  <Form.Input  fluid placeholder="Enter IP" style={{maxWidth:'200px'}} />
                  <Button icon={<PlusOutlined />} type='primary' size='small' style={{position:' absolute', marginTop: '-37px', height: '35px', marginLeft: '202px'}}></Button>
                  </div>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={16} computer={8}>
                  <div className='ipsetbox'>
                      <h3>Blacklist</h3>
                      <p>192.168.0.1 <span><DeleteOutlined /></span></p>
                      <p>192.168.0.2</p>
                      <p>192.168.0.3</p>
                      <p>192.168.0.4</p>
                  </div>
                  <div><br />
                  <Form.Input  fluid placeholder="Enter IP" style={{maxWidth:'200px'}} />
                  <Button icon={<PlusOutlined />} type='primary' size='small' style={{position:' absolute', marginTop: '-37px', height: '35px', marginLeft: '202px'}}></Button>
                  </div>
                </Grid.Column>
              </Grid>
              </>
              }
              
                  
                  
              <br/>
            </div> */}
            </>
            
            }
            
            </Grid.Column>
            <Grid.Column mobile={16} tablet={16} computer={2}>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={16} computer={8}>
                <br />
                <br />

                <p style={{marginBottom:'-5px',fontSize:'15px'}}>Last Login Information
                  <span style={{float:'right'}}>
                    
                    <Popconfirm
                      title="Are you sure?"
                      // onConfirm={confirm}
                      // onCancel={cancel}
                      onConfirm={handleMyAccountLogoutFromAllDevice}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type='primary' size='small'>Logout my account from all devices</Button> 
                    </Popconfirm>
                    
                    
                    &nbsp;&nbsp; 

                    <Popconfirm
                      title="Are you sure?"
                      onConfirm={handleAdminLogoutFromAllDevice}
                      // onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type='primary' size='small'>Logout admin from all devices</Button>
                    </Popconfirm>
                    
                    </span>
                </p>
                <small>Login via all ios, android and windows phone.</small>
                <br/>
                

                <br/>
                {adminSettings &&
                  <Grid>
                    <Grid.Column mobile={16} tablet={16} computer={6}>
                    <div className="" >
                      <div className='lhdiv'>
                      <p>Device Type: {adminSettings.deviceinfo.isMobile && <>Mobile</>}{adminSettings.deviceinfo.isDesktop && <>Desktop</>}{adminSettings.deviceinfo.isTablet && <>Tablet</>}</p>
                      <p>OS Name: {adminSettings.deviceinfo.osName}</p>
                      <p>OS Version: {adminSettings.deviceinfo.osVersion}</p>
                      <p>Mobile Vendor: {adminSettings.deviceinfo.mobileVendor}</p>
                      <p>Mobile Model: {adminSettings.deviceinfo.mobileModel}</p>
                      {/* <p>Device Type: {adminSettings.deviceinfo.deviceType}</p> */}
                      <p>Browser Name: {adminSettings.deviceinfo.browserName}</p>
                      <p>Browser Version: {adminSettings.deviceinfo.browserVersion}</p>
                      </div>
                    </div>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={16} computer={6}>
                    <div className="" >
                        <div className='lhdiv'>
                        <p>IP: {adminSettings.ipinfo.ipAddress}</p>
                        <p>Country: {adminSettings.ipinfo.countryName}</p>
                        <p>State: {adminSettings.ipinfo.regionName}</p>
                        <p>City: {adminSettings.ipinfo.cityName}</p>
                        <p>ZIP: {adminSettings.ipinfo.zipCode}</p>
                        <p>Latitude: {adminSettings.ipinfo.latitude}</p>
                        <p>Longitude: {adminSettings.ipinfo.longitude}</p>
                        </div>
                    </div>
                    </Grid.Column>
                    
                    <Grid.Column mobile={16} tablet={16} computer={16}>
                    <iframe title="IP Location" src={`//maps.google.com/maps?q=${adminSettings.ipinfo.latitude},${adminSettings.ipinfo.longitude}&z=15&output=embed`} width="100%" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" />

                    </Grid.Column>
                </Grid>
                }
                
                

                

            </Grid.Column>
        </Grid>

        



        {/* <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitButtonLoading}>Update</Button> */}
    {/* </Form> */}
    </>
  )
}

const mapStateToProps = (state) => ({
  auth:state.auth
})

export default connect(mapStateToProps, {setAuthUser})(SettingsSecurity)