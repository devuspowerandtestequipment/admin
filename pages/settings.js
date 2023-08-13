import React, { Component } from "react";
import { connect } from "react-redux";
import Body from "./components/Body";
import { Layout, PageHeader, Breadcrumb, Tabs } from "antd";
import Link from "next/link";
import axios from "axios";
import _ from 'lodash'
import Head from "next/head";
import { Grid } from "semantic-ui-react";
import SettingsAccount from "./components/settings/SettingsAccount";
import SettingsSecurity from "./components/settings/SettingsSecurity";
import SettingsTheme from "./components/settings/SettingsTheme";
import SettingsCurrency from "./components/settings/SettingsCurrency";
import SettingsAdminRoles from "./components/settings/SettingsAdminRoles";
import SettingsCache from "./components/settings/SettingsCache";

const { Header, Content, Footer, Sider } = Layout;

export class Settings extends Component {
 

  render() {
    
    return (
      <Body>
        <Head>
          <title>Settings</title>
        </Head>

        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item><Link href='/'>Dashboard</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Settings</Breadcrumb.Item>
          </Breadcrumb>
          <PageHeader
            ghost={false}
            className="site-page-header-gray"
            title="Settings"
            onBack={() => window.history.back()}
            // extra={[<ShippingCreateDrawer />]}
          >
          </PageHeader>
          
        
        <br />
        <div>
            <div className="site-layout-background" style={{ padding: 24 }}>
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Account" key="1">
                  <SettingsAccount />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Security" key="2">
                  <SettingsSecurity />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Themes" key="96">
                  <SettingsTheme />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Currency" key="4">
                  <SettingsCurrency />
                </Tabs.TabPane>
                {/* <Tabs.TabPane tab="Admin Roles" key="5">
                  <SettingsAdminRoles />
                </Tabs.TabPane> */}
                <Tabs.TabPane tab="Cache" key="6">
                  <SettingsCache />
                </Tabs.TabPane>
            </Tabs>
            </div>
        </div>
        </Content>
      </Body>
    );
  }
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(Settings);
