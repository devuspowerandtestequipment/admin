import React, { useState, useRef } from "react";
import { Drawer, Button, message, Popconfirm } from "antd";
import { connect } from "react-redux";
import { PlusOutlined, DeleteOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";
import { Form } from "semantic-ui-react";
import SimpleReactValidator from "simple-react-validator";
import {fetchAttributes} from '../../../store/actions'
import dynamic from 'next/dynamic';
import InputFields from "./InputFields";
import axios from "axios";
import InputFieldsNew from "./InputFieldsNew";
const InputSort = dynamic(() => import('./InputSort'), { ssr: false });
import _ from 'lodash'

import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import arrayMoveImmutable from "./ArrayMoveMutable";


export const AttributeCreateDrawer = (props) => {
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHideEditDropdownId, setShowHideEditDropdownId] = useState(99999999);
  const [entrydropdown_value, setEntrydropdownvalue] = useState('');

  const [attributedata, setAttributeDatas] = useState({
    name: "",
    type: "Text",
    isrequired: "Yes",
    isvisiblesearch: "No",
    isconfigproduct: "No",
    datasarray:[],
    attrbutes_list:[],

  });

  const showDrawer = () => {
    setVisible(true);
  };
  

  const onClose = () => {
    setVisible(false);
  };

  function handleUpdate(e) {

    if(e.target.name==='attribute_name'){
      setAttributeDatas({
        ...attributedata,
        name: e.target.value,
        url: e.target.value.replace( / +/g, '_').toLowerCase(),
      });
    }else{
      setAttributeDatas({
        ...attributedata,
        [e.target.name]: e.target.value,
      });
    }
  }



  
  const handleSubmit = (e) => {

    if (e.key === 'Enter') {
      
    }else{
      const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      setLoading(true)
      axios.post(`${process.env.backendURL}/attribute`,attributedata)
      .then(response=>{
        if(response.data.response){
          setLoading(false)
    setVisible(false);

          setAttributeDatas({
            ...attributedata,
            name: "",
            type: "Text",
            isrequired: "Yes",
            isvisiblesearch: "No",
            datasarray:[],
            attrbutes_list:[],

          });
          props.fetchAttributes();
          message.success('Success');
        }else{
          setLoading(false)
          message.warning('This attribute name is already in your list.');
        }
      })

      
    }
      
    }    
  };


  function addNow(){
    // var value = document.getElementById(`id698pimmqwd556`).value;
    var value = entrydropdown_value;

    // if(value===''){
    //   message.warning('Please enter some value')
    // }else{
      var temp_data={
        _id:"id" + Math.random().toString(16).slice(2),
        name:value
      }
  
      if(attributedata.attrbutes_list.length===0){
        var temp_data={
          _id:"id" + Math.random().toString(16).slice(2),
          name:value,
          order:0
        }
      }else{
        var temp_data={
          _id:"id" + Math.random().toString(16).slice(2),
          name:value,
          order:attributedata.attrbutes_list.length
        }
      }
  
      setAttributeDatas({
        ...attributedata,
        attrbutes_list:attributedata.attrbutes_list.concat(temp_data)
      });
      setEntrydropdownvalue('');
      // document.getElementById(`id698pimmqwd556`).value=''
    // }

    
    
  }


  function updateNow(id){
    var mainattr=attributedata.attrbutes_list;
    mainattr.map((ca)=>{
      if(ca._id===id){
        ca.name=document.getElementById(id).value
      }
    })
    setAttributeDatas({
      ...attributedata,
      attrbutes_list:mainattr
    });
    setShowHideEditDropdownId(9999999)
  }


  function deleteNow(id){
    var mainattr=attributedata.attrbutes_list;
    _.remove(mainattr, dta => dta._id === id)
    setAttributeDatas({
      ...attributedata,
      attrbutes_list:mainattr
    });
    setShowHideEditDropdownId(9999999)
  }





  function handleChangeCustomInput(datas){
    setAttributeDatas({
      ...attributedata,
      datasarray:datas
    });
  }



  const onSortEnd = ({oldIndex, newIndex, collection}  ) => {
    // this.setState(({items}) => ({
    //   items: arrayMoveImmutable(items, oldIndex, newIndex),
    // }));
    // this.props.setDataMain(this.state.items)
    

    var mainattr=attributedata.attrbutes_list;

    var convert_array=[];
    mainattr.map((ca)=>{
      convert_array.push(ca._id)
    })

   
    var new_array = arrayMoveImmutable(convert_array, oldIndex, newIndex);
    console.log(convert_array);
    console.log(new_array);

    mainattr.map((mt)=>{
      mt.order=new_array.indexOf(mt._id)
    })

    console.log(mainattr)


    var updatemain=[];
    _.orderBy(mainattr,['order']).map((data, index) => (
      updatemain.push(data)
    ))


    console.log(updatemain)


    setAttributeDatas({
      ...attributedata,
      attrbutes_list:updatemain
    });

    // console.log(attributedata.attrbutes_list)


    // console.log(oldIndex,newIndex);

  



  };


  const SortableItem = sortableElement(({value,clickFunction}) => (
    <li className="list1212">
        <Form.Field width={2}>
        <span className="list1212span"><DragHandle /></span>
        </Form.Field>

        {showHideEditDropdownId===value._id
        ?
          <>
          <Form.Input
            // id={`id${randid}`}
            id={value._id}
            fluid
            placeholder="Enter field name"
            defaultValue={value.name}
            style={{marginLeft:'0px',width:'100%'}}
            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
            width={10}
                  
          />
          <Form.Field width={3}>
            <center style={{display:'inline-flex'}}>
              <Button type="primary" color='teal' icon={<SaveOutlined />}  onClick={()=>updateNow(value._id)} style={{height:'37px'}} />
              <Popconfirm
                title="Are you sure?"
                onConfirm={()=>deleteNow(value._id)} 
                // onConfirm={confirm}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" style={{height:'37px'}} danger icon={<DeleteOutlined />}   />
              </Popconfirm>
            </center>
          </Form.Field>
          </>
        :
          <>
          <Form.Field width={10}>
            <span>{value.name}   </span>
          </Form.Field>
          <Form.Field width={3}>
            <center style={{display:'inline-flex'}}>
              <Button type="primary" color='teal' icon={<EditOutlined />}  onClick={()=>setShowHideEditDropdownId(value._id)} style={{height:'37px'}} />
              <Popconfirm
                title="Are you sure?"
                onConfirm={()=>deleteNow(value._id)} 
                // onConfirm={confirm}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" style={{height:'37px'}} danger icon={<DeleteOutlined />}   />
              </Popconfirm>
              
            </center>
          </Form.Field>
          </>
        }
        
      
      
         
      {/* <span onClick={() => clickFunction(value)} className="ppo121">x</span> */}
    </li>
  ));

  const SortableContainer = sortableContainer(({children}) => {
    return <ul>{children}</ul>;
  });

  const clickFunction=e=>{
    // this.props.removeDataFromList(e)
  }

  const DragHandle = sortableHandle(() => <span>::</span>);



  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        Add Attribute
      </Button>
      <Drawer
        title="Attribute Create"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <Form onSubmit={handleSubmit} loading={loading}>
          <Form.Input
            fluid
            label="Name"
            placeholder="Attribute Name"
            name="name"
            value={attributedata.name}
            onChange={handleUpdate}
            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
          />
          <span className="myerrormessage">
            {simpleValidator.current.message(
              "name",
              attributedata.name,
              "required|min:2|max:20"
            )}
          </span>
         
          <Form.Field
            label="Type"
            control="select"
            name="type"
            value={attributedata.type}
            onChange={handleUpdate}
            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
          >
            <option value="Text">Text</option>
            {/* <option value="Longtext">Longtext</option> */}
            <option value="Single Dropdown">Dropdown</option>
            <option value="Multiple Dropdown">Multi Select Dropdown</option>
            {/* <option value="Radio">Radio</option>
            <option value="Checkbox">Checkbox</option> */}

          </Form.Field>
          <span className="myerrormessage">
            {simpleValidator.current.message(
              "status",
              attributedata.type,
              "required"
            )}
          </span>

          
          {/* {(() => {
                                    
              switch(attributedata.type) {
                  case "Single Dropdown": return (<><InputFields parentfunction={handleChangeCustomInput}  datas={attributedata.datasarray} /> <InputFieldsNew parentfunction={handleChangeCustomInput}  datas={attributedata.datasarray} /></>);
                  case "Multiple Dropdown": return <InputFields parentfunction={handleChangeCustomInput}  datas={attributedata.datasarray} />;
                  case "Radio": return <InputFields parentfunction={handleChangeCustomInput}  datas={attributedata.datasarray} />;
                  case "Checkbox": return <InputFields parentfunction={handleChangeCustomInput}  datas={attributedata.datasarray} />;
                  default: return <></>
              }
                                          
          })()} */}


          {/* NEW */}

          
              
              

          {attributedata.type==='Single Dropdown' || attributedata.type==='Multiple Dropdown' || attributedata.type==='Radio' || attributedata.type==='Checkbox'
          ?
          <>
          <SortableContainer onSortEnd={onSortEnd} useDragHandle>
                {_.orderBy(attributedata.attrbutes_list,['order']).map((data, index) => (
                  <SortableItem key={`item-${index}`} index={index} value={data} clickFunction={clickFunction} />
                ))}
          </SortableContainer>

          <Form.Group>
              <Form.Field width={2}>
              </Form.Field>
              <Form.Input
                id='id698pimmqwd556'
                fluid
                placeholder="Enter field name"
                value={entrydropdown_value}
                style={{marginLeft:'0px',width:'100%'}}
                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                onChange={e=>setEntrydropdownvalue(e.target.value)}
                // style={{marginLeft:'0px',width:'100%'}}
                // onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                width={12}
              />
              <Form.Field width={2}>
                <center>
                  <Button type="primary" icon={<PlusOutlined />}  onClick={addNow} style={{height:'37px'}} />
                </center>
              </Form.Field>
            </Form.Group>
          </>
          :<></>
          }

          

          {attributedata.type==='Text' || attributedata.type==='Longtext'
          ?<>
          </>
          :
          <>
          {/* <Form.Field
            label="Visible on Product View Page on Front-end"
            control="select"
            name="isvisiblesearch"
            value={attributedata.isvisiblesearch}
            onChange={handleUpdate}
            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Form.Field> */}
          <span className="myerrormessage">
            {simpleValidator.current.message(
              "status",
              attributedata.isvisiblesearch,
              "required"
            )}
          </span>


          <Form.Field
            label="is Configurable Attribute"
            control="select"
            name="isconfigproduct"
            value={attributedata.isconfigproduct}
            onChange={handleUpdate}
            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Form.Field>
          <span className="myerrormessage">
            {simpleValidator.current.message(
              "status",
              attributedata.isconfigproduct,
              "required"
            )}
          </span>



          
          </>
          }


          <Form.Field
            label="Required"
            control="select"
            name="isrequired"
            value={attributedata.isrequired}
            onChange={handleUpdate}
            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Form.Field>
          <span className="myerrormessage">
            {simpleValidator.current.message(
              "status",
              attributedata.isrequired,
              "required"
            )}
          </span>


          
          

        

          <br />
          <Button type="primary" htmlType="submit">
            <PlusOutlined /> Create
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({});


export default connect(mapStateToProps, {fetchAttributes})(AttributeCreateDrawer);
