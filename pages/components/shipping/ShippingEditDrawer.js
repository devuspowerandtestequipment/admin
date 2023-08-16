import React, { useState, useRef, useEffect } from "react";
import { Drawer, Button, message, Switch } from "antd";
import { connect } from "react-redux";
import { PlusOutlined, DeleteOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Dropdown, Form } from "semantic-ui-react";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import {fetchShipping} from '../../../store/actions'
import ShippingRuleAddNew from "../shippingrule/ShippingRuleAddNew";
import ShippingRuleViewEdit from "../shippingrule/ShippingRuleViewEdit";


export const ShippingEditDrawer = (props) => {
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState(false);
  const [states, setStates] = useState(false);

  const [data, setData] = useState(false);


  useEffect(()=>{
    if(countries===false){
      axios.get(`${process.env.backendURL}/countrystatecity/getcountry`)
      .then(response=>{
        setCountries(response.data.datas.map((dta,key)=>{return{key:key, text:dta.name, value:dta.name}}))
      })
    }


    if(props.data.country_list.length>0){

      axios.post(`${process.env.backendURL}/countrystatecity/getstatelistundercountry`,{country_names:props.data.country_list})
      .then(response=>{
        setStates(response.data.datas.map((dta,key)=>{return{key:key, text:dta.name+' | '+dta.country_name, value:dta.name}}))
        setData(props.data)
      })
      
    }else{
      setData(props.data)
    }

    // setData(props.data)

    console.log('props.data',props.data)
    
  },[props])





  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  function handleUpdate(e) {
    setData((previousState) => {
        return { ...previousState, [e.target.name]: e.target.value };
    });
  }

  function handleUpdateMultiple(e, { name, value }){
    setData((previousState) => {
      return { ...previousState, [name]: value };
    });
  }

  function handleUpdateCountry(e, { name, value }){
    setData((previousState) => {
      return { ...previousState, [name]: value };
    });

    axios.post(`${process.env.backendURL}/countrystatecity/getstatelistundercountry`,{country_names:value})
    .then(response=>{
     
      var statesarray=_.map(response.data.datas,'name');
    
      setStates(response.data.datas.map((dta,key)=>{return{key:key, text:dta.name+' | '+dta.country_name, value:dta.name}}))
      setData((previousState) => {
        return { ...previousState, state_list: statesarray.filter(item => data.state_list.includes(item)) };
      });

    })

  }

  function chnageStatus(value,name){
    setData((previousState) => {
      return { ...previousState, [name]: value };
    });
  }

  function selectAllCountry(){
    setData((previousState) => {
      return { ...previousState, country: _.map(countries,'text') };
    });
  }

  function deSelectAllCountry(){
    setData((previousState) => {
      return { ...previousState, country: [] };
    });
  }


  const handleSubmit = () => {

    console.log(data)


      setLoading(true)

      axios.post(`${process.env.backendURL}/shipping/update`,data)
      .then(response=>{
        if(response.data.response){
          setLoading(false)
          props.fetchShipping();
          setVisible(false);
          message.success('Success');
        }
      })

  };


  var options_daysofweek = [
    { key: '1', text: 'Monday', value: '1' },
    { key: '2', text: 'Tuesday', value: '2' },
    { key: '3', text: 'Wednesday', value: '3' },
    { key: '4', text: 'Thursday', value: '4' },
    { key: '5', text: 'Friday', value: '5' },
    { key: '6', text: 'Saturday', value: '6' },
    { key: '7', text: 'Sunday', value: '7' },
  ];

  


  function addConditions(tmpdata){
    var tmpcondi=data.conditions;
    tmpcondi.push(tmpdata);
    setData({
      ...data,
      conditions:tmpcondi
    })
  }

  function updateConditions(tmpdata){
    var tmpcondi=data.conditions;

    tmpcondi.forEach((element,key) => {
      if(element.id===tmpdata.id){
        tmpcondi[key].name=tmpdata.name,
        tmpcondi[key].min=tmpdata.min,
        tmpcondi[key].max=tmpdata.max,
        tmpcondi[key].value=tmpdata.value
      }
    });

    setData({
      ...data,
      conditions:tmpcondi
    })

  }

  function deleteConditions(id){
    console.log(id)
    var tmpcondi=data.conditions;
    setData({
      ...data,
      conditions:_.remove(tmpcondi, dta => dta.id !== id)
    })
    
  }




  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<EditOutlined />}>
        Edit
      </Button>
      <Drawer
        title="Edit Shipping"
        placement="right"
        onClose={onClose}
        visible={visible}
        // size={'large'}
        width={window.innerWidth > 1200 ? 800 : window.innerWidth - 100}
      >
        {data &&
          <Form onSubmit={handleSubmit} >

          <Form.Input
            fluid
            label="Title (Only admin can see)"
            placeholder="Ex: your_shipping_name"
            name="title"
            value={data.title}
            onChange={handleUpdate}
            required
          />
          <Form.Input
            fluid
            label="Name"
            placeholder="Ex: Standard Shipping"
            name="name"
            value={data.name}
            onChange={handleUpdate}
            required
          />
          <Form.Input
            fluid
            label="Shipping Time"
            placeholder="Ex: 3-5 Business days"
            name="time"
            value={data.time}
            onChange={handleUpdate}
            required
          />
          <Form.Field >
            <label>Country  <span style={{float:'right'}}><Switch checkedChildren="Active" unCheckedChildren="Disabled"  checked={data.enableCountry}  onClick={(e)=>chnageStatus(e,'enableCountry')} /></span></label>
            {(countries && data.enableCountry) &&
              <Dropdown
                control='select'
                search
                multiple
                selection
                name='country_list'
                options={countries}
                // options={countries.map((dta,key)=>{return{key:key, text:dta.name, value:dta.name}})}
                placeholder='Select country'
                onChange={handleUpdateCountry}
                value={data.country_list}
                disabled={data.enableCountry?false:true}
                required={data.enableCountry}
              />
            }
          </Form.Field>

          <Form.Field >
            <label>States  <span style={{float:'right'}}><Switch checkedChildren="Active" unCheckedChildren="Disabled"  checked={data.enableState}  onClick={(e)=>chnageStatus(e,'enableState')} /></span></label>
            {(countries && data.enableState) &&
              <Dropdown
                control='select'
                search
                multiple
                selection
                name='state_list'
                options={states}
                // options={countries.map((dta,key)=>{return{key:key, text:dta.name, value:dta.name}})}
                placeholder='Select state'
                onChange={handleUpdateMultiple}
                value={data.state_list}
                disabled={data.enableState?false:true}
                required={data.enableState}
              />
            }
          </Form.Field>
          <Form.Field >
            <label>Days of the Week </label>
            <Dropdown
                control='select'
                multiple
                selection
                name='days_of_week'
                options={options_daysofweek}
                placeholder='Days of the Week'
                onChange={handleUpdateMultiple}
                value={data.days_of_week}
            />
          </Form.Field>
          <Form.Group  widths='equal'>
            <Form.Field
              label="Status"
              control="select"
              name="status"
              value={data.status}
              onChange={handleUpdate}
              required
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </Form.Field>
            <Form.Field
              label="Shipping type"
              control="select"
              name="shipping_type"
              value={data.shipping_type}
              onChange={handleUpdate}
              required
            >
              <option value="shipping_method">Shipping Method</option>
              <option value="shipping_rule">Shipping Tax</option>
              <option value="discount">Discount</option>

            </Form.Field>
            <Form.Field
              label="Calculation type"
              control="select"
              name="calculation_type"
              value={data.calculation_type}
              onChange={handleUpdate}
              required
            >
              <option value="Discount">Discount</option>
              <option value="Surcharge">Surcharge</option>
            </Form.Field>
          </Form.Group>

        
          <Form.Group  widths='equal'>
            <Form.Field
              label="Amount Type"
              control="select"
              name="type"
              value={data.type}
              onChange={handleUpdate}
              required
            >
              <option value="2">Amount</option>
              <option value="1">Percentage</option>
            </Form.Field>
            

            {data.type==='1'
            ?
            <>
            <Form.Input
              fluid
              type='number'
              label="Percentage"
              placeholder="Tax Percentage"
              name="percentage"
              value={data.percentage}
              onChange={handleUpdate}
              required
            />
            </>
            :
            <>
            <Form.Input
              fluid
              type='number'
              label="Amount"
              placeholder="Amount"
              name="amount"
              value={data.amount}
              onChange={handleUpdate}
              step='any'
              required
            />
            
            </>
            }

            

            <Form.Field
              label="Bellow rule match"
              control="select"
              name="conditions_match_all"
              value={data.conditions_match_all}
              onChange={handleUpdate}
              required
              >
              <option value={true}>All</option>
              <option value={false}>Any one</option>
            </Form.Field>
          </Form.Group>






















          <br />
          <h4>Shipping Rules</h4>

          {data.conditions.map((condition,key)=>{
            return(
              <ShippingRuleViewEdit condition={condition} updateConditions={updateConditions} deleteConditions={deleteConditions} key={key} />
            )
          })}


          <ShippingRuleAddNew  addConditions={addConditions} />
          <br />
          <br />
          <Button type="primary" htmlType="submit" onClick={showDrawer} loading={loading} icon={<SaveOutlined />}>
            Save
          </Button>
        </Form>
        }
        
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({

});


export default connect(mapStateToProps, {fetchShipping})(ShippingEditDrawer);
