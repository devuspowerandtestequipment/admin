import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Drawer, Button, Popconfirm, Rate } from 'antd';
import { Grid } from "semantic-ui-react";
  import { ReactSortable } from "react-sortablejs";
import { ApiFilled, DeleteOutlined, EyeOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import Moment from 'react-moment';
import moment from 'moment';
import Link from 'next/link';

export const DrawerConfigProductImageView = (props) => {
    const [visible, setVisible] = useState(false);
    
    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };


  return (
    <>
    {props.bigButton
    ?<Button type='primary' onClick={showDrawer} icon={<InfoCircleOutlined />}>Info</Button>
    :<Button type='primary' size='small' onClick={showDrawer} icon={<InfoCircleOutlined />} />
    }
    
    <Drawer title={'Review Details'} placement="right" onClose={onClose} visible={visible}>
 
        <h4><Moment format="LLLL">{props.data.createdAt}</Moment>  <br />
        ({moment(props.data.createdAt).fromNow()})</h4>
        <div className="site-layout-background" >
              <h3 className='text-primary'>Review Information</h3>
              <div className='lhdiv'>
                <p><b>Rating:</b> <Rate value={props.data.rating} /></p>
                <p><b>Comment:</b> {props.data.comment}</p>
                
              </div>
        </div>
        <br />
        <br />

        <div className="site-layout-background" >
              <h3 className='text-primary'>
                User Information
                <Link href={`/users/${props.data.user_id._id}`}>
                    <Button type='primary' size='small' icon={<UserOutlined />}>
                    </Button>
                </Link>
              </h3>
              <div className='lhdiv'>
                <p><b>Name:</b> {props.data.user_id.name}</p>
                <p><b>Email:</b> {props.data.user_id.email}</p>
              </div>
        </div>
        <br />
        <br />


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
        <br />
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
        
    </Drawer>
    </>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerConfigProductImageView)