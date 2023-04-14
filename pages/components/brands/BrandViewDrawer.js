import React, { useState, useEffect } from "react";
import { Drawer, Button, Tag } from "antd";
import { connect } from "react-redux";
import { EyeOutlined } from "@ant-design/icons";
import Moment from 'react-moment';


export const BrandViewDrawer = (props) => {
  
  const [visible, setVisible] = useState(false);
  const [branddata, setBrandDatas] = useState(null);

  useEffect(()=>{
    setBrandDatas(props.data)
  },[props])

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<EyeOutlined />}>View</Button>
      <Drawer
        title="Brand Details"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        
        {branddata===null
        ?<></>
        :
        <>
        <center>
          <img src={`${process.env.imagekiturl}${branddata.image}`} style={{width:'80%'}} />
        </center>
        <br />
        <br />
        <p><b>Brand Name:</b> {branddata.name}</p>
        <p><b>Brand URL:</b> {branddata.url}</p>
        
        <p><b>Brand Created:</b> <Moment format="YYYY-MM-DD dddd  HH:mm:ss">{branddata.createdAt}</Moment></p>
        <p><b>Brand Status:</b> {branddata.status==='Active'
            ?
            <Tag color={'green'}>
                  Active
            </Tag>
            :
            <Tag color={'red'}>
                  InActive
            </Tag>
            }</p>


        
        </>
        }
      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({});


export default connect(mapStateToProps)(BrandViewDrawer);
