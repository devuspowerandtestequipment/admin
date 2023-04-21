import React, { Component } from "react";
import { connect } from "react-redux";
import cookie from 'react-cookies'
import ls from 'localstorage-slim';
import * as ACTION  from '../../store/types'
import { Layout, Menu, Breadcrumb, Badge, Avatar, Space, Button,Affix } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  FolderOpenOutlined,
  NotificationOutlined,
  SettingOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  EditOutlined,
  StockOutlined,
  ReloadOutlined,
  PoweroffOutlined,
  LoginOutlined,
  MailOutlined,
  StarOutlined
} from "@ant-design/icons";
import { FaUsers,FaTruck,FaMoneyCheckAlt,FaStamp,FaShoppingCart,FaTruckLoading,FaCamera,FaTags,FaAddressBook,FaBoxOpen,FaAward,FaBlog,FaCog,FaMapMarkedAlt,FaBook,FaWallet } from "react-icons/fa";
import {MdNotificationsActive,MdLaptopChromebook} from 'react-icons/md'
import Link from "next/link";
import Router,{withRouter} from 'next/router';
import { Dropdown, Grid, Icon } from 'semantic-ui-react'
import {setAuthUser,fetchNotifications,fetchCartItems,fetchUsers} from '../../store/actions'
import HeaderNotification from "./HeaderNotification";
import _ from 'lodash'
import router from "next/router";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


export class MainBody extends Component {
  state = {
    checking:true,
    collapsed: false,
    hidelayout:false,
  };


  componentDidMount(){
      this.stateUpdate();

      if(Router.asPath==='/login'){
        this.setState({checking:false})
      }else{
        // if(cookie.load('ecomadmin_authuser7569')===undefined || cookie.load('ecomadmin_authuser7569')===null){
          if(ls.get(ACTION.AUTH_USER_INFORMATION)===undefined || ls.get(ACTION.AUTH_USER_INFORMATION)===null){
        
          Router.push('/login')
          
        }else{
          this.setState({checking:false})
        }
      }


      // this.props.fetchCartItems();
      // this.props.fetchUsers();

  }


  componentDidUpdate(){
    // alert('123');
  }

  

  


  componentWillReceiveProps(){
    this.stateUpdate();

    //   alert('componentWillReceiveProps')
  }


  stateUpdate=()=>{
    if(Router.router.asPath==='/login'){
      this.setState({
          checking:false,
          hidelayout:true
      })
    }else{
      this.setState({
          hidelayout:false
      })
    }
  }


  handleLogout=()=>{
    this.props.setAuthUser(null);
    ls.clear();
    Router.push('/login');
  }


