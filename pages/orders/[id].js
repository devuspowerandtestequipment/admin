import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Body from '../components/Body'
import {Breadcrumb, Button, Col, Layout, message, Row, Segmented, Steps, Timeline,Divider,Space, Tag, Tooltip, Alert, Popconfirm, Spin, PageHeader   } from "antd";
import { useRouter } from 'next/router';
import axios from 'axios';
import Moment from 'react-moment';
import moment, * as moments from 'moment';
import { AiFillEdit } from "react-icons/ai";
import { Table,Comment,Form,Grid, Tab, List, GridColumn, Label } from 'semantic-ui-react';
import CartProductView1 from '../components/cart/CartProductView1';
import DynamicAmount from '../components/DynamicAmount';
import ModalUpdateOrderStatus from '../components/order/ModalUpdateOrderStatus';
import {fetchCourier,fetchOrders} from '../../store/actions'
import ModalUpdateCourierStatus from '../components/order/ModalUpdateCourierStatus';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import DrawerUpdateShippingAddress from '../components/order/DrawerUpdateShippingAddress';
import DownloadInvoice from '../components/order/DownloadInvoice';
import Head from 'next/head';
import * as customPrice from '../../custom_functions/customPrice';
import * as customFunctions from '../../custom_functions/customFunctions';
import * as customTimeline from '../../custom_functions/customTimeline';
import ModalUpdateOrderPaymentinformation from '../components/order/ModalUpdateOrderPaymentinformation';
import Link from 'next/link';


