import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Body from "../components/Body";
import {
  Layout,
  Breadcrumb,
  PageHeader,
  Row,
  Col,
  Tabs,
  Button,
  Switch,
  Tag,
  Spin,
  message,
  Popconfirm,
} from "antd";
import { DeleteOutlined, LoginOutlined, PlusOutlined } from "@ant-design/icons";
import UserViewLoginLogs from "../components/users/view/UserViewLoginLogs";
import axios from "axios";
import { useRouter } from "next/router";
import Moment from "react-moment";
import moment from "moment";
import UpdateProfileImage from "../components/users/UpdateProfileImage";
import UserEditDrawer from "../components/users/UserEditDrawer";
import UserTabCartList from "../components/users/view/UserTabCartList";
import UserTabOrderList from "../components/users/view/UserTabOrderList";
import UserTabDashboard from "../components/users/view/UserTabDashboard";
import Link from "next/link";
import Head from "next/head";
import {fetchUsers} from '../../store/actions'
import UserTabReviews from "../components/users/view/UserTabReviews";
import UserTabVisitedProducts from "../components/users/view/UserTabVisitedProducts";
import UserTabPaymentHistory from "../components/users/view/UserTabPaymentHistory";

const { Header, Content, Footer, Sider } = Layout;
const { TabPane } = Tabs;

