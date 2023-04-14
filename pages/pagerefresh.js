import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Body from './components/Body'
import { Layout,message,Spin } from 'antd';
import Head from 'next/head';
import { useRouter } from "next/router";

const { Header, Content, Footer, Sider } = Layout;

export const pagerefresh = (props) => {

  const router=useRouter();

  useEffect(()=>{
    router.back();
    message.success('Success');
  })  

  return (
    <Body>
        <Head>
            <title>Loading...</title>
        </Head>
        <Content style={{ margin: "0 16px" }}>
            <center style={{marginTop:'10%'}}><Spin size="large" tip="Loading" /></center>      
        </Content>
    </Body>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(pagerefresh)