import React, { useState, useRef, useEffect } from "react";
import { Drawer, Button, message } from "antd";
import { connect } from "react-redux";
import { PlusOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Form } from "semantic-ui-react";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import {fetchBrands} from '../../../store/actions'
// import InputSort from './InputSort'

import dynamic from 'next/dynamic';
const InputSort = dynamic(() => import('./InputSort'), { ssr: false });


export const InputFieldsNew = (props) => {


  const [values, setValues]=useState([])
  var randid= Math.floor((Math.random() * 100000) + 1);


  useEffect(()=>{
    setValues(props.datas)
  },[props])


  const addNow =()=>{
    var value = document.getElementById(`id${randid}`).value;
    

    console.log(values)

    if(value===''){
      message.warning('Please enter some value.')
    }else{

        var temp_data={
            _id:"id" + Math.random().toString(16).slice(2),
            value:value
        }



        console.log(temp_data)

    //   if(values.includes(value)){
    //     message.warning(`${value} is already in the list.`)
    //   }else{
    //     const listdata = value.split("\n");
     
    //     var dataTemp = [];
    //     listdata.forEach(listdataFunction);
        
    //     function listdataFunction(tdata, index) {
    //         if(tdata===''){
    //         }else{
    //             dataTemp.push(tdata);
    //         }
    //     }
    //     console.log(values)
    //     console.log(dataTemp)

    //     setValues(values.concat(dataTemp))
    //     props.parentfunction(values.concat(dataTemp))
    //     document.getElementById(`id${randid}`).value='';
    //   }

      
    }
  }

  function setDataMain(data){
    setValues(data);
    props.parentfunction(data)
  }

  const removeDataFromList=(e)=> {
    let filteredArray = values.filter(item => item !== e)
    setValues(filteredArray)
    props.parentfunction(filteredArray)
  }

  return (
    <>


            <InputSort parentdata={values} setDataMain={setDataMain} removeDataFromList={removeDataFromList} />
            <Form.Group>
              <Form.Input
                id={`id${randid}`}
                fluid
                placeholder="Enter field name"
               
                style={{marginLeft:'40px',width:'90%'}}
                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                width={14}
              />
              <Form.Field width={2}>
                <center>
                  <Button type="primary" icon={<PlusOutlined />}  onClick={addNow} style={{height:'37px'}} />
                </center>
              </Form.Field>
              
            
            </Form.Group>
            


    </>
  );
};

const mapStateToProps = (state) => ({});


export default connect(mapStateToProps, {fetchBrands})(InputFieldsNew);
