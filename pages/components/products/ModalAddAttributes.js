import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Modal, Header, Form, Select,Radio } from "semantic-ui-react";
import { Button } from "antd";
import _ from 'lodash'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import FindDynamicData from '../FindDynamicData';

export const ModalAddAttributes = (props) => {


  /////////////////////////FROM FIND DYNAMIC DATA/////////////////////////
  const findNonParent = (reduxstate,find,value,get) => {
    var data = _.find(props.dynamic_datas[reduxstate], function(o) { return o[find] === value });
    if(data===undefined){
      return(
        // <>not_found1 {value}</>
        false
      )
    }else{

      //check item is active or inactive
      if(data.status==='InActive'){
        return(
          <>inactive</>
        )
      }else{
        return(
          <>{data[get]}</>
        )
      }

      
    }
  }


  const findHaveParent = (find,value,get,parentAttributeId) => {
    var check = _.find(props.dynamic_datas.attributes, function(o) { return o._id === parentAttributeId });
    if(check===undefined){
      return(
        <>attribute_not_found</>
      )
      // return(
      //   false
      // )
    }else{
      if(check.type==='Text'){
        return 1212;
        // return(
        //   <>{props.value} </>
        // )
      }else{
        var data=_.find(_.find(props.dynamic_datas.attributes, function(o) { return o._id === parentAttributeId }).attrbutes_list, function(o) { return o[find] === value });
      
        if(data===undefined){
          // return(
          //   <>not_found2</>
          // )
          return(
            false
          )
        }else{
          return data[get];
          // return(
          //   <>{data[get]} {data.type}</>
          // )
        }
      }
      
    }
  }
  /////////////////////////FROM FIND DYNAMIC DATA/////////////////////////







    const [data,setData]=useState({})
    useEffect(()=>{
        if(props.data!==null){
        }
    },[props])

    function handleChange(e){


      console.log(e.target.name);
      console.log(e.target.value);


      setData({
        ...data,
        [e.target.name]:e.target.value
      })
    }

    function handleDropDown(name){
        const tempData=_.filter(props.data.config_attribues[name]);    


        console.log(tempData)
        
        // console.log('props.config_attribues',props.data.config_attribues[name]);
        // console.log('props.data',props.data);
        // console.log('tempData',tempData);

        // var dropdowndata=[];
        // tempData.forEach(element => {
        //   dropdowndata.push({key:Math.random() * 9869, text:findHaveParent('_id',element,'name',name),value:Math.random() * 10})
        // });
        // console.log('dropdowndata',dropdowndata)
      // <FindDynamicData redux_state={`attributes`} parentAttributeId={name} find='_id' value={dta} get='name' />

        
        if(tempData!==undefined){
          return (
            <>
            {/* <h2>{findNonParent('attributes','_id',name,'name')}</h2> */}

            <Form.Group inline>
              <label>Quantity</label>
                
              {tempData.map((element,keyd)=>{
                return(
                  <>
                  <input 
                  id={`l99822_${keyd}`} 
                  name={name} 
                  type="radio" 
                  value={element}
                  onChange={handleChange}
                  //  defaultChecked="{currentRadioValue" =="=" 'radio-1'}
                   />
                   <label htmlFor={`l99822_${keyd}`}>{findHaveParent('_id',element,'name',name)}</label>
                  </>
                )
              })}
                


            </Form.Group>

            {/* <Form.Field
              control={Select}
              label={findNonParent('attributes','_id',name,'name')}
              options={dropdowndata}
              placeholder={findNonParent('attributes','_id',name,'name')}
              name={name} onChange={(e)=>handleChange(e)}
            /> */}
            {/* <Form.Field name={name} onChange={handleChange} control="select" key={name} required>
              <option value="">Select</option>
              {dropdowndata.map((dtaas,keas)=>{
                return(
                  <option value={dtaas.name} key={keas}>{dtaas.name}</option>
                )
              })}
              <FindDynamicData redux_state={'attributes'} find='_id' value={name} get='name' />
            </Form.Field> */}

            {/* <Form.Field label={<FindDynamicData redux_state={'attributes'} find='_id' value={name} get='name' />} name={name} onChange={handleChange} control="select" key={name} required>
              <option value="">Select</option>
              {tempData.map((dta)=>{
                return(
                  <option value={dta} key={dta}><FindDynamicData redux_state={`attributes`} parentAttributeId={name} find='_id' value={dta} get='name' /></option>
                )
              })}
              <FindDynamicData redux_state={'attributes'} find='_id' value={name} get='name' />
            </Form.Field> */}
            
            <br />
            {/* {tempData.map((dta)=>{
              return(
                <>{dta}-<FindDynamicData redux_state={`attributes`} parentAttributeId={name} find='_id' value={dta} get='name' />, </>
              )
            })} */}
            {/* {dropdowndata.map((dta)=>{
              return(
                <>{dta.name}, </>
              )
            })} */}
            </>
          );
        }else{
          return (
            <Form.Field label={name} name={name} onChange={handleChange} control="select" key={name} required>
              <option value="">Select {name}</option>
            </Form.Field>
          );
        }
    }


    function objectValues(obj) {

      console.log('obj',obj)

      let vals = [];
      for (const prop in obj) {
          console.log('obj[prop]',obj[prop])

          vals.push(obj[prop]);
      }

      // console.log(vals)
      return vals;
    }



    function getProductName(data){
      let name = [];
      for(let d in data){
        // console.log(d); // It gives you property name
        // console.log(data[d]); // And this gives you its value
        name.push(findHaveParent('_id',data[d],'name',d))
      }
      return name;
    }


    const handleSubmit=()=>{
      props.addMoreAttribute(objectValues(data).join('-'), getProductName(data).join(' '), data);
    }


    // if(props.data!==null){
    //   props.data.myattributes.map((ats, key8) => {
    //     // console.log(ats)
    //   })
    // }

    
    console.log(data)
    
  return (

        <Modal
          open={props.modalstatus}
          size={"mini"}
        >
          {/* <Modal.Header>Add Variant</Modal.Header> */}
          <Modal.Content>
            <Modal.Description>
              <Header>Add Variant</Header>
              <Form onSubmit={handleSubmit}>
                {props.data === null ? (
                  <>Loading...</>
                ) : (
                  // props.data.myattributes.map((ats, key8) => {
                  //   return(
                  //     <div key={key8} style={{marginBottom:'10px'}}>
                  //       {handleDropDown(Object.getOwnPropertyNames(ats)[0])}
                  //     </div>
                  //   )
                  // })

                  Object.entries(props.data.config_attribues).map((odata,key) => {
                    return(
                      <div key={key} style={{marginBottom:'10px'}}>
                        {handleDropDown(odata[0])}
                      </div>
                    )
                  })

                )}
                <br />
                <Button type="primary" icon={<CloseOutlined />} danger onClick={() => props.closeModal(false)}>
                  Close
                </Button>
                &nbsp;
                <Button type="primary" icon={<PlusOutlined />} htmlType="submit">
                  Add
                </Button>
              </Form>
              
            </Modal.Description>
          </Modal.Content>
        </Modal>
  )
}

const mapStateToProps = (state) => ({
  attributedata:state.all_attributes,
  dynamic_datas:state.dynamic_datas
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddAttributes)
