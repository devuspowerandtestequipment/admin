import React, { useState, useRef, useEffect } from "react";
import { Drawer, Button, message } from "antd";
import { connect } from "react-redux";
import { PlusOutlined, DeleteOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Dropdown, Form } from "semantic-ui-react";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import {fetchShippingRules} from '../../../store/actions'
import ShippingRuleAddNew from "./ShippingRuleAddNew";
import ShippingRuleViewEdit from "./ShippingRuleViewEdit";
import _ from 'lodash'

export const ShippingruleEditDrawer = (props) => {
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  const [data, setData] = useState(false);
  
  useEffect(()=>{
    setData(props.shippingdata)
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
    // var tmpcondi=data.conditions;
    // tmpcondi.push(tmpdata);
    // setData({
    //   ...data,
    //   conditions:tmpcondi
    // })

    console.log(id);

    var tmpcondi=data.conditions;
   
    setData({
      ...data,
      conditions:_.remove(tmpcondi, dta => dta.id !== id)
    })
    
  }





  const handleSubmit = () => {

    setLoading(true)
      axios.post(`${process.env.backendURL}/shippingrule/update`,data)
      .then(response=>{
        if(response.data.response){
          setLoading(false)
          props.fetchShippingRules();
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
    { key: '0', text: 'Sunday', value: '0' },
  ];

  var shipping_rules_name = [
    { key: '1', text: 'Total price in cart', value: 'price_in_cart' },
    { key: '2', text: 'Total rows in cart', value: 'row_total_in_cart' },
    { key: '3', text: 'Total quantity in cart', value: 'quantity_in_cart' },
    { key: '4', text: 'Category', value: 'category' },
    { key: '41', text: 'Category with quantity', value: 'category_with_quantity' },
    { key: '5', text: 'Subcategory', value: 'subcategory' },
    { key: '6', text: 'Childcategory', value: 'childcategory' },
    { key: '7', text: 'Country', value: 'country' },
    { key: '8', text: 'State', value: 'state' },
  ];

  // console.log(data.conditions);

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<EditOutlined />}>
        Edit
      </Button>
      <Drawer
        title="Edit Shipping Rule"
        placement="right"
        onClose={onClose}
        visible={visible}
        size={'large'}
      >
        {data &&
        <Form onSubmit={handleSubmit}>
            <h4>Basic Information</h4>
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

            <Form.Input
            fluid
            label="Name"
            placeholder="Name"
            name="name"
            value={data.name}
            onChange={handleUpdate}
            required
            />

            <Form.Field
            label="Type"
            control="select"
            name="type"
            value={data.type}
            onChange={handleUpdate}
            required
            >
            <option value="Amount">Amount</option>
            <option value="Percentage">Percentage</option>
            </Form.Field>
            

            {data.type==='Percentage'
            ?
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
            :
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
            }

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

        

            <Form.Field >
            <label>Days of the Week</label>
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

            <br />
            <h4>Shipping Method Rules</h4>

            {data.conditions.map((condition,key)=>{
            return(
                <ShippingRuleViewEdit shipping_rules_name={shipping_rules_name} condition={condition} updateConditions={updateConditions} deleteConditions={deleteConditions} key={key} />
            )
            })}
            <ShippingRuleAddNew shipping_rules_name={shipping_rules_name} addConditions={addConditions} />


            <br />
            <br />
            <Button type="primary" htmlType="submit" onClick={showDrawer} loading={loading} icon={<SaveOutlined />}>
                Update
            </Button>
        </Form>
        }
        
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({});


export default connect(mapStateToProps, {fetchShippingRules})(ShippingruleEditDrawer);
