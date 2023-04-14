import React, { useState, useEffect, useRef } from "react";
import { Drawer, Button, message } from "antd";
import { connect } from "react-redux";
import { SaveOutlined, EditOutlined } from "@ant-design/icons";

import { Form } from "semantic-ui-react";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import {fetchCategories,fetchSubCategories} from '../../../store/actions'

export const SubCategoryEditDrawer = (props) => {
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    _id:'',
    category_id: "",
    name: "",
    url: "",
    status: "Active",
    meta_title: "",
    meta_desc: "",
    meta_key: "",
  });


  useEffect(()=>{
    setData({
        _id:props.data._id,
        category_id: props.data.category_id,
        name: props.data.name,
        url: props.data.url,
        status: props.data.status,
        meta_title: props.data.meta_title,
        meta_desc: props.data.meta_desc,
        meta_key: props.data.meta_key,
    })

    console.log(props)

  },[props])

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  function handleUpdate(e) {

    if(e.target.name==='name'){
      setData({
        ...data,
        name: e.target.value,
        url: e.target.value.replace( / +/g, '_').toLowerCase(),
      });
    }else{
      setData((previousState) => {
        return { ...previousState, [e.target.name]: e.target.value };
      });
    }
  }


  const handleSubmit = () => {
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {

      console.log(data)

      setLoading(true)
      axios.post(`${process.env.backendURL}/subcategory/update`,data)
      .then(response=>{
        if(response.data.response){
          setLoading(false)
          props.fetchSubCategories();
          setVisible(false);
          message.success('Success');
        }else{
          setLoading(false)
          message.warning(response.data.message)
        }
      })
    }
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<EditOutlined />}>
        Edit
      </Button>
      <Drawer
        title="Sub Category Edit"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <Form onSubmit={handleSubmit} loading={loading}>
            <Form.Field
            label="Category"
            control="select"
            name="category_id"
            value={data.category_id}
            onChange={handleUpdate}
          >
            <option value=''>Select Category</option>
            {props.categories.map((data,key)=>{
                return(
                    <option value={data._id} key={key}>{data.name}</option>
                )
            })}
          </Form.Field>
          

          <Form.Input
            fluid
            label="Name"
            placeholder="Category Name"
            name="name"
            value={data.name}
            onChange={handleUpdate}
          />
          
          <Form.Input
            fluid
            label="URL"
            placeholder="Category URL"
            name="url"
            value={data.url}
            onChange={handleUpdate}
          />
          
          <Form.Field
            label="Status"
            control="select"
            name="status"
            value={data.status}
            onChange={handleUpdate}
          >
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </Form.Field>
          

          <Form.Input
            fluid
            label="Meta Title"
            placeholder="Meta Title"
            name="meta_title"
            value={data.meta_title}
            onChange={handleUpdate}
            required
          />
          
          <Form.TextArea label='Meta Description' placeholder='Meta Description'
          
          name="meta_desc"
            value={data.meta_desc}
            onChange={handleUpdate}
            required
          />

          <Form.TextArea label='Meta Keywords' placeholder='Meta Keywords'
          
          name="meta_key"
            value={data.meta_key}
            onChange={handleUpdate}
            required
          />




          <Button type="primary" htmlType="submit" onClick={showDrawer}>
            <SaveOutlined /> Update
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({
    categories:state.all_category
});


export default connect(mapStateToProps, {fetchCategories,fetchSubCategories})(SubCategoryEditDrawer);
