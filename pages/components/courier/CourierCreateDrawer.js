import React, { useState, useRef } from "react";
import { Drawer, Button, message, Spin } from "antd";
import { connect } from "react-redux";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Form } from "semantic-ui-react";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import {fetchCourier} from '../../../store/actions'
import { IKContext, IKUpload } from "imagekitio-react";




export const CourierCreateDrawer = (props) => {
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [randnum,setRandNum] = useState(Math.floor(Math.random(1111,9999)*4563))

  const [data, setData] = useState({
    name: "",
    tracking_url: "",
    logo:false,
  });

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


  const handleImageChangeClick = () => {
    setUploading(true);

  };

  const handleImageChangeError = () => {
    setLoading(false);
    setUploading(false);
    message.warning('Failed');
  }


  const handleImageChange = e => {
    setUploading(false);

    var dataxs={
        fileId:e.fileId,
        filePath:e.filePath,
        url:e.url,
    }
    setData({
        ...data,
        logo:dataxs
    })
  }


  const handleSubmit = () => {
    setLoading(true)
      axios.post(`${process.env.backendURL}/courier`,data)
      .then(response=>{
        if(response.data.response){
          setLoading(false)
          setData({
            ...data,
            name: "",
            tracking_url: "",
            logo: false,
          });
          props.fetchCourier();
          setVisible(false);
          message.success('Success');
        }
      })
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        Add
      </Button>
      <Drawer
        title="Add Courier"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <Form onSubmit={handleSubmit} >
          <Form.Input
            fluid
            label="Name"
            placeholder="Courier Name"
            name="name"
            value={data.name}
            onChange={handleUpdate}
            required
          />

          <Form.Input
            fluid
            label="Courier Tracking URL"
            placeholder="Courier Tracking URL"
            name="tracking_url"
            value={data.tracking_url}
            onChange={handleUpdate}
            required
          />

          <div className="required field"><label>Upload Logo</label>
            <div className="ui fluid input">
            {uploading
            ?
            <h5
                style={{
                  margin: 0,
                  marginTop: "15%",
                  msTransform: "translateY(-50%)",
                  transform: "translateY(-50%)",
                }}
              >
                <Spin /> &nbsp;
                Uploading...
                </h5>
                :
                <>
                {data.logo
                ?
                <label for={randnum}>
                    <img
                    src={`${data.logo.url}?tr=w-150,h-150`}
                    alt="productimage"
                    style={{border:'1px solid #cccccc'}}
                    />
                </label>
                :
                <label for={randnum}>
                    <img
                    src="https://ik.imagekit.io/nextjsecommerce/OTHER_IMAGES/noimage?tr=w-150,h-150"
                    alt="productimage"
                    style={{border:'1px solid #cccccc'}}
                    />
                </label>
                }
                

                <div className="ui input">
                    <IKContext
                    publicKey={process.env.imagekitPublicKey}
                    urlEndpoint={process.env.imagekitUrlEndpoint}
                    authenticationEndpoint={process.env.backendURL+'/imagekitauth'}
                    >
                    <IKUpload
                        id={randnum}
                        useUniqueFileName={true}
                        folder={"/courierimages"}
                        onChange={handleImageChangeClick}
                        onError={handleImageChangeError}
                        onSuccess={handleImageChange}
                        multiple={false}
                        accept="image/png, image/gif, image/jpeg"
                        hidden
                    />
                    </IKContext>
                </div>
                </>
                }
            </div>
          </div>

          <Button type="primary" htmlType="submit" onClick={showDrawer} loading={loading} icon={<PlusOutlined />}>
             Create
          </Button>
          </Form>
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({});


export default connect(mapStateToProps, {fetchCourier})(CourierCreateDrawer);
