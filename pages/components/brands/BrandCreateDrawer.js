import React, { useState, useRef } from "react";
import { Drawer, Button, message } from "antd";
import { connect } from "react-redux";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Form } from "semantic-ui-react";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import {fetchBrands} from '../../../store/actions'

export const BrandCreateDrawer = (props) => {
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  const [branddata, setBrandDatas] = useState({
    name: "",
    url: "",
    status: "Active",
    image: "",
    image_temp: "",
  });

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
      formData.append('name',branddata.name);
      formData.append('url',branddata.url);   
      formData.append('status',branddata.status);   
      formData.append('image',branddata.image);   


      axios.post(`${process.env.backendURL}/brand/store`,formData,config)
      .then(response=>{
        if(response.data.response){
          setLoading(false)
          setBrandDatas({
            ...branddata,
            name: "",
            url: "",
            status: "Active",
            image: "",
            image_temp: "",
          });
          props.fetchBrands();
          setVisible(false);
          message.success('Success');
        }
      })
    }
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        Add Brand
      </Button>
      <Drawer
        title="Brand Create"
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
          />
          <span className="myerrormessage">
            {simpleValidator.current.message(
              "name",
              branddata.name,
              "required|min:2|max:20"
            )}
          </span>
          <Form.Input
            fluid
            label="URL"
            placeholder="Brand URL"
            name="url"
            value={branddata.url}
            onChange={handleUpdate}
          />
          <span className="myerrormessage">
            {simpleValidator.current.message(
              "url",
              branddata.url,
              "required|min:4|max:20"
            )}
          </span>
          <Form.Field
            label="Status"
            control="select"
            name="status"
            value={branddata.status}
            onChange={handleUpdate}
          >
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </Form.Field>
          <span className="myerrormessage">
            {simpleValidator.current.message(
              "status",
              branddata.status,
              "required"
            )}
          </span>
          <div className="field">
            <label>Brand Image</label>
            {branddata.image_temp === "" ? (
              <>
                {/* <center> */}
                  <label for="imageupload112">
                    {/* <img
                      src="https://www.uhy-ae.com/assets/images/image_upload_placeholder.jpg"
                      style={{ width: "70%" }}
                    />
                    <h5 style={{ marginTop: "-30px" }}>{props.title}</h5> */}
                    <img
                    src="https://ik.imagekit.io/nextjsecommerce/OTHER_IMAGES/noimage?tr=w-150,h-150"
                    alt="productimage"
                    style={{border:'1px solid #cccccc'}}
                    />
                  </label>
                {/* </center> */}
                
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
            {simpleValidator.current.message(
              "image",
              branddata.image,
              "required"
            )}
          </span>
          <br />
          <Button type="primary" htmlType="submit" onClick={showDrawer}>
            <PlusOutlined /> Create
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({});


export default connect(mapStateToProps, {fetchBrands})(BrandCreateDrawer);
