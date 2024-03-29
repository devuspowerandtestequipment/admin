import React, { useState, useRef, useEffect } from "react";
import { Drawer, Button, message } from "antd";
import { connect } from "react-redux";
import { SaveOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Form } from "semantic-ui-react";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import {fetchBrands} from '../../../store/actions'

export const BrandEditDrawer = (props) => {
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  const [branddata, setBrandDatas] = useState({
    _id: "",
    name: "",
    url: "",
    status: "Active",
    showin_homepage: "No",
    image: "",
    image_temp: "",
    image_id: "",
    meta_title: "",
    meta_desc: "",
    meta_key: "",

  });


  useEffect(()=>{
    setBrandDatas({
        _id: props.data._id,
        name: props.data.name,
        url: props.data.url,
        status: props.data.status,
        image: "",
        image_temp: process.env.imagekiturl+props.data.image,
        image_id: props.data.image_id,
        showin_homepage: props.data.showin_homepage,

        meta_title: props.data.meta_title,
        meta_desc: props.data.meta_desc,
        meta_key: props.data.meta_key,

    })
  },[props])

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  function handleUpdate(e) {

    if(e.target.name==='name'){
      setBrandDatas({
        ...branddata,
        name: e.target.value,
        url: e.target.value.replace( / +/g, '_').toLowerCase(),
      });
    }else{
      setBrandDatas((previousState) => {
        return { ...previousState, [e.target.name]: e.target.value };
      });
    }
  }

  function handleImageUpdate(e) {
    setBrandDatas({
      ...branddata,
      image_temp: URL.createObjectURL(e.target.files[0]),
      image: e.target.files[0],
    });
  }

  function handleRemoveImage() {
    setBrandDatas({
      ...branddata,
      image: "",
      image_temp: "",
    });
  }

  const handleSubmit = () => {
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {

      setLoading(true)

      const config = {     
        headers: { 'content-type': 'multipart/form-data' }
      }

      let formData= new FormData();
      formData.append('_id',branddata._id);
      formData.append('name',branddata.name);
      formData.append('url',branddata.url);   
      formData.append('status',branddata.status);   
      formData.append('image',branddata.image);
      formData.append('image_id',branddata.image_id); 
      
      formData.append('meta_title',branddata.meta_title);
      formData.append('meta_desc',branddata.meta_desc);
      formData.append('meta_key',branddata.meta_key);
      formData.append('showin_homepage',branddata.showin_homepage);



      axios.post(`${process.env.backendURL}/brand/update`,formData,config)
      .then(response=>{
        if(response.data.response){
          setLoading(false)
          props.fetchBrands();
          setVisible(false);
          message.success('Success');
        }
      })
    }
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<EditOutlined />}>Edit</Button>
      <Drawer
        title="Brand Edit"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <Form onSubmit={handleSubmit} loading={loading}>
          <Form.Input
            fluid
            label="Name"
            placeholder="Brand Name"
            name="name"
            value={branddata.name}
            onChange={handleUpdate}
            required
          />
         
          <Form.Input
            fluid
            label="URL"
            placeholder="Brand URL"
            name="url"
            value={branddata.url}
            onChange={handleUpdate}
            required
          />
          
          <Form.Field
            label="Status"
            control="select"
            name="status"
            value={branddata.status}
            onChange={handleUpdate}
            required
          >
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </Form.Field>

          <Form.Field
            label="Show in home"
            control="select"
            name="showin_homepage"
            value={branddata.showin_homepage}
            onChange={handleUpdate}
            required
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Form.Field>
          

          <Form.Input
            fluid
            label="Meta Title"
            placeholder="Meta Title"
            name="meta_title"
            value={branddata.meta_title}
            onChange={handleUpdate}
            required
          />
          
          <Form.TextArea label='Meta Description' placeholder='Meta Description'
          
          name="meta_desc"
            value={branddata.meta_desc}
            onChange={handleUpdate}
            required
          />

          <Form.TextArea label='Meta Keywords' placeholder='Meta Keywords'
          
          name="meta_key"
            value={branddata.meta_key}
            onChange={handleUpdate}
            required
          />

          <div className="field">
            <label>Brand Image</label>
            {branddata.image_temp === "" ? (
              <>
                <center>
                  <label for="imageupload112">
                    <img
                      src="https://www.uhy-ae.com/assets/images/image_upload_placeholder.jpg"
                      style={{ width: "70%" }}
                    />
                    <h5 style={{ marginTop: "-30px" }}>{props.title}</h5>
                  </label>
                </center>
                <input
                  type="file"
                  id="imageupload112"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={handleImageUpdate}
                  hidden
                />
              </>
            ) : (
              <center>
                <img
                  src={branddata.image_temp}
                  style={{ width: "70%" }}
                />
                <h5 className="deleteimage" onClick={handleRemoveImage}>
                  <DeleteOutlined /> Delete Image
                </h5>
              </center>
            )}
          </div>
          <br />
          <span className="myerrormessage">
            {/* {simpleValidator.current.message(
              "image",
              branddata.image,
              "required"
            )} */}
          </span>
          <br />
          <Button type="primary" htmlType="submit" onClick={showDrawer}>
            <SaveOutlined /> Update
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({});


export default connect(mapStateToProps, {fetchBrands})(BrandEditDrawer);
