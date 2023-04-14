import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Body from "./components/Body";
import { Layout } from "antd";

const { Header, Content, Footer, Sider } = Layout;



export const ErrorPage = (props) => {

  return (
    <Body>
      {/* <Content style={{ margin: "0 16px" }}>
        <center></center>
      </Content>
        
         */}
        <img src='https://www.pngitem.com/pimgs/m/561-5616833_image-not-found-png-not-found-404-png.png' style={{width:'100%'}} />
        

    </Body>
  );
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(ErrorPage);