  updateKeys=(sk,ok)=>{
    this.setState({
      selectedKeys:sk,
      openKeys:ok
    })
  }

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };



  redirectRouter=(link)=>{
    Router.push(link);
  }



  render() {
    const { collapsed } = this.state;

    const triggerUser = (
      <span>
        <Badge >
          <Avatar style={{ backgroundColor: '#f0ffff00',fontSize:'20px' }} icon={<UserOutlined />}  /> 
        </Badge>&nbsp;&nbsp;&nbsp;&nbsp;
      </span>
    )


    


    const triggerCart = (
      <span>
        <Badge>
        <span className="pulse"></span>
        <Avatar style={{ backgroundColor: '#f0ffff00',fontSize:'25px' }} icon={<ShoppingCartOutlined />} /> 
        </Badge>&nbsp;&nbsp;&nbsp;&nbsp;
      </span>
    )
    

    var active_link=this.props.router.asPath.split("/")[1];
    
    if(active_link===''){
      active_link='dashboard';
    }else{
      if(active_link.includes(['category','subcategory','childcategory'])){
        var active_openkey='categoryparent';
      }else{
        var active_openkey='';
      }
    }

  
    

    var total_contactus=_.filter(this.props.notifications, (notification) => { return notification.message === 'notification_new_contactus' && notification.is_viewed===false; }).length;
    var total_register=_.filter(this.props.allusers, (dta) => { return dta.isAdminSeen===false; }).length;
    var total_cart=_.filter(this.props.cartitems, (dta) => { return dta.isAdminSeen===false; }).length;
    var total_orders=_.filter(this.props.orders, (dta) => { return dta.isAdminSeen===false; }).length;
    var total_reviews=_.filter(this.props.reviews, (dta) => { return dta.isAdminSeen===false; }).length;


    
    
    // var total_cart=_.filter(this.props.notifications, function(o) { if (o.message === 'notification_new_cart_item' && o.is_viewed===false) return o }).length;

    return (
        <>
        {this.state.checking
        ?
        <center>
          Checking auth....
        </center>
        :
        <>
          {this.state.hidelayout
          ?
            this.props.children
          :
            
            <Layout style={{ minHeight: "80vh" }}>
              <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}
              
              style={{
                overflow: 'auto',
                height: '100vh',
                position: 'sticky',
                left: 0,
                top: 0,
                bottom: 0,
              }}
              >
                {/* <div className="logo">
                  <center>
                    <img
                      src="https://wieldy.g-axon.work/assets/images/logo.png"
                      style={{ padding: "21px 0px" }}
                    />
                  </center>
                </div> */}
                
                <Menu theme="dark"
                selectedKeys={active_link}
                // defaultSelectedKeys={['1']} 
                // defaultOpenKeys={[active_openkey]}
                mode="inline">
                  <center>
                    <img
                      src="https://i.ibb.co/4RGDdZ5/logo.png"
                      style={{ padding: "19px 0px", width:'178px' }}
                    />
                  </center>
                  {/* <Menu.Item key="/webtypesearch" icon={<PieChartOutlined />}>
                    <Link href='/webtypesearch'>
                      webtypesearch
                    </Link>
                  </Menu.Item> */}
                  <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                    <Link href='/'>
                      Dashboard 
                    </Link>
                  </Menu.Item>
                  {/* <Menu.Item key="/users" icon={<><span className="pulseXXX"></span><FaAddressBook /></>} onClick={()=>this.updateKeys('/users','/users')}> */}
                  <Menu.Item key="users" icon={<FaAddressBook className={total_register===0?'':'blink_me'} />}  onClick={()=>this.redirectRouter('/users')}>
                      {total_register===0?'Users':<span className='blink_me'>Users</span>}
                  </Menu.Item>


                  <Menu.Item key="loginrecords" icon={<LoginOutlined />} onClick={()=>this.redirectRouter('/loginrecords')}>
                      Logins
                  </Menu.Item>
                  <Menu.Item key="emailrecords" icon={<MailOutlined />} onClick={()=>this.redirectRouter('/emailrecords')}>
                    {/* <Link href='/emailrecords'> */}
                      Emails
                    {/* </Link> */}
                  </Menu.Item>
                  {/* <SubMenu key="/ordersparent" icon={<FaShoppingCart />} title="Orders">
                    <Menu.Item key="orders"  onClick={()=>this.redirectRouter('/orders')}>
                        All Orders
                      </Menu.Item>
                  </SubMenu> */}

                  {/* <Menu.Item key="orders" icon={<FaShoppingCart />} onClick={()=>this.redirectRouter('/orders')}>
                    Orders
                  </Menu.Item> */}

                  <Menu.Item key="orders" icon={<FaShoppingCart className={total_orders===0?'':'blink_me'} />} onClick={()=>this.redirectRouter('/orders')}>
                    {total_orders===0?'Orders':<span className='blink_me'>Orders</span>}
                  </Menu.Item>

                  <SubMenu key="categoryparent" icon={<FaTags />} title="Categories">
                    <Menu.Item key="category" onClick={()=>this.redirectRouter('/category')}>
                      Category
                    </Menu.Item>
                    <Menu.Item key="subcategory" onClick={()=>this.redirectRouter('/subcategory')}>
                      Sub Category
                    </Menu.Item>
                    <Menu.Item key="childcategory" onClick={()=>this.redirectRouter('/childcategory')}>
                      Child Category
                    </Menu.Item>
                  </SubMenu>
                  
                  <SubMenu key="productsparent" icon={<FaBoxOpen />} title="Products">
                    <Menu.Item key="products"  onClick={()=>this.redirectRouter('/products')}>Products</Menu.Item>
                    <Menu.Item key="products/productattributes"  onClick={()=>this.redirectRouter('/products/productattributes')}>Product Attributes</Menu.Item>
                    {/* <Menu.Item key="tax" onClick={()=>this.redirectRouter('/tax')}>Product Tax</Menu.Item> */}
                    {/* <Menu.Item key="coupons" onClick={()=>this.redirectRouter('/coupons')}>Product Coupons</Menu.Item> */}
                  </SubMenu>
                  {/* <Menu.Item key="reviews" icon={<StarOutlined />}  onClick={()=>this.redirectRouter('/reviews')}>
                    Reviews
                  </Menu.Item> */}

                  <Menu.Item key="reviews" icon={<FaShoppingCart className={total_reviews===0?'':'blink_me'} />} onClick={()=>this.redirectRouter('/reviews')}>
                    {total_reviews===0?'Reviews':<span className='blink_me'>Reviews</span>}
                  </Menu.Item>


                  <Menu.Item key="tax" icon={<FaStamp />}  onClick={()=>this.redirectRouter('/tax')}>
                    Tax
                  </Menu.Item>
                  <Menu.Item key="coupons" icon={<FaMoneyCheckAlt />} onClick={()=>this.redirectRouter('/coupons')}>
                    Coupons
                  </Menu.Item>
                  <Menu.Item key="brands" icon={<FaAward />} onClick={()=>this.redirectRouter('/brands')}>
                    Brand
                  </Menu.Item>
                  <Menu.Item key="shipping" icon={<FaTruck />} onClick={()=>this.redirectRouter('/shipping')}>
                    Shipping
                  </Menu.Item>
                  <Menu.Item key="courier" icon={<FaTruckLoading />} onClick={()=>this.redirectRouter('/courier')}>
                    Courier
                  </Menu.Item>
                  <Menu.Item key="fileupload" icon={<FolderOpenOutlined />} onClick={()=>this.redirectRouter('/fileupload')}>
                    Files
                  </Menu.Item>
                  <Menu.Item key="blogs" icon={<FaBlog />} onClick={()=>this.redirectRouter('/blogs')}>
                    Blogs
                  </Menu.Item>
                  <Menu.Item key="notifications" icon={<MdNotificationsActive />} onClick={()=>this.redirectRouter('/notifications')}>
                    Notifications
                  </Menu.Item>
                  <Menu.Item key="pageviews" icon={<MdLaptopChromebook />} onClick={()=>this.redirectRouter('/pageviews')}>
                    Page Tracking
                  </Menu.Item>
                  {/* <Menu.Item key="7x21" icon={<FaMapMarkedAlt />}>
                    User Track
                  </Menu.Item> */}
                  <Menu.Item key="carts" icon={<FaBook className={total_cart===0?'':'blink_me'} />}  onClick={()=>this.redirectRouter('/carts')}>
                    {total_cart===0?'Carts':<span className='blink_me'>Carts</span>}
                  </Menu.Item>
                  <Menu.Item key="8x" icon={<FaBook className={total_contactus===0?'':'blink_me'} />}>
                    {total_contactus===0?'Contact Request':<span className='blink_me'>Contact Request</span>}
                  </Menu.Item>
                  <Menu.Item key="paymenthistory" icon={<FaWallet />} onClick={()=>this.redirectRouter('/paymenthistory')}>
                    Payment History
                  </Menu.Item>
                  <Menu.Item key="settings" icon={<SettingOutlined />}  onClick={()=>this.redirectRouter('/settings')}>
                    Settings
                  </Menu.Item>
                  <Menu.Item key="12xc">
                      <p style={{visibility:'hidden'}}>xx</p>
                  </Menu.Item>
                </Menu>
              </Sider>
              <Layout className="site-layout">
                <Affix offsetTop={0}>
                <Header style={{ width: "100%" }}>
                  {React.createElement(
                    this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                    {
                      className: "trigger",
                      onClick: this.toggle,
                    }
                  )}
                  <div style={{float:'right'}}>
                    
                    <Avatar icon={<ReloadOutlined />} style={{ backgroundColor: '#f0ffff00',fontSize:'20px', cursor:'pointer' }} onClick={()=>router.push('/pagerefresh')} />
                    {/* <Avatar icon={<ReloadOutlined />} style={{ backgroundColor: '#f0ffff00',fontSize:'20px', cursor:'pointer' }} onClick={()=>router.reload()} /> */}
                    
                    &nbsp;&nbsp;
                    &nbsp;&nbsp;
                    

                    <HeaderNotification />
                     &nbsp;&nbsp;
                    <Dropdown trigger={triggerUser} text='Menu' icon={null} >
                      <Dropdown.Menu className='left headertext98' style={{width:'230px'}}>
                          
                        <p className="headertext98_head">Bob Smith</p>
                        <p  className="headertext98_head_subhead1">Admin</p>
                        <Dropdown.Item className="headertext98_head_item1"><UserOutlined />&nbsp;&nbsp;Profile</Dropdown.Item>
                        <Dropdown.Item><EditOutlined />&nbsp;&nbsp;Account Settings</Dropdown.Item>
                        <Dropdown.Item><StockOutlined />&nbsp;&nbsp;Activity</Dropdown.Item>
                        <Dropdown.Item><PoweroffOutlined />&nbsp;&nbsp;Logout</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    &nbsp;
                    <Avatar onClick={()=>this.handleLogout()} icon={<PoweroffOutlined />} style={{ backgroundColor: '#f0ffff00',fontSize:'20px', cursor:'pointer' }} />
                    &nbsp;&nbsp;
                    &nbsp;&nbsp;

                    {/* <Space size='large'>
                    <Badge count={5}><Avatar icon={<NotificationOutlined />} /></Badge>
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                    <Avatar icon={<LogoutOutlined />} />
                    </Space> */}



                    {/* <span onClick={()=>this.handleLogout()}>Logout</span> */}

                    {/* <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Human-gnome-logout.svg/1200px-Human-gnome-logout.svg.png' width={50} onClick={()=>this.handleLogout()} /> */}
                  </div>

                  <Menu theme="light" mode="horizontal" defaultSelectedKeys={["2"]}>
                    {/* {cookie.load('ffs_admin_userlogin') === 'true'? <h1>Login</h1> : <h1>logout</h1> } */}
                  </Menu>
                </Header>
                </Affix>
                

                {this.props.children}
                {/* <Footer style={{ textAlign: "center" }}>
                  Ant Design ©2018 Created by Ant UED
                </Footer> */}
              </Layout>
            </Layout>
          }
        </>
        }


        
        
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  notifications: state.all_notifications,
  cartitems:state.all_cartitems,
  allusers:state.all_users,
  orders: state.all_orders,
  reviews: state.all_reviews,

});

const MainBodywithRouter=withRouter(MainBody)

export default connect(mapStateToProps, {setAuthUser,fetchNotifications,fetchCartItems,fetchUsers})(MainBodywithRouter);