export const view = (props) => {
    const router = useRouter();
    const [saving_record,setSaving]=useState(false);
    const [data,setData]=useState(false);

    const [tab,setTab]=useState('dashboard')

    function getData(){
        var id=router.query.id;
        if(id){
            axios.get(`${process.env.backendURL}/user/admin_view_user_details/${id}`)
            .then(response=>{
                if(response.data.response){
                    setData(response.data.data);
                    if(response.data.data.isAdminSeen===false){ //if admin not viewed new product then fetch all data
                        props.fetchUsers();
                    }
                }else{
                    message.warning('User not available');
                    router.push('/users');
                }
            })
        }else{
            router.push('/users');
        }
    }

    useEffect(()=>{
        getData();

        
        if(router.query.tab){
            setTab(router.query.tab);
        }


        //seen all cart under this user
        // axios.get(`${process.env.backendURL}/cart/admin_setseen_all_userscart/${props.user_id}`)
        // .then(response=>{
        //     props.fetchCartItems();
        // })


        //clear all notification activity under this user
        // props.clearSingleNotificationByUserId(props.user_id)
        // .then(rw=>{
        //     props.fetchNotifications();
        // })


        
    },[])

    const verifyEmail = () => {

        var tmpdata=data;
        data.emailverification=true;
        axios.put(`${process.env.backendURL}/user/${data._id}`,tmpdata)
        .then(response=>{
        if(response.data.response){
            getData();
            message.success('Success');
        }else{
            message.warning(response.data.message)
        }
        })
    }

    const deleteUser =()=> {
        axios.get(`${process.env.backendURL}/user/admin_delete_user_details/${data._id}`)
        .then(response=>{
            if(response.data.response){
                router.push('/users');
                message.success('Success');
            }else{
                message.warning(response.data.message)
            }
        })
    }

    const login_as_user =()=> {
        axios.get(`${process.env.backendURL}/user/login_as_user_step1/${data._id}`)
        .then(response=>{

            let a= document.createElement('a');
            a.target= '_blank';
            a.href= `${process.env.frontendURL}/loginuser?lgid=${response.data.uuid}`
            a.click();


        })
    }
    

    if(props.auth && props.auth.admin_role){  //<===User view role check
        if(props.auth.admin_role.user_view===false){
            router.push('/users')
        }
    }


    return (
        <Body>
            <Head><title>User Details</title></Head>
            <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item><Link href='/'>Dashboard</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link href='/users'>Users</Link></Breadcrumb.Item>
                <Breadcrumb.Item>User Detail</Breadcrumb.Item>
            </Breadcrumb>
            {data &&
                <PageHeader
                // onBack={() => window.history.back()}
                ghost={false}
                className="site-page-header-gray"
                title="User Details"
                tags={
                    <>
                    
                        {data.status===true
                            ?<Tag color="#87d068">Active</Tag>
                            :<Tag color="#f50">Inactive</Tag>
                        }
                        &nbsp;
                        {data.emailverification===true
                            ?<Tag color="#87d068">Verified</Tag>
                            :<Tag color="#f50">Pending</Tag>
                        }
                        
                    </>
                
                }
                extra={[
                    props.auth && props.auth.admin_role && //<===User login as user role check
                        props.auth.admin_role.user_login_as_user_account &&
                            <Button type="primary" icon={<LoginOutlined />} onClick={()=>login_as_user()}>
                                Account Login
                            </Button>,

                    props.auth && props.auth.admin_role && //<===User edit role check
                        props.auth.admin_role.user_edit &&
                            <UserEditDrawer data={data} getData={getData} />,

                    
                    props.auth && props.auth.admin_role && //<===User delete role check
                        props.auth.admin_role.user_delete &&
                            <Popconfirm
                            title="Are you sure to delete this user?"
                            onConfirm={deleteUser}
                            okText="Yes"
                            cancelText="No"
                            >
                                <Button type="danger" icon={<DeleteOutlined />}>
                                Delete
                                </Button>
                            </Popconfirm>
                    
                ]}
                />
            }
            
            <br />

            {!data
            ?<>Loading...</>
            :
            <Spin spinning={saving_record}>

            <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={8} xxl={6}>
                <div className="site-layout-background" style={{ padding: 24 }}>
                <center>
                    {/* <img src={`${process.env.imagekiturl}/${data.image.filePath}?tr=w-200,h-200`} style={{borderRadius:'50%'}} /> */}

                    {/* {data.image
                    ?<img src={`${process.env.imagekiturl}/${data.image.filePath}?tr=w-200,h-200`} style={{borderRadius:'50%'}} />
                    :<img src={`${process.env.imagekiturl}/OTHER_IMAGES/blankprofilepic?tr=w-200`} style={{borderRadius:'50%'}} />
                    } */}

                    <UpdateProfileImage auth={data} getData={getData} />
                </center>
                <h2>{data.name}</h2>

                <p><b>Type:</b> {data.type}</p>
                {data.type==='Admin' &&
                    <p><b>Role:</b> {data.admin_role && data.admin_role.name}</p>
                }
                
                <p><b>Email:</b> {data.email} 
                ({data.emailverification?'Verified':`Not Verified`})
                {data.emailverification===false && <><br />Verification code is {data.emailverificationcode}<br /></>}
                {data.emailverification===false && <><a onClick={verifyEmail}>Click here</a> to verifiy this email</>}
                </p>
                <p><b>Phone:</b> {data.phone}</p>
                <p><b>Country:</b> {data.country}</p>
                <p><b>State:</b> {data.state}</p>
                <p><b>City:</b> {data.city}</p>
                

                <p><b>Status:</b> {data.status?'Active':'Inactive'}</p>
                <p><b>Created By:</b> {data.created_by}</p>
                <p><b>Created At:</b> <Moment format="LLL">{data.createdAt}</Moment> ({moment(data.createdAt).fromNow()})</p>
                
                {/* <Button type="primary" icon={<PlusOutlined />} block>
                Send Email
                </Button>
                <br/>
                <br/>
                <Button type="primary" icon={<PlusOutlined />} block>
                Login as User
                </Button> */}
                </div>
                
            </Col>
            <Col xs={24} sm={24} md={16} xxl={18}>
                <div
                className="site-layout-background"
                size={"large"}
                style={{ padding: 24 }}
                >
                <Tabs tabPosition={"top"} activeKey={tab} onChange={(e)=>setTab(e)}>
                    <TabPane tab="Dashboard" key="dashboard">
                        {/* <UserViewLoginLogs /> */}
                        <UserTabDashboard user_id={data._id} />
                    </TabPane>
                    <TabPane tab="Login Logs" key="11">
                        <UserViewLoginLogs user_id={data._id} />
                    </TabPane>
                    <TabPane tab="Transaction" key="5">
                        <UserTabPaymentHistory user_id={data._id} />
                    </TabPane>
                    <TabPane tab="Orders" key="2">
                        <UserTabOrderList user_id={data._id} />
                    </TabPane>
                    <TabPane tab="Cart" key="cartitems">
                        <UserTabCartList user_id={data._id} />
                    </TabPane>
                    {/* <TabPane tab="Wishlist" key="4">
                        Content of Tab 3
                    </TabPane> */}
                    <TabPane tab="Reviews" key="reviews">
                        <UserTabReviews user_id={data._id} />
                    </TabPane>
                    <TabPane tab="Visited Products" key="lastvisitedproduct">
                        <UserTabVisitedProducts user_id={data._id} />
                    </TabPane>
                    {/* <TabPane tab="Invoice" key="6">
                        Content of Tab 3
                    </TabPane> */}
                </Tabs>
                </div>
            </Col>
            </Row>
            </Spin>
            
            }
            
        </Content>
        </Body>
    );
};

const mapStateToProps = (state) => ({
    auth:state.auth
});

export default connect(mapStateToProps, {fetchUsers})(view);

