import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, message, Switch } from 'antd'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { connect } from 'react-redux'
import { Form, Grid } from 'semantic-ui-react'
import axios from 'axios'
import {setAuthUser} from '../../../store/actions'
import {osName,osVersion,browserName,browserVersion,deviceType,mobileVendor,mobileModel,fullBrowserVersion} from 'react-device-detect';

export const SettingsTheme = (props) => {

  const [authuser,setAuthuser]=useState({
    _id:'',
    admin_theme:'',
  })

  const [themes,setThems]=useState([])

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

    axios.get('https://api.reactnodeecommerce.cloud/themes/theme.json')
    .then(response=>{
      setThems(response.data.datas)
    })

    setAuthuser(props.auth);
  },[])

 

  const handleChangeTheme = (themeid) => {
    
    var tmpdata=authuser;
    tmpdata.admin_theme=themeid;

    axios.post(`${process.env.backendURL}/user/admin_account_information_update`,tmpdata)
    .then(response=>{
      if(response.data.response){
        props.setAuthUser(response.data.data)
        console.log('response.data',response.data);
        message.success('Success');

        
      }else{
        message.warning('Failed')
      }
      
    })

  } 





  return (
    <>
        <Grid>
            {themes.map((theme,key)=>{
              return(
                <Grid.Column mobile={16} tablet={16} computer={4} key={key}>
                  <div className={`themebox cursor-pointer ${authuser.admin_theme===theme.id?'themebox_active_theme':''}`} onClick={()=>handleChangeTheme(theme.id)}>
                    <img src={theme.image} style={{width:'100%'}} />
                    <br />
                    <p>{theme.name}</p>
                  </div>
                </Grid.Column>
              )
            })}
            
        </Grid>

        
    </>
  )
}

const mapStateToProps = (state) => ({
  auth:state.auth
})

export default connect(mapStateToProps, {setAuthUser})(SettingsTheme)