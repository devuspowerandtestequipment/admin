import React, { useEffect, useState } from "react";
import { Drawer, Button, message } from "antd";
import { connect } from "react-redux";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Form } from "semantic-ui-react";
import axios from "axios";
import { useRouter } from "next/router";
import Moment from 'react-moment';
import moment from "moment";
import Link from "next/link";

export const DrawerPageView = (props) => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [formloading, setFormloading] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };


  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<EyeOutlined />}>
        View
      </Button>
      <Drawer
        title="Page Visit Details"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <h4><Moment format="LLLL">{props.data.createdAt}</Moment>  <br />
        ({moment(props.data.createdAt).fromNow()})</h4>

        {props.data.user_id &&
        <div className="site-layout-background" >
            <h3 className='text-primary'>User Information</h3>
            <div className='lhdiv'>
            <p><b>Name:</b> {props.data.user_id.name}</p>
            <p><b>Email:</b> {props.data.user_id.email}</p></div>
            <br />
            <Link href={`/users/${props.data.user_id._id}`}>View user</Link>
            <br />
        </div>
        }


        {props.data.deviceinfo &&
          <div className="site-layout-background" >
              <h3 className='text-primary'>Device Information</h3>
              <div className='lhdiv'>
              <p><b>OS Name:</b> {props.data.deviceinfo.osName}</p>
              <p><b>OS Version:</b> {props.data.deviceinfo.osVersion}</p>
              <p><b>Mobile Vendor:</b> {props.data.deviceinfo.mobileVendor}</p>
              <p><b>Mobile Model:</b> {props.data.deviceinfo.mobileModel}</p>
              <p><b>Device Type:</b> {props.data.deviceinfo.deviceType}</p>
              <p><b>Browser Name:</b> {props.data.deviceinfo.browserName}</p>
              <p><b>Browser Version:</b> {props.data.deviceinfo.browserVersion}</p>
              </div>
          </div>
        }
        
        <br />
        {props.data.ipinfo &&
        <div className="site-layout-background" >
            <h3 className='text-primary'>IP Information</h3>
            <div className='lhdiv'>
            <p><b>IP:</b> {props.data.ipinfo.ipAddress}</p>
            <p><b>Country:</b> {props.data.ipinfo.countryName}</p>
            <p><b>State:</b> {props.data.ipinfo.regionName}</p>
            <p><b>City:</b> {props.data.ipinfo.cityName}</p>
            <p><b>ZIP:</b> {props.data.ipinfo.zipCode}</p>
            <p><b>Latitude:</b> {props.data.ipinfo.latitude}</p>
            <p><b>Longitude:</b> {props.data.ipinfo.longitude}</p>
            <iframe title="IP Location" src={`//maps.google.com/maps?q=${props.data.ipinfo.latitude},${props.data.ipinfo.longitude}&z=15&output=embed`} width="100%" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" />
            </div>
        </div>
        }

      </Drawer>
    </>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps,)(DrawerPageView);
