import React from "react";
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
  Statistic,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import UserViewLoginLogs from "../components/users/view/UserViewLoginLogs";
const { Header, Content, Footer, Sider } = Layout;
const { TabPane } = Tabs;

export const view = (props) => {
  function onChange(checked) {
    console.log(`switch to ${checked}`);
  }

  return (
    <Body>
      <Content style={{ margin: "0 16px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>Users</Breadcrumb.Item>
          <Breadcrumb.Item>User Detail</Breadcrumb.Item>
        </Breadcrumb>
        {/* <PageHeader
          ghost={true}
          // onBack={() => window.history.back()}
          title="User Detail"
          extra={[
            
            <Button type="primary" icon={<PlusOutlined />}>
              Send Email
            </Button>,
            <Button type="primary" icon={<PlusOutlined />}>
              Login as User
            </Button>,
            <Button type="primary" icon={<PlusOutlined />}>
              Edit User
            </Button>,
            <Button type="danger" icon={<PlusOutlined />}>
              Delete User
            </Button>,
          ]}
        ></PageHeader> */}
        <PageHeader
          onBack={() => window.history.back()}
          title="User Details"
          tags={<Tag color="green">Active</Tag>}
          // subTitle="User"
          extra={[
            // <Button type="primary" icon={<PlusOutlined />}>
            //   Send Email
            // </Button>,
            // <Button type="primary" icon={<PlusOutlined />}>
            //   Login as User
            // </Button>,
            <Button type="primary" icon={<PlusOutlined />}>
              Edit User
            </Button>,
            <Button type="danger" icon={<PlusOutlined />}>
              Delete User
            </Button>
          ]}
        >
          {/* <Row>
            <Statistic title="Status" value="Pending" />
            <Statistic
              title="Price"
              prefix="$"
              value={568.08}
              style={{
                margin: "0 32px",
              }}
            />
            <Statistic title="Balance" prefix="$" value={3345.08} />
          </Row> */}
        </PageHeader>
        <br />

        <Row gutter={[24, 16]}>
          <Col xs={24} sm={24} md={8} xxl={6}>
            <div className="site-layout-background" style={{ padding: 24 }}>
              <h2>John Doe</h2>
              <p>
                <b>Status:</b> <Switch defaultChecked onChange={onChange} />
              </p>
              <p>
                <b>Email Verification:</b>{" "}
                <Switch defaultChecked onChange={onChange} />
              </p>
              <h6>Basic Information</h6>
              <p>
                <b>Email:</b> john@gmail.com
              </p>
              <p>
                <b>Contact:</b> 9658667287
              </p>
              <p>
                <b>Country:</b> India
              </p>
              <p>
                <b>State:</b> India
              </p>
              <p>
                <b>City:</b> India
              </p>
              <br />
              <h4>Shipping Information</h4>
              <p>
                <b>Contact:</b> 9658667287
              </p>
              <p>
                <b>Country:</b> India
              </p>
              <p>
                <b>State:</b> India
              </p>
              <p>
                <b>City:</b> India
              </p>
              <p>
                <b>Address:</b> India
              </p>
              <Button type="primary" icon={<PlusOutlined />} block>
              Send Email
            </Button>
            <br/>
            <br/>
            <Button type="primary" icon={<PlusOutlined />} block>
              Login as User
            </Button>
            </div>
            
          </Col>
          <Col xs={24} sm={24} md={16} xxl={18}>
            <div
              className="site-layout-background"
              size={"large"}
              style={{ padding: 24 }}
            >
              <Tabs tabPosition={"top"}>
                <TabPane tab="Login Logs" key="1">
                  <UserViewLoginLogs />
                </TabPane>
                <TabPane tab="Transaction" key="5">
                  Content of Tab 3
                </TabPane>
                <TabPane tab="Orders" key="2">
                  Content of Tab 2
                </TabPane>
                <TabPane tab="Cart" key="3">
                  Content of Tab 3
                </TabPane>
                <TabPane tab="Wishlist" key="4">
                  Content of Tab 3
                </TabPane>
                <TabPane tab="Invoice" key="6">
                  Content of Tab 3
                </TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>
      </Content>
    </Body>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(view);
