import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Body from "./components/Body";
import { Layout } from "antd";
import {Grid} from "semantic-ui-react";
import axios from "axios";
import { DollarCircleOutlined, LineChartOutlined, MailOutlined, OrderedListOutlined, ShoppingCartOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import dynamic from 'next/dynamic'
import TopPageVisit from "./components/dashboard/TopPageVisit";
import DynamicAmount from "./components/DynamicAmount";
import PageVisitByDevice from "./components/dashboard/PageVisitByDevice";
import PageVisitByBrowser from "./components/dashboard/PageVisitByBrowser";
import MonthlyPageVisit from "./components/dashboard/MonthlyPageVisit";
import { useRouter } from "next/router";

const date = new Date();
  const currentTime = date.getHours();

  let greeting;

  if (currentTime >= 0 && currentTime <= 12) {
    greeting = "Good Morning";
  } else if (currentTime > 12 && currentTime <= 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }


const { Header, Content, Footer, Sider } = Layout;

export const index = (props) => {

  const router = useRouter();
  const [loaded,setLoaded]=useState(false);
  const [section1,setSection1]=useState({
    total_users: 0,
    total_orders: 0,
    total_pagevisit: 0,
    total_emails: 0,
    total_earnings: [
      {
        _id: null,
        totalAmount: 0
      }
    ]
  });
  const [last_7days_page_visit,setlast_7days_page_visit]=useState([]);
  const [device_page_visit,setDevicePageVisit]=useState([]);
  const [browserinfo_page_visit,setBrowserinfoPageVisit]=useState([]);



  useEffect(()=>{


    // ****SHOW TOTAL PRODUCTS

    axios.get(`${process.env.backendURL}/dashboard/admin_dashboard`)
    .then(response=>{

      setSection1(response.data.section1);
      setlast_7days_page_visit(response.data.last_7days_page_visit)
      
    
      var device_p_v=[];
      if(response.data.deviceinfo.total_mobile.length>0){
        device_p_v.push({type:response.data.deviceinfo.total_mobile[0]._id,value:response.data.deviceinfo.total_mobile[0].Total})
      }
      if(response.data.deviceinfo.total_tablet.length>0){
        device_p_v.push({type:response.data.deviceinfo.total_tablet[0]._id,value:response.data.deviceinfo.total_tablet[0].Total})
      }
      if(response.data.deviceinfo.total_desktop.length>0){
        device_p_v.push({type:response.data.deviceinfo.total_desktop[0]._id,value:response.data.deviceinfo.total_desktop[0].Total})
      }
      setDevicePageVisit(device_p_v);


      var browser_p_v=[];
      response.data.browserinfo.forEach(element => {
        if(element._id===null){
          browser_p_v.push({type:'Other',value:element.Total});
        }else{
          browser_p_v.push({type:element._id,value:element.Total});
        }
      });
      setBrowserinfoPageVisit(browser_p_v);


      setLoaded(true);


    })

    
  },[props])
  




  console.log('browserinfo_page_visit',browserinfo_page_visit)

  return (
    <Body>
      <Content style={{ margin: "0 16px" }}>
        <br />
        <div className="dashboard1" style={{ padding: 24 }}>
          <Grid verticalAlign='middle' >
            <Grid.Column mobile={16} tablet={16} computer={16}>
              <Grid>
                <Grid.Column mobile={16} tablet={16} computer={2}>
                  <img src='https://www.spruko.com/demo/flaira/Flaira/assets/images/svgs/email.svg'  />
                </Grid.Column>
                <Grid.Column mobile={16} tablet={16} computer={14}>
                  <p>
                    {greeting} <b>Biswanath Prasad Singh</b>
                  </p>
                  <small>Want to be the first to know about Flaira updates? Subscribe Now</small>
                </Grid.Column>
              </Grid>
            </Grid.Column>
          </Grid>
        </div>
        <br />
        <br />


        <div className="dashboard2" style={{ padding: 24 }}>
          <Grid verticalAlign='middle' columns='equal' stackable>
            
            <Grid.Column >
              <Grid className="dashboard2_box" verticalAlign='middle' style={{padding:'15px 0px'}} onClick={()=>router.push('/users')}>
                <div className="dashboard2_box_icon">
                  <center>
                    <div className="dashboard2_box_icon_center">
                      <UsergroupAddOutlined />
                    </div>
                  </center>
                </div>
                <div>
                  <p>Users</p>
                  <h5>{section1.total_users}</h5>
                </div>
              </Grid>
            </Grid.Column>

            <Grid.Column>
              <Grid className="dashboard2_box" verticalAlign='middle' style={{padding:'15px 0px'}} onClick={()=>router.push('/orders')}>
                <div className="dashboard2_box_icon">
                  <center>
                    <div className="dashboard2_box_icon_center">
                      <ShoppingCartOutlined />
                    </div>
                  </center>
                </div>
                <div>
                  <p>Orders</p>
                  <h5>{section1.total_orders}</h5>
                </div>
              </Grid>
            </Grid.Column>

            <Grid.Column >
              <Grid className="dashboard2_box" verticalAlign='middle' style={{padding:'15px 0px'}}>
                <div className="dashboard2_box_icon">
                  <center>
                    <div className="dashboard2_box_icon_center">
                      <LineChartOutlined />
                    </div>
                  </center>
                </div>
                <div>
                  <p>Page Visits</p>
                  <h5>{section1.total_pagevisit}</h5>
                </div>
              </Grid>
            </Grid.Column>

            <Grid.Column>
              <Grid className="dashboard2_box" verticalAlign='middle' style={{padding:'15px 0px'}}>
                <div className="dashboard2_box_icon">
                  <center>
                    <div className="dashboard2_box_icon_center">
                      <DollarCircleOutlined />
                    </div>
                  </center>
                </div>
                <div>
                  <p>Earnings</p>
                  <h5><DynamicAmount amount={section1.total_earnings.length===0?0:section1.total_earnings[0].totalAmount} /></h5>
                </div>
              </Grid>
            </Grid.Column>

            <Grid.Column>
              <Grid className="dashboard2_box" verticalAlign='middle' style={{padding:'15px 0px'}}>
                <div className="dashboard2_box_icon">
                  <center>
                    <div className="dashboard2_box_icon_center">
                      <MailOutlined />
                    </div>
                  </center>
                </div>
                <div>
                  <p>Email Send</p>
                  <h5>{section1.total_emails}</h5>
                </div>
              </Grid>

            </Grid.Column>
          </Grid>
        </div>

        {loaded &&
          <div className="dashboard3" style={{ padding: 24 }}>
            <Grid verticalAlign='middle'>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                <MonthlyPageVisit data={last_7days_page_visit} />
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <PageVisitByDevice data={device_page_visit} />
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <PageVisitByBrowser data={browserinfo_page_visit} />
              </Grid.Column>
            </Grid>
          </div>
        }
        

        

      </Content>
    </Body>
  );
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(index);
