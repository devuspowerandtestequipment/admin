import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, message } from 'antd'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { connect } from 'react-redux'
import { Form } from 'semantic-ui-react'
import axios from 'axios'
import {setAuthUser,fetchAllCurrency} from '../../../store/actions'
import {osName,osVersion,browserName,browserVersion,deviceType,mobileVendor,mobileModel,fullBrowserVersion} from 'react-device-detect';
import CurrencyCreate from './CurrencyCreate'
import CurrencyEdit from './CurrencyEdit'

export const SettingsCurrency = (props) => {

  const [submitButtonLoading,setSubmitButtonLoading]=useState(false);
  const [authuser,setAuthuser]=useState({
    _id:'',
    name:'',
    email:'',
    phone:'',
    country:'',
    state:'',
    city:'',
  })

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
  const [ipinfo,setIpInfo]=useState({})
  const [countries,setCountries]=useState([]);
  const [states,setStates]=useState([]);
  const [cities,setCities]=useState([]);


  function getCountryStateCity(auth){
  
    axios.get(`${process.env.backendURL}/countrystatecity/getcountry`)
    .then(response=>{
      setCountries(response.data.datas)
    })


    if(auth.country!=='' && auth.country!==undefined){
      axios.get(`${process.env.backendURL}/countrystatecity/getstate/${auth.country}`)
      .then(response=>{
        setStates(response.data.datas)
      })
    }

    if(auth.state!=='' && auth.state!==undefined){
      axios.get(`${process.env.backendURL}/countrystatecity/getcity/${auth.state}`)
      .then(response=>{
        setCities(response.data.datas)
      })
    }

  }


  useEffect(()=>{
    axios.get('https://freeipapi.com/api/json')
    .then(response=>{
      setIpInfo(response.data)
    })
    setAuthuser(props.auth);
    getCountryStateCity(props.auth);
    props.fetchAllCurrency();
  },[])

  const handleChange = e => {
      setAuthuser({
          ...authuser,
          [e.target.name]:e.target.value
      })
  }

  const handleChangeCountry = e => {
      // setSelectedCountryCode(e.target.value)
      setAuthuser({
        ...authuser,
        [e.target.name]:e.target.value
      })

      axios.get(`${process.env.backendURL}/countrystatecity/getstate/${e.target.value}`)
      .then(response=>{
        setStates(response.data.datas)
      })

  }


  const handleChangeState = e => {
    // setSelectedStateCode(e.target.value)

    setAuthuser({
      ...authuser,
      [e.target.name]:e.target.value
    })

    axios.get(`${process.env.backendURL}/countrystatecity/getcity/${e.target.value}`)
    .then(response=>{
      setCities(response.data.datas)
    })


  }



  const handleSubmit = () => {
    setSubmitButtonLoading(true);

    var tmpdata=authuser;
    tmpdata.ipinfo=ipinfo;
    tmpdata.deviceinfo=deviceinfo;

    axios.post(`${process.env.backendURL}/user/admin_account_information_update`,tmpdata)
    .then(response=>{
      if(response.data.response){
        props.setAuthUser(response.data.data)
        console.log('response.data',response.data);
        setSubmitButtonLoading(false);
        message.success('Success');

        
      }else{
        message.warning('Failed')
      }
      
    })

  } 





  return (
    <>
    
    <Form>
      <Form.Group>
        <h4 style={{paddingLeft:'13px'}}>Default Currency: (₹) Indian rupee</h4>
      </Form.Group>
    </Form>
    
    <div>
      {props.currencylist.map((currency)=>{
        return(
          <CurrencyEdit key={currency._id} currencydata={currency} />
        )
      })}
    </div>

    <div>
      <CurrencyCreate />
    </div>

    {/* <Form >
        <Form.Group>
            <Form.Input placeholder='Name' value={'(₹) Indian rupee'} name='name'/>
            <Form.Input placeholder='Value' value={'1'} name='name'/>
            <Form.Input placeholder='Code' value={'inr'} name='name'/>
            <Form.Input placeholder='Symbol' value={'₹'} name='name'/>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={submitButtonLoading} className='btnsui'>Add Currency</Button>
        </Form.Group>
    </Form> */}


    {/* <Form style={{maxWidth:'700px',pointerEvents:submitButtonLoading?'none':'all'}} onSubmit={handleSubmit} disabled>
        <Form.Input icon='user' iconPosition='left' fluid label="Name" name='name' value={authuser.name} onChange={handleChange}  required/>
        <Form.Group widths="equal">
            <Form.Input icon='briefcase' iconPosition='left' fluid label="Phone" placeholder="" name='phone' value={authuser.phone} onChange={handleChange}  required/>
            <Form.Input fluid label="Email" placeholder="" value={authuser.email} readonly style={{    backgroundColor: '#f1f1f1',pointerEvents: 'none'}}  required/>
        </Form.Group>
        

        <Form.Group widths="equal">
          <Form.Field icon='user' iconPosition='left' label="Country" control="select" name='country' value={authuser.country} onChange={e=>handleChangeCountry(e)} required>
            <option>Choose country</option>
            {countries.map((co)=>{
                return(
                    <option value={co.name} key={co.name}>{co.name}</option>
                )
            })}
          </Form.Field>
          <Form.Field label="State" control="select" name='state' value={authuser.state} onChange={e=>handleChangeState(e)} >
            {states.length===0
              ?<></>
              :
              <>
              <option>Choose State</option>
              {states.map((co)=>{
                  return(
                      <option value={co.name} key={co.name}>{co.name}</option>
                  )
              })}
              </>
            }
          </Form.Field>
          <Form.Input icon='briefcase' iconPosition='left' fluid label="City" placeholder="" name='city' value={authuser.city} onChange={handleChange}   required/>
        </Form.Group>    

      
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitButtonLoading}>Update</Button>
    </Form> */}
    </>
  )
}

const mapStateToProps = (state) => ({
  auth:state.auth,
  currencylist:state.currency
})

export default connect(mapStateToProps, {setAuthUser,fetchAllCurrency})(SettingsCurrency)