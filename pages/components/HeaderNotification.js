import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {fetchNotifications,fetchCartItems} from '../../store/actions'
import { Dropdown, Grid, Icon } from 'semantic-ui-react'
import { Button, Badge, Avatar, message } from 'antd'
import _ from 'lodash'
import { NotificationOutlined } from '@ant-design/icons'
import Moment from 'react-moment'
import moment from 'moment'
import DynamicNotificationStatus from './DynamicNotificationStatus'
import axios from 'axios'
import { useRouter } from 'next/router'

export const HeaderNotification = (props) => {

const router = useRouter();
 useEffect(()=>{
    props.fetchNotifications();
 },[])

 const triggerNotification = (
    <span>
        <Badge>
        {_.filter(props.datas, ['is_viewed', false]).length>0 && <span className="pulse"></span>}
        
        <Avatar style={{ backgroundColor: '#f0ffff00',fontSize:'20px' }} icon={<NotificationOutlined />} /> 
        </Badge>&nbsp;&nbsp;&nbsp;&nbsp;
    </span>
  )


  const viewUrl = (id,url) =>{
    router.push(url);
  }

  const handleReadallNotifications=()=>{
    axios
    .get(`${process.env.backendURL}/user/admin_readall_notifications`)
    .then((response) => {
      if (response.data.response) {
        props.fetchNotifications();
        message.success("Success");
      }
    });
  }


  return (
    <>
    <Dropdown trigger={triggerNotification} text='Menu' icon={null} >
        <Dropdown.Menu className='left headertext98'>
            {_.filter(props.datas, ['is_viewed', false]).length>0
            ?
            <>
            <p className="headertext98_head3 cursor-pointer">Notifications ({_.filter(props.datas, ['is_viewed', false]).length}) <span onClick={()=>handleReadallNotifications()}>Mark all as Read</span></p>
            <div className="headertext98_head3_div1">
            
            {_.filter(_.take(props.datas,5), ['is_viewed', false]).map((data,key)=>{
                return(
                    <Grid className="headertext98_head3_div1_grid" key={data._id}>
                        <Grid.Column mobile={16} style={{padding:'13px 9px'}} >
                            <div onClick={()=>viewUrl(data._id,data.info_url)}>
                            <p><DynamicNotificationStatus status={data.message} user={data.user_id} /></p>
                            {data.user_id
                                ?<h6><span style={{color:'#000000'}}>{data.user_id.name}</span> | {moment(data.createdAt).fromNow()}</h6>
                                :<h6>{moment(data.createdAt).fromNow()}</h6>
                            }
                            </div>
                        </Grid.Column>
                    </Grid>
                )
            })}
    
            {/* <p>New contact us message received New contact us message received New contact us message received New contact us message receivedNew contact us message received New contact us message received New contact us message received New contact us message received</p> */}
            </div>
            <div className="headertext98_button1">
                <Button size="small" type='primary' style={{width:'100%'}}>View all Notifications</Button>
            </div>
            </>
            :
            <>
            <div className="headertext98_head3_div1" style={{padding:'0px',marginBottom:'-26px'}}>
                <center>No notifications found</center>
            </div>
            <div className="headertext98_button1">
                <Button size="small" type='primary' style={{width:'100%'}} onClick={()=>router.push('/notifications')}>View all Notifications</Button>
            </div>
            </>
            }
        </Dropdown.Menu>
    </Dropdown>
    </>
  )
}

const mapStateToProps = (state) => ({
    datas: state.all_notifications,
})

export default connect(mapStateToProps, {fetchNotifications,fetchCartItems})(HeaderNotification)