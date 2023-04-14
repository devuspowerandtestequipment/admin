import React, { Component } from "react";
import { connect } from "react-redux";
import Body from "./components/Body";
import {
  Layout,
  Row,
  Statistic,
  Col,
  Switch ,
  PageHeader,
  Popconfirm,
  message,
  Breadcrumb,
  Table,
  Input,
  Button,
  Space,
} from "antd";
import Highlighter from "react-highlight-words";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ShippingEditDrawer from "./components/shipping/ShippingEditDrawer";
import Link from "next/link";
import { fetchNotifications } from "../store/actions";
import Moment from "react-moment";
import axios from "axios";
import _ from 'lodash'
import ShippingCreateDrawer from "./components/shipping/ShippingCreateDrawer";
import Head from "next/head";
import router from "next/router";
import DynamicNotificationStatus from "./components/DynamicNotificationStatus";
import moment from 'moment'

const { Header, Content, Footer, Sider } = Layout;

export class Notifications extends Component {
  state = {
    searchText: "",
    searchedColumn: "",
    tableLoading: false,
  };

  componentDidMount() {
    // this.props.fetchNotifications();
    axios
    .get(`${process.env.backendURL}/user/admin_readall_notifications`)
    .then((response) => {
      
    });
  }



  getColumnSearchPropsCustom = (dataIndex,placeholder) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${placeholder}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      return _.get(record, dataIndex)
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => {
      return _.isEqual(this.state.searchedColumn, dataIndex) ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text===null?'User Deleted':text
      );
    }
  });

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };


  handleReadallNotifications=()=>{
    this.setState({ tableLoading: true });
    axios
    .get(`${process.env.backendURL}/user/admin_readall_notifications`)
    .then((response) => {
      if (response.data.response) {
        this.props.fetchNotifications();
        this.setState({ tableLoading: false });
        message.success("Success");
      }
    });
  }

  handleClearAllNotification=()=>{
    this.setState({ tableLoading: true });
    axios
    .get(`${process.env.backendURL}/user/admin_clearall_notifications`)
    .then((response) => {
      if (response.data.response) {
        this.props.fetchNotifications();
        this.setState({ tableLoading: false });
        message.success("Success");
      }
    });
  }

  handleDelete = (id) => {
    this.setState({ tableLoading: true });
    axios
      .get(`${process.env.backendURL}/user/admin_delete_notification/${id}`)
      .then((response) => {
        if (response.data.response) {
          this.props.fetchNotifications();
          this.setState({ tableLoading: false });
          message.success("Success");
        }
      });
  };


  viewUrl = (id,url) =>{
    router.push(url);
    axios.get(`${process.env.backendURL}/user/admin_setseen_notifications/${id}`)
    .then(response=>{
      this.props.fetchNotifications();
    })
  }

  render() {
    const columns = [
      // {
      //   title: "User Name",
      //   dataIndex: ["user_id", "name"],
      //   key: "name",
      //   width: "20%",
      //   ...this.getColumnSearchPropsCustom(["user_id", "name"],'name')
      // },
      // {
      //   title: "User Email",
      //   dataIndex: ["user_id", "email"],
      //   key: "email",
      //   width: "20%",
      //   ...this.getColumnSearchPropsCustom(["user_id", "email"],'email')
      // },

      // {
      //   title: "Type",
      //   dataIndex: "message",
      //   key: "message",
      //   ...this.getColumnSearchProps("message"),
      // },
      {
        title: "Type",
        dataIndex: "",
        key: "x",
        render: (data) => (
          <DynamicNotificationStatus status={data.message} user={data.user_id} />
        ),
      },

      {
        title: "Created",
        dataIndex: "createdAt",
        key: "createdAt",
        width: "350px",
        responsive: ["lg"],
        render: (createdAt) => (
          <>
          <Moment format="LLL">{createdAt}</Moment> | {moment(createdAt).fromNow()}</>
          
        ),
      },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        width: "224px",

        render: (data) => (
          <>
            <Button type='primary' icon={<EyeOutlined />} onClick={()=>this.viewUrl(data._id,data.info_url)}>View</Button>
            &nbsp;
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => this.handleDelete(data._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger" icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </>
        ),
      },
    ];

    return (
      <Body>
        <Head><title>Notifications</title></Head>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item><Link href='/'>Dashboard</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Notifications</Breadcrumb.Item>
          </Breadcrumb>
          <PageHeader
            ghost={false}
            className="site-page-header-gray"
            title="Notifications"
            onBack={() => window.history.back()}
            extra={[
              // <Button type='primary' icon={<EyeOutlined />} onClick={()=>this.handleReadallNotifications()}>Mark as all read</Button>,
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => this.handleClearAllNotification()}
                okText="Yes"
                cancelText="No"
              >
                <Button type='primary' danger icon={<DeleteOutlined />}>Clear all</Button>
              </Popconfirm>,
              ,

            ]}
          >
            <Row>
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                  <Statistic title="Total Notifications" value={this.props.datas.length} />
                </Col>
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                  <Statistic title="Total Read" value={_.filter(this.props.datas, ['is_viewed', true]).length} />
                </Col>
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                  <Statistic title="Total Pending" value={_.filter(this.props.datas, ['is_viewed', false]).length} />
                </Col>
                {/* <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Active Tax" value={_.filter(this.props.datas, function(o) { if (o.status === 'Active') return o }).length} />
                </Col>
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Inactive Tax" value={_.filter(this.props.datas, function(o) { if (o.status === 'InActive') return o }).length} />
                </Col> */}
            </Row>
          </PageHeader>
          <br />
          <Table
            // rowClassName={ (record, index) => {  record.is_viewed?'':'activetabletr' }   }
            rowClassName={record=>record.is_viewed?'':'activetabletr'}
            rowKey={record => record.id}
            columns={columns}
            dataSource={this.props.datas}
            pagination={{ pageSize: 10 }}
            loading={this.state.tableLoading}
            scroll={{ x: 500 }}
          />
        </Content>
      </Body>
    );
  }
}

const mapStateToProps = (state) => ({
  datas: state.all_notifications,
});

export default connect(mapStateToProps, { fetchNotifications })(Notifications);