const { Header, Content, Footer, Sider } = Layout;
const { Step } = Steps;
export const View = (props) => {
  const router = useRouter();
  
  const [saving_record,setSaving]=useState(false);
  const [data,setData]=useState(false);
  const [timelines,setTimelines]=useState(false);




  function getData(){
    setSaving(true);
    axios.get(`${process.env.backendURL}/order/${router.query.id}`)
    .then(response=>{
        if(response.data.response){
            console.log('data_fetched',response.data.data)
            setData(response.data.data)
            setTimelines(response.data.timelines);
            setSaving(false);
            if(response.data.data.isAdminSeen===false){ //if admin not viewed new product then fetch all data
                props.fetchOrders();
            }
        }else{
            router.push('/orders')
        }
    })
  }
  useEffect(()=>{
    getData();
    props.fetchCourier();

  },[])


  const getDate=(data)=>{
    return moment(data).format('L')
  }


  const convertToPrice=price=>{
    return <DynamicAmount amount={price} />
  }

  const generateInvoice = () => {
    setSaving(true);
    var tmp_products=[];

    data.products.forEach(element => {
        var xdata={
            name:element.product_name,
            price_without_tax:customPrice.priceShow(element.product_price),
            price_with_tax:customPrice.priceShow(customFunctions.calculateTax(element)),
            quantity:element.quantity,
            total_amount_without_tax:customPrice.priceShow(element.product_price*element.quantity),
            total_amount_with_tax:customPrice.priceShow(customFunctions.calculateTax(element)*element.quantity),
        }
        tmp_products.push(xdata)
        // console.log(element)
    });

    var coupon='-';
    var couponvalue='-';

    if(data.coupon){
        coupon=data.coupon.name;
        if(coupon.type==='1'){
            couponvalue=`${data.coupon.percentage}% OFF`;
        }else{
            couponvalue=`${customPrice.priceShow(data.coupon.amount)} OFF`
        }
    }

    var tmp_data={
        id:data._id,
        invoice_number:process.env.invoiceCode+''+process.env.invoiceCodeNumber+data.invoice_number,
        order_id:data.order_id,
        order_date:getDate(data.createdAt),
        payment_status:data.payment_status,
        payment_type:data.payment_type,
        products:tmp_products,
        subtotal:customPrice.priceShow(data.amount_subtotal),
        taxes:customPrice.priceShow(data.amount_taxes),
        shipping:customPrice.priceShow(data.amount_shipping),
        coupon:coupon,
        coupon_value:couponvalue,
        total:customPrice.priceShow(data.amount_total_final),
        invoice_user_info:{
            name:data.user_shipping_address.name,
            email:data.user_shipping_address.email,
            phone:data.user_shipping_address.phone1+' '+data.user_shipping_address.phone1,
            addr1:data.user_shipping_address.state+' '+data.user_shipping_address.country,
            addr2:data.user_shipping_address.towncity+' '+data.user_shipping_address.zip,
            addr3:data.user_shipping_address.houseno+' '+data.user_shipping_address.areastreet+' '+data.user_shipping_address.landmark,
        },
    }

    axios.post(`${process.env.backendURL}/order/generate_invoice`,tmp_data)
    .then(response=>{
        console.log('invoice_generation_done');
        getData();
        console.log(response.data)
    })
  }



  const updateOrderStatus = (status) => {
    setSaving(true);
    var tmp_data={
        id:data._id,
        order_status:status,
    }
    axios.post(`${process.env.backendURL}/order/update_order_status`,tmp_data)
    .then(response=>{
        message.success('Success');
        generateInvoice();
    })
  }


  const deleteSingleTimeline = (id) => {

    axios.get(`${process.env.backendURL}/order/delete_single_timeline_item/${id}`)
    .then(response=>{
        message.success('Success');
        getData();
    })
  }


  const deleteOrder = () => {
    axios.get(`${process.env.backendURL}/order/delete_order/${router.query.id}`)
    .then(response=>{
        if(response.data.response){
            router.push('/orders');

            message.success('Success');

        }else{
            alert('Failed')
        }
    })

  }


  console.log(data.invoice_pdf)

  return (
    <Body>
        <Head>
            <title>Order Details</title>
        </Head>
        <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item><Link href='/'>Dashbord</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link href='/orders'>Orders</Link></Breadcrumb.Item>
                <Breadcrumb.Item>Order Details</Breadcrumb.Item>
            </Breadcrumb>
            {data
            ?
            <>
            <PageHeader
                onBack={() => router.push('/orders')}
                ghost={false}
                className="site-page-header-gray"
                title="Order Details"
                tags={
                    <>
                    
                        {/* {data.status===true
                            ?<Tag color="#87d068">Active</Tag>
                            :<Tag color="#f50">Inactive</Tag>
                        }
                        &nbsp;
                        {data.emailverification===true
                            ?<Tag color="#87d068">Verified</Tag>
                            :<Tag color="#f50">Pending</Tag>
                        } */}
                        
                    </>
                
                }
                extra={[
                    <ModalUpdateOrderStatus data={data} order_id={data._id} order_status={data.order_status} getData={getData} generateInvoice={generateInvoice} />,
                    <>
                    {data.invoice_pdf &&
                        <DownloadInvoice invoice_pdf={data.invoice_pdf} order_id={data.order_id} />
                    }
                    </>,
                    <Popconfirm
                        title="Are you sure to delete this order?"
                        onConfirm={deleteOrder}
                        // onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>Delete</Button>
                    </Popconfirm>
                    // <UserEditDrawer data={data} getData={getData} />,
                    // <Popconfirm
                    // title="Are you sure to delete this user?"
                    // onConfirm={deleteUser}
                    // // onCancel={cancel}
                    // okText="Yes"
                    // cancelText="No"
                    // >
                    //     <Button type="danger" icon={<DeleteOutlined />}>
                    //     Delete
                    //     </Button>
                    // </Popconfirm>
                    
                ]}
                />
            
            <Spin spinning={saving_record}>
            <br />
            <br />

            <Grid>
                <Grid.Column mobile={16} tablet={16} computer={16}>
                    <Steps size="small" current={data.order_status}>
                        <Step title="Waiting" />
                        <Step title="Accepted" />
                        <Step title="In Progress" />
                        <Step title="Packing" />
                        <Step title="Ready For Pickup" />
                        <Step title="Shipped" />
                        <Step title="Delivered" />
                    </Steps>

                    
                </Grid.Column>
                
                <Grid.Column mobile={16} tablet={16} computer={12}>

                    {data.order_status==='1' && 
                    <>
                    <Alert
                        message="Waiting for approval..."
                        // description="Info Description Info Description Info Description Info Description"
                        type="warning"
                        action={
                            <Space direction="vertical">
                            <Button size="small" type="primary" onClick={()=>updateOrderStatus(2)}>
                                Accept
                            </Button>
                            <Button size="small" type="primary" danger  onClick={()=>updateOrderStatus(0)}>
                                Cancel
                            </Button>
                            </Space>
                        }
                    />
                    <br />
                    </>
                    }
                    

                    <div className="site-layout-background" style={{ padding: 24 }}>

                        

                        <h4>#{data.order_id}


                        {/* <p onClick={generateInvoice}>Generate Invoice</p> */}


                        
                        

                        {data.order_status==='1'
                        ?
                        <div className='float-right'>
                        {/* <h1>Product is waiting for approval..</h1>
                        <p onClick={()=>updateOrderStatus(2)}>Approve</p>
                        <p onClick={()=>updateOrderStatus(99)}>Cancel</p> */}
                        </div>
                        :
                        <Space warp style={{float:'right'}}>
                            {/* <Button type="primary">Login as user</Button> */}
                            {/* <Button type="primary">Email</Button> */}
                            
                            
                            

                        </Space>
                        }
                        
                        
                        </h4>
                        {/* <h4>{data.order_id}</h4> */}
                        <p><Moment format="LLL">{data.createdAt}</Moment></p>

                        {/* CANCELLED IMAGE */}
                        {data.order_status==='0' && <img src='https://t4.ftcdn.net/jpg/00/85/97/69/360_F_85976944_MSgSpUlo082PlGOuXTOdY2eSE0YqkeWw.jpg'  style={{width:'200px'}} />}
                        
                        {/* DELIVERED IMAGE */}
                        {data.order_status==='7' &&  <img src='https://t3.ftcdn.net/jpg/04/86/07/96/360_F_486079627_5ExbyF50uHlJLHfv7i6XxV8ZuJzWNNA4.jpg'  style={{width:'200px'}} />}


                        

                        <br />
                        <h3 className='text-primary'>Product Details</h3>
                        {/* <Table basic='very'> */}
                        <Table unstackable>
                            <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Price (with tax)</Table.HeaderCell>
                                <Table.HeaderCell>Quantity</Table.HeaderCell>
                                {/* <Table.HeaderCell>Tax</Table.HeaderCell> */}
                                <Table.HeaderCell textAlign='right'>Total</Table.HeaderCell>
                            </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {data.products.map((product,key)=>{
                                    return(
                                        <CartProductView1 product={product} key={key} />
                                    )
                                })}
                            </Table.Body>

                        </Table>
                        <div style={{textAlign:'end'}}>
                            <h5 className='ct121d'><b>Subtotal:&nbsp;&nbsp;</b> <DynamicAmount amount={data.amount_subtotal} /></h5>
                            <h5 className='ct121d'><b>Tax:&nbsp;&nbsp;</b> <DynamicAmount amount={data.amount_taxes} /></h5>
                            <h5 className='ct121d'><b>Shipping:&nbsp;&nbsp;</b> <DynamicAmount amount={data.amount_shipping} /></h5>
                            
                            {data.coupon
                            ?
                            <>
                            <h5 className='ct121d' style={{marginBottom:'4px'}}><b>Coupon:&nbsp;&nbsp;</b> {data.coupon.name}</h5>
                            <small>
                                {data.coupon.type==='1'
                                ?
                                <>{data.coupon.percentage}% OFF</>    
                                :
                                <><DynamicAmount amount={data.coupon.amount} /> OFF</>    
                                }
                            </small>
                            </>
                            :
                            <></>}
                            <h3 className='ct121d'><b>Total:&nbsp;&nbsp;</b> <DynamicAmount amount={data.amount_total_final} /></h3>
                        </div>

                        
                        
                        <br />
                        <h3 className='text-primary'>Courier Details <ModalUpdateCourierStatus data={data} getData={getData} /></h3>
                        {!data.courier_id
                        ?
                        <>Not Found</>
                        :
                        <Grid>
                            <Grid.Column mobile={16} tablet={16} computer={2}>
                                <img src={`${data.courier_id.logo.url}?tr=w-80,h-80,q=50`} style={{width:'100%'}} />
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={16} computer={14}>
                                <br />
                                <div className='lhdiv'>
                                <p><b>Name:</b> {data.courier_id.name}</p>
                                <p><b>Tracking ID:</b> {data.courier_tracking_id}</p>
                                <p><b>Tracking URL:</b> https://www.dhl.com/in-en/home/tracking.html</p>
                                </div>
                            </Grid.Column>
                        </Grid>
                        }

                    </div>
                    <br />
                    

                    <Grid>
                        <Grid.Column mobile={16} tablet={16} computer={8}>
                        <div className="site-layout-background" style={{ padding: 24 }}>
                            <h3 className='text-primary'>Send Message</h3>
                            <Comment.Group>

                            <Comment>
                            <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                            <Comment.Content>
                                <Comment.Author as='a'>Matt</Comment.Author>
                                <Comment.Metadata>
                                <div>Today at 5:42PM</div>
                                </Comment.Metadata>
                                <Comment.Text>How artistic!</Comment.Text>
                                <Comment.Actions>
                                <Comment.Action>Reply</Comment.Action>
                                </Comment.Actions>
                            </Comment.Content>
                            </Comment>

                            <Comment>
                            <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
                            <Comment.Content>
                                <Comment.Author as='a'>Elliot Fu</Comment.Author>
                                <Comment.Metadata>
                                <div>Yesterday at 12:30AM</div>
                                </Comment.Metadata>
                                <Comment.Text>
                                <p>This has been very useful for my research. Thanks as well!</p>
                                </Comment.Text>
                                <Comment.Actions>
                                <Comment.Action>Reply</Comment.Action>
                                </Comment.Actions>
                            </Comment.Content>
                            </Comment>

                        </Comment.Group>

                        </div>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={16} computer={8}>
                            <div className="site-layout-background" style={{ padding: 24 }}>
                            <h3 className='text-primary'>Timeline</h3>
                            {timelines && 
                                <Timeline>
                                    {timelines.map((tl)=>{
                                        return(
                                            <Timeline.Item key={tl._id}>{customTimeline.timelineShow(tl,deleteSingleTimeline)}</Timeline.Item>
                                        )
                                    })}
                                </Timeline>
                            }
                            
                            
                            {/* <Timeline>
                                {timelines.map((timeline)=>{
                                    return(
                                        <Timeline.Item key={timeline._id}>{timeline} Mon, May 8 2023</Timeline.Item>
                                    )
                                })}
                            </Timeline> */}
                            {/* <Timeline>
                                
                                <Timeline.Item>Approved on Mon, May 8 2023</Timeline.Item>
                                <Timeline.Item>Invoice created on Mon, May 8 2023 <br /> <a>Download Invoice</a></Timeline.Item>
                                <Timeline.Item>
                                    The Invoice has been send to the customer 2015-09-01 <br />
                                    <a>Send</a>
                                </Timeline.Item>
                                <Timeline.Item>In progress Mon, May 8 2023</Timeline.Item>
                                <Timeline.Item>Packed on Mon, May 8 2023</Timeline.Item>
                                <Timeline.Item>Ready for pickup on Mon, May 8 2023
                                    <br />
                                    <a>Download PDF</a>
                                </Timeline.Item>
                                <Timeline.Item>
                                    Shipped by DHL on Mon, May 8 2023 
                                    <br />
                                    <a>Tracking URL</a>
                                </Timeline.Item>
                                <Timeline.Item>Delivered on Mon, May 8 2023</Timeline.Item>

                                
                                
                                
                            </Timeline> */}
                            </div>
                        </Grid.Column>
                    </Grid>


                </Grid.Column>
                <Grid.Column mobile={16} tablet={16} computer={4}>
                    <div className="site-layout-background" style={{ padding: 24 }}>
                        <h3 className='text-primary'>Customer Details
                        <Tooltip title='Edit User'>
                            <Button type='primary' size='small' icon={<AiFillEdit />} className='float-right' />
                        </Tooltip>
                        <Tooltip title='View Details'>
                            <Button type='primary' size='small' icon={<EyeOutlined />} className='float-right' />
                        </Tooltip>
                        &nbsp;
                        </h3>
                        {data.user_id===null
                        ?
                        <>
                            User not found
                        </>
                        :
                        <div className='lhdiv'>
                            <p><b>Name:</b> {data.user_id.name}</p>
                            <p><b>Email:</b> {data.user_id.email}</p>
                        </div>
                        }
                    </div>
                    <br />
                    <div className="site-layout-background" style={{ padding: 24 }}>
                        <h3 className='text-primary'>Order Information</h3>
                        <div className='lhdiv'>
                        <p><b>Order ID:</b> {data.order_id}</p>
                        <p><b>Order Date:</b> <Moment format="llll">{data.createdAt}</Moment></p>
                        <p><b>Order Status:</b> {data.order_status}</p>
                        <p><b>Placed from IP:</b></p>
                        
                        </div>
                    </div>
                    <br />

                    <div className="site-layout-background" style={{ padding: 24 }}>
                        <h3 className='text-primary'>Payment Information
                        <span style={{float:'right'}}>
                            <Tooltip title='Edit Payment Information'>
                                <ModalUpdateOrderPaymentinformation data={data} generateInvoice={generateInvoice} getData={getData} />
                            </Tooltip>
                        </span>
                        </h3>
                        <div className='lhdiv'>
                        <p><b>Total Amount:</b> <DynamicAmount amount={data.amount_total_final} /></p>
                        <p><b>Payment:</b> {data.payment_status}</p>
                        <p><b>Type:</b> {data.payment_type}</p>

                        </div>
                    </div>
                    <br />

                    <div className="site-layout-background" style={{ padding: 24 }}>
                        <h3 className='text-primary'>Billing / Shipping Address
                        <DrawerUpdateShippingAddress data={data} getData={getData} />
                        </h3>
                        <div className='lhdiv'>
                        <p><b>Name:</b> {data.user_shipping_address.name}</p>
                        <p><b>Email:</b> {data.user_shipping_address.email}</p>
                        <p><b>Contact 1:</b> {data.user_shipping_address.phone1}</p>
                        <p><b>Contact 2:</b> {data.user_shipping_address.phone2}</p>
                        <p><b>Country:</b> {data.user_shipping_address.country}</p>
                        <p><b>State:</b> {data.user_shipping_address.state}</p>
                        <p><b>Town/City:</b> {data.user_shipping_address.towncity}</p>
                        <p><b>ZIP:</b> {data.user_shipping_address.zip}</p>
                        <p><b>House number:</b> {data.user_shipping_address.houseno}</p>
                        <p><b>Area/Street:</b> {data.user_shipping_address.areastreet}</p>
                        <p><b>Landmark:</b> {data.user_shipping_address.landmark}</p>
                        <br />
                        <p><b>Shipping Note:</b> {data.shipping_note}</p> 
                        <p><b>Shipping Method:</b> {data.shipping_method && data.shipping_method.name}</p>
                        </div>
                    </div>
                    <br />

                    <div className="site-layout-background" style={{ padding: 24 }}>
                        <h3 className='text-primary'>Device Information</h3>
                        <div className='lhdiv'>

                        <p><b>OS Name:</b> {data.deviceinfo.osName}</p>
                        <p><b>OS Version:</b> {data.deviceinfo.osVersion}</p>
                        <p><b>Mobile Vendor:</b> {data.deviceinfo.mobileVendor}</p>
                        <p><b>Mobile Model:</b> {data.deviceinfo.mobileModel}</p>
                        <p><b>Device Type:</b> {data.deviceinfo.deviceType}</p>
                        <p><b>Browser Name:</b> {data.deviceinfo.browserName}</p>
                        <p><b>Browser Version:</b> {data.deviceinfo.browserVersion}</p>


                        </div>
                    </div>
                    <br />

                    <div className="site-layout-background" style={{ padding: 24 }}>
                        <h3 className='text-primary'>IP Information</h3>
                        <div className='lhdiv'>

                        <p><b>IP:</b> {data.ipinfo.ipAddress}</p>
                        <p><b>Country:</b> {data.ipinfo.countryName}</p>
                        <p><b>State:</b> {data.ipinfo.regionName}</p>
                        <p><b>City:</b> {data.ipinfo.cityName}</p>
                        <p><b>ZIP:</b> {data.ipinfo.zipCode}</p>
                        <p><b>Latitude:</b> {data.ipinfo.latitude}</p>
                        <p><b>Longitude:</b> {data.ipinfo.longitude}</p>
                        <iframe title="IP Location" src={`//maps.google.com/maps?q=${data.ipinfo.latitude},${data.ipinfo.longitude}&z=15&output=embed`} width="100%" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" />


                        </div>
                    </div>
                </Grid.Column>
            </Grid>
            </Spin>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />


            <div className="site-layout-background" style={{ padding: 24 }}>
                <h4>{data.order_id} | {data.order_status}
                

                <Space warp style={{float:'right'}}>
                    <Button type="primary">Login as user</Button>

                    <Button type="primary">Email</Button>



                    <ModalUpdateOrderStatus order_id={data._id} order_status={data.order_status} getData={getData} />
                    <ModalUpdateCourierStatus data={data} getData={getData} />



                    <Button type="primary" danger>Delete</Button>
                </Space>
                
                </h4>
                
                {/* <Steps current={3}>
                    <Step title="Processing" />
                    <Step title="Canceled" />
                    <Step title="In Progress" />
                    <Step title="Waiting" />
                </Steps> */}


                {/* Canceled – Grey
                Completed – Blue
                Failed – Red
                On Hold – Orange
                Pending Payment – Grey
                Processing – Green
                Refunded – Grey */}

            </div>
            <br />
            
            <div className="site-layout-background" style={{ padding: 24 }}>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={5} xl={5}>
                        <h4>Order Information 
                            <span style={{float:'right'}}>
                                <Button type="primary" size='small'>Edit</Button>
                            </span>
                        </h4>
                        <hr/>
                        {/* <Divider orientation="left"><h4>Order Information</h4> </Divider> */}
                        <div className='lhdiv'>
                        <p><b>Order ID:</b> {data.order_id}</p>
                        <p><b>Order Date:</b> <Moment format="YYYY-MM-DD hh:mm:ss">{data.createdAt}</Moment></p>
                        <p><b>Order Status:</b> {data.order_status}</p>
                        <p><b>Placed from IP:</b></p>
                        <p><b>Method:</b> {data.payment_type}</p>
                        <p><b>Payment:</b> Paid</p>
                        <p><b>Status:</b> Processing</p>
                        </div>
                        {/* <Segmented options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} value={'Monthly'} /> */}
                        
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={1} xl={1}></Col>
                    <Col xs={24} sm={24} md={24} lg={5} xl={5}>
                        <h4>Billing / Shipping Address
                        <span style={{float:'right'}}>
                                <Button type="primary" size='small'>Edit</Button>
                            </span>
                        </h4>
                        <hr/>
                        <div className='lhdiv'>
                        <p><b>Name:</b> {data.user_shipping_address.name}</p>
                        <p><b>Email:</b> {data.user_shipping_address.email}</p>
                        <p><b>Contact 1:</b> {data.user_shipping_address.phone1}</p>
                        <p><b>Contact 2:</b> {data.user_shipping_address.phone2}</p>
                        <p><b>Country:</b> {data.user_shipping_address.country}</p>
                        <p><b>State:</b> {data.user_shipping_address.state}</p>
                        <p><b>Town/City:</b> {data.user_shipping_address.towncity}</p>
                        <p><b>ZIP:</b> {data.user_shipping_address.zip}</p>
                        <p><b>House number:</b> {data.user_shipping_address.houseno}</p>
                        <p><b>Area/Street:</b> {data.user_shipping_address.areastreet}</p>
                        <p><b>Landmark:</b> {data.user_shipping_address.landmark}</p>
                        <br />
                        <p><b>Shipping Note:</b> {data.shipping_note}</p> 
                        {/* <p><b>Shipping Method:</b> {data.shipping_method.name}</p> */}
                        </div>
                        
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={1} xl={1}></Col>

                    <Col xs={24} sm={24} md={24} lg={5} xl={5}>
                        <h4>User Information
                        <span style={{float:'right'}}>
                                <Button type="primary" size='small'>Edit</Button>
                            </span>
                        </h4>
                        <hr/>
                        <div className='lhdiv'>
                        {data.user_id===null
                        ?
                        <>
                        User not found
                        </>
                        :
                        <>
                        <p><b>Name:</b> {data.user_id.name}</p>
                        <p><b>Email:</b> {data.user_id.email}</p>
                        <p><b>Phone:</b> {data.user_id.phone1}</p>
                        <p><b>Country:</b> {data.user_id.country}</p>
                        <p><b>State:</b> {data.user_id.state}</p>
                        <p><b>City:</b> {data.user_id.city}</p>
                        </>
                        }
                        

                        </div>
                        
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={1} xl={1}></Col>
                    <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                        <h4>Timeline</h4>
                        <hr/>
                        <Timeline>
                            <Timeline.Item>An order has been placed 2015-09-01</Timeline.Item>
                            <Timeline.Item>
                                The Invoice has been created 2015-09-01 <br />
                                <a>Download Invoice</a>
                            </Timeline.Item>
                            <Timeline.Item>
                                The Invoice has been send to the customer 2015-09-01 <br />
                                <a>Send</a>
                            </Timeline.Item>
                            <Timeline.Item>Items have been shipped $200 2015-09-01</Timeline.Item>
                            <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                        </Timeline>
                    </Col>
                </Row>
            </div>
            <br />
            

            <div className="site-layout-background" style={{ padding: 24 }}>
            <h4>Products</h4>
            <hr/>
            <Table basic='very'>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Price (with tax)</Table.HeaderCell>
                    <Table.HeaderCell>Quantity</Table.HeaderCell>
                    {/* <Table.HeaderCell>Tax</Table.HeaderCell> */}
                    <Table.HeaderCell textAlign='right'>Total</Table.HeaderCell>
                </Table.Row>
                </Table.Header>

                <Table.Body>
                    {data.products.map((product,key)=>{
                        return(
                            <CartProductView1 product={product} key={key} />
                        )
                    })}
                </Table.Body>

            </Table>
            <div style={{textAlign:'end'}}>
                <h5 className='ct121d'><b>Subtotal:&nbsp;&nbsp;</b> <DynamicAmount amount={data.amount_subtotal} /></h5>
                <h5 className='ct121d'><b>Tax:&nbsp;&nbsp;</b> <DynamicAmount amount={data.amount_taxes} /></h5>
                <h5 className='ct121d'><b>Shipping:&nbsp;&nbsp;</b> <DynamicAmount amount={data.amount_shipping} /></h5>
                
                {data.coupon
                ?
                <h5 className='ct121d'><b>Coupon:&nbsp;&nbsp;</b> {data.coupon.name}</h5>
                :
                <></>}
                <h3 className='ct121d'><b>Total:&nbsp;&nbsp;</b> <DynamicAmount amount={data.amount_total_final} /></h3>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />

            </div>
            </>
            :
            <>loading..</>
            }
          
        </Content>
    </Body>
  )
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {fetchCourier,fetchOrders})(View)