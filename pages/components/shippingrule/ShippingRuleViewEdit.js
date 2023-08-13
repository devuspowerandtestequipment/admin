import React, { useState, useRef, useEffect } from "react";
import { connect } from 'react-redux'
import { SaveOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Dropdown, Form } from "semantic-ui-react";
import { Drawer, Button, message } from "antd";


export const ShippingRuleViewEdit = (props) => {

    var shipping_rules_name = [
        { key: '1', text: 'Total price in cart', value: 'price_in_cart' },
        { key: '2', text: 'Total rows in cart', value: 'row_total_in_cart' },
        { key: '3', text: 'Total quantity in cart', value: 'quantity_in_cart' },
        // { key: '4', text: 'Category', value: 'category' },
        { key: '41', text: 'Category with quantity', value: 'category_with_quantity' },
        // { key: '9', text: 'Subcategory', value: 'subcategory' },
        { key: '91', text: 'Subategory with quantity', value: 'subcategory_with_quantity' },
        { key: '7', text: 'User', value: 'user' },
        // { key: '8', text: 'Product', value: 'product' },
        { key: '81', text: 'Product with quantity', value: 'product_with_quantity' },
    ];

    const [showForm,setShowForm]= useState(false)
    const [loading, setLoading]= useState(false);
    const [conditions,setConditions]= useState({
        id:'',
        name:'',
        min:1,
        max:2,
        value:[],
    })

    useEffect(()=>{
        setConditions(props.condition)
    },[props])

    function handleUpdate(e) {
        setConditions((previousState) => {
          return { ...previousState, [e.target.name]: e.target.value };
        });
    }

    function handleUpdateNumber(e) {
        setConditions((previousState) => {
          return { ...previousState, [e.target.name]: Number(e.target.value) };
        });
    }

    function handleUpdateMultiple(e, { name, value }){
        setConditions((previousState) => {
            return { ...previousState, [name]: value };
        });
    }

    

    const handleSubmit = () => {
        if(conditions.name===''){
            message.warning('Please enter condition name');
        }else{

            var tmpdata={ //initilize
                id:conditions.id,
                name:conditions.name,
                min:conditions.name,
                max:conditions.name,
                value:conditions.name,
            }

            if(conditions.name==='price_in_cart'){
                if(conditions.min!=='' && conditions.max!==''){

                    if(conditions.max>=conditions.min){
                        tmpdata.min=conditions.min;
                        tmpdata.max=conditions.max;
                        finalSubmit(tmpdata);
                    }else{
                        message.warning('Maximum value should be equal or greather than minimum value');
                    }
                }else{
                    message.warning('Minimum and Maximum value is required');
                }
            }

            if(conditions.name==='row_total_in_cart' || conditions.name==='quantity_in_cart'){
                if(conditions.min!=='' && conditions.max!==''){

                    if(conditions.max>=conditions.min){
                        tmpdata.min=conditions.min;
                        tmpdata.max=conditions.max;
                        finalSubmit(tmpdata);
                    }else{
                        message.warning('Maximum value should be equal or greather than minimum value');
                    }
                }else{
                    message.warning('Minimum and Maximum value is required');
                }
            }

            if(conditions.name==='category'){
                if(conditions.value.length!==0){
                    tmpdata.value=conditions.value;
                    finalSubmit(tmpdata);
                }else{
                    message.warning('Please enter some value');
                }
            }

            if(conditions.name==='category_with_quantity'){
                if(conditions.value.length!==0){
                    tmpdata.value=conditions.value;

                    if(conditions.min!=='' && conditions.max!==''){

                        if(conditions.max>=conditions.min){
                            tmpdata.min=conditions.min;
                            tmpdata.max=conditions.max;
                            finalSubmit(tmpdata);
                        }else{
                            message.warning('Maximum value should be equal or greather than minimum value');
                        }

                    }else{
                        message.warning('Minimum and Maximum value is required');
                    }

                }else{
                    message.warning('Please enter some value');
                }
            }


            if(conditions.name==='subcategory'){
                if(conditions.value.length!==0){
                    tmpdata.value=conditions.value;
                    finalSubmit(tmpdata);
                }else{
                    message.warning('Please enter some value');
                }
            }

            if(conditions.name==='subcategory_with_quantity'){
                if(conditions.value.length!==0){
                    tmpdata.value=conditions.value;

                    if(conditions.min!=='' && conditions.max!==''){

                        if(conditions.max>=conditions.min){
                            tmpdata.min=conditions.min;
                            tmpdata.max=conditions.max;
                            finalSubmit(tmpdata);
                        }else{
                            message.warning('Maximum value should be equal or greather than minimum value');
                        }
                    }else{
                        message.warning('Minimum and Maximum value is required');
                    }


                }else{
                    message.warning('Please enter some value');
                }
            }


            if(conditions.name==='product'){
                if(conditions.value.length!==0){
                    tmpdata.value=conditions.value;
                    finalSubmit(tmpdata);
                }else{
                    message.warning('Please enter some value');
                }
            }

            if(conditions.name==='product_with_quantity'){
                if(conditions.value.length!==0){
                    tmpdata.value=conditions.value;

                    if(conditions.min!=='' && conditions.max!==''){

                        if(conditions.max>=conditions.min){
                            tmpdata.min=conditions.min;
                            tmpdata.max=conditions.max;
                            finalSubmit(tmpdata);
                        }else{
                            message.warning('Maximum value should be equal or greather than minimum value');
                        }
                    }else{
                        message.warning('Minimum and Maximum value is required');
                    }


                }else{
                    message.warning('Please enter some value');
                }
            }


            if(conditions.name==='user'){
                if(conditions.value.length!==0){
                    tmpdata.value=conditions.value;
                    finalSubmit(tmpdata);
                }else{
                    message.warning('Please enter some value');
                }
            }


        }

    }



    const finalSubmit = tmpdata => {
        props.updateConditions(tmpdata)
    }

    return (
    <>
    
    <Form onSubmit={handleSubmit} id='form9856963'>
    <Form.Group >
        <Form.Field
            control="select"
            name="name"
            value={conditions.name}
            onChange={handleUpdate}
            required
            width={4}
        >
            <option value=''>Select</option>
            {shipping_rules_name.map((name)=>{
                return(
                    <option value={name.value}>{name.text}</option>
                )
            })}
        </Form.Field>

        {conditions.name==='price_in_cart' &&
            <>
            <Form.Input
                fluid
                type='number'
                presicion={2}
                name="min"
                value={conditions.min}
                onChange={handleUpdateNumber}
                placeholder="Minimum price"
                required
                width={5}
            />
            <Form.Input
                fluid
                type='number'
                presicion={2}
                name="max"
                value={conditions.max}
                onChange={handleUpdateNumber}
                placeholder="Maximum price"
                required
                width={5}
            />
            <Form.Field width={1}>
                <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />} className="btnsui" />
            </Form.Field>  
            <Form.Field width={1}>
                <Button type="primary" danger onClick={()=>props.deleteConditions(conditions.id)} loading={loading} icon={<DeleteOutlined />} className="btnsui" />
            </Form.Field>       
            </>
        }

        {(conditions.name==='row_total_in_cart' || conditions.name==='quantity_in_cart') &&
            <>
            <Form.Input
                type='number'
                presicion={2}
                fluid
                name="min"
                value={conditions.min}
                onChange={handleUpdateNumber}
                placeholder="Minimum item"
                required
                width={5}
            />
            <Form.Input
                type='number'
                presicion={2}
                fluid
                name="max"
                value={conditions.max}
                onChange={handleUpdateNumber}
                placeholder="Maximum item"
                required
                width={5}
            />
            <Form.Field width={1}>
                <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />} className="btnsui" />
            </Form.Field>  
            <Form.Field width={1}>
                <Button type="primary" danger onClick={()=>props.deleteConditions(conditions.id)} loading={loading} icon={<DeleteOutlined />} className="btnsui" />
            </Form.Field>           
            </>
        }

        {conditions.name==='category' &&
            <>
            
            <Form.Field width={10} >
                <Dropdown
                    control='select'
                    multiple
                    selection
                    name='value'
                    options={props.allcategory.map((dta,key)=>{return{key:key, text:dta.name, value:dta._id}})}
                    placeholder='Select Category'
                    onChange={handleUpdateMultiple}
                    value={conditions.value}
                />
            </Form.Field>

            <Form.Field width={1}>
                <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />} className="btnsui" />
            </Form.Field>  
            <Form.Field width={1}>
                <Button type="primary" danger onClick={()=>props.deleteConditions(conditions.id)} loading={loading} icon={<DeleteOutlined />} className="btnsui" />
            </Form.Field>         
            </>
        }

        {conditions.name==='category_with_quantity' &&
            <>
            <Form.Field width={6}>
                <Dropdown
                    control='select'
                    multiple
                    selection
                    name='value'
                    options={props.allcategory.map((dta,key)=>{return{key:key, text:dta.name, value:dta._id}})}
                    placeholder='Select Category'
                    onChange={handleUpdateMultiple}
                    value={conditions.value}
            />
            </Form.Field>
            <Form.Input
                type='number'
                presicion={2}
                fluid
                name="min"
                value={conditions.min}
                onChange={handleUpdateNumber}
                placeholder="Minimum item"
                required
                width={2}
            />
            <Form.Input
                type='number'
                presicion={2}
                fluid
                name="max"
                value={conditions.max}
                onChange={handleUpdateNumber}
                placeholder="Maximum item"
                required
                width={2}
            />
            <Form.Field width={1}>
                <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />} className="btnsui" />
            </Form.Field>  
            <Form.Field width={1}>
                <Button type="primary" danger onClick={()=>props.deleteConditions(conditions.id)} loading={loading} icon={<DeleteOutlined />} className="btnsui" />
            </Form.Field>         
            </>
        }

