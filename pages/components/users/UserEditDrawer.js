import React, { useState,useEffect } from "react";
import { Drawer, Button, message, Switch } from "antd";
import { connect } from "react-redux";
import { EditOutlined, SaveOutlined, } from "@ant-design/icons";
import { Form } from "semantic-ui-react";
import axios from "axios";
import { useRouter } from "next/router";
import {fetchUsers} from '../../../store/actions'

export const UserEditDrawer = (props) => {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [formloading, setFormloading] = useState(false);

    const [data,setData]=useState({
        _id:'',
        name:'',
        email:'',
        phone:'',
        country:'',
        state:'',
        city:'',
        type:'',
        status:'',
        emailverification:'',
    })

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
        getCountryStateCity(props.data);
        setData({
            _id:props.data._id,
            name:props.data.name,
            email:props.data.email,
            phone:props.data.phone,
            country:props.data.country,
            state:props.data.state,
            city:props.data.city,
            type:props.data.type,
            status:props.data.status,
            emailverification:props.data.emailverification
        })
    },[props])

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


    const handleChangeCountry = e => {
        // setSelectedCountryCode(e.target.value)
        setData({
          ...data,
          [e.target.name]:e.target.value
        })

        axios.get(`${process.env.backendURL}/countrystatecity/getstate/${e.target.value}`)
        .then(response=>{
          setStates(response.data.datas)
          console.log(response.data.datas)
        })

    }


    const handleChangeState = e => {
      // setSelectedStateCode(e.target.value)

      setData({
        ...data,
        [e.target.name]:e.target.value
      })

      axios.get(`${process.env.backendURL}/countrystatecity/getcity/${e.target.value}`)
      .then(response=>{
        setCities(response.data.datas)
        console.log(response.data.datas)
      })


    }


    const handleSubmit =e=> {
        setFormloading(true);
        axios.put(`${process.env.backendURL}/user/${data._id}`,data)
        .then(response=>{
        if(response.data.response){
            setVisible(false);
            props.getData();
            setFormloading(false);
            message.success('Success');
        }else{
            setFormloading(false);
            message.warning(response.data.message)
        }
        })
    }

    return (
        <>
        <Button type="primary" onClick={showDrawer} icon={<EditOutlined />}>
            Edit
        </Button>
        <Drawer
            title="Edit User Information"
            placement="right"
            onClose={onClose}
            visible={visible}
        >
            <Form onSubmit={handleSubmit} loading={formloading}>
            <Form.Input fluid label="Name" name='name' value={data.name} onChange={handleChange} placeholder="Name" required/>
            <Form.Input fluid label="Phone" name='phone' value={data.phone} onChange={handleChange} placeholder="Phone"  />
            <Form.Field label='Country' control='select' name='country' value={data.country} onChange={e=>handleChangeCountry(e)} >
                <option>Choose country</option>
                {countries.map((co)=>{
                    return(
                        <option value={co.name} key={co.name}>{co.name}</option>
                    )
                })}
            </Form.Field>
            <Form.Field label='State' control='select' name='state' value={data.state} onChange={e=>handleChangeState(e)} >
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

            <Form.Field label='City' control='select' name='city' value={data.city} onChange={handleChange} >
                {cities.length===0
                ?<></>
                :
                <>
                <option>Choose City</option>
                {cities.map((co)=>{
                    return(
                        <option value={co.name} key={co.name}>{co.name}</option>
                    )
                })}
                </>
                }
            </Form.Field>

            <div class="field required">
                <label>Type</label>
                <Switch checkedChildren="Admin" unCheckedChildren="User" defaultChecked={data.type==='User'?false:true} onChange={(e)=>setData({...data,['type']:e})} />
            </div>
            <div class="field required">
                <label>Status</label>
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked={data.status} onChange={(e)=>setData({...data,['status']:e})} />
            </div>
            <div class="field required">
                <label>Email Verified</label>
                <Switch checkedChildren="Yes" unCheckedChildren="No" defaultChecked={data.emailverification} onChange={(e)=>setData({...data,['emailverification']:e})} />
            </div>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Update
            </Button>
            </Form>
        </Drawer>
        </>
    );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {fetchUsers})(UserEditDrawer);