{conditions.name==='subcategory' &&
            <>
            <Form.Field width={10}>
                <Dropdown
                    control='select'
                    multiple
                    search
                    selection
                    name='value'
                    options={props.allsubcategory.map((dta,key)=>{return{key:key, text:dta.name, value:dta._id}})}
                    placeholder='Select Subcategory'
                    onChange={handleUpdateMultiple}
                    value={conditions.value}
                />
            </Form.Field>
            <Form.Field width={1}>
                <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />} className="btnsui" />
            </Form.Field>  
            <Form.Field width={1}>
                <Button type="primary" danger onClick={()=>props.deleteConditions(conditions.id)} loading={loading} icon={<DeleteOutlined />} className="btnsui" />
            </Form.Field>         
            </>
        }


        {conditions.name==='subcategory_with_quantity' &&
            <>
            <Form.Field width={6}>
                <Dropdown
                    control='select'
                    search
                    multiple
                    selection
                    name='value'
                    options={props.allsubcategory.map((dta,key)=>{return{key:key, text:dta.name, value:dta._id}})}
                    placeholder='Select Subcategory'
                    onChange={handleUpdateMultiple}
                    value={conditions.value}
            />
            </Form.Field>
            <Form.Input
                type='number'
                presicion={2}
                fluid
                name="min"
                value={conditions.min}
                onChange={handleUpdateNumber}
                placeholder="Minimum item"
                required
                width={2}
            />
            <Form.Input
                type='number'
                presicion={2}
                fluid
                name="max"
                value={conditions.max}
                onChange={handleUpdateNumber}
                placeholder="Maximum item"
                required
                width={2}
            />
            <Form.Field width={1}>
                <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />} className="btnsui" />
            </Form.Field>  
            <Form.Field width={1}>
                <Button type="primary" danger onClick={()=>props.deleteConditions(conditions.id)} loading={loading} icon={<DeleteOutlined />} className="btnsui" />
            </Form.Field>         
            </>
        }



        {conditions.name==='user' &&
            <>
            <Form.Field width={10}>
                <Dropdown
                    control='select'
                    search
                    multiple
                    selection
                    name='value'
                    options={props.allusers.map((dta,key)=>{return{key:key, text:dta.name+' - '+dta.email, value:dta._id}})}
                    placeholder='Select User'
                    onChange={handleUpdateMultiple}
                    value={conditions.value}
                />
            </Form.Field>
            <Form.Field width={1}>
                <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />} className="btnsui" />
            </Form.Field>  
            <Form.Field width={1}>
                <Button type="primary" danger onClick={()=>props.deleteConditions(conditions.id)} loading={loading} icon={<DeleteOutlined />} className="btnsui" />
            </Form.Field>         
            </>
        }

        {conditions.name==='product' &&
            <>
            <Form.Field width={10}>
                <Dropdown
                    control='select'
                    search
                    multiple
                    selection
                    name='value'
                    options={props.allproducts.map((dta,key)=>{return{key:key, text:dta.name, value:dta._id}})}
                    placeholder='Select Product'
                    onChange={handleUpdateMultiple}
                    value={conditions.value}
                />
            </Form.Field>
            <Form.Field width={1}>
                <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />} className="btnsui" />
            </Form.Field>  
            <Form.Field width={1}>
                <Button type="primary" danger onClick={()=>props.deleteConditions(conditions.id)} loading={loading} icon={<DeleteOutlined />} className="btnsui" />
            </Form.Field>         
            </>
        }

        {conditions.name==='product_with_quantity' &&
            <>
            <Form.Field width={6}>
                <Dropdown
                    control='select'
                    search
                    multiple
                    selection
                    name='value'
                    options={props.allproducts.map((dta,key)=>{return{key:key, text:dta.name, value:dta._id}})}
                    placeholder='Select Product'
                    onChange={handleUpdateMultiple}
                    value={conditions.value}
            />
            </Form.Field>
            <Form.Input
                type='number'
                presicion={2}
                fluid
                name="min"
                value={conditions.min}
                onChange={handleUpdateNumber}
                placeholder="Minimum item"
                required
                width={2}
            />
            <Form.Input
                type='number'
                presicion={2}
                fluid
                name="max"
                value={conditions.max}
                onChange={handleUpdateNumber}
                placeholder="Maximum item"
                required
                width={2}
            />
            <Form.Field width={1}>
                <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />} className="btnsui" />
            </Form.Field>  
            <Form.Field width={1}>
                <Button type="primary" danger onClick={()=>props.deleteConditions(conditions.id)} loading={loading} icon={<DeleteOutlined />} className="btnsui" />
            </Form.Field>         
            </>
        }

        
    
        </Form.Group>
    </Form>

    
    
    </>
  )
}

const mapStateToProps = (state) => ({
    allcategory:state.all_category,
    allsubcategory:state.all_subcategory,
    allchildcategory:state.all_childcategory,
    allusers:state.all_users,
    allproducts: state.all_products,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ShippingRuleViewEdit)