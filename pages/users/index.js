import React, { Component } from "react";
import { connect } from "react-redux";
import Body from "../components/Body";
import {
  Layout,
  Breadcrumb,
  PageHeader,
  Statistic,
  Row,
  Col,
  Tag,
  Table,
  Input,
  Button,
  Space,
  Tooltip,
  DatePicker,
  message
} from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined, EyeOutlined,EditOutlined,DeleteOutlined } from "@ant-design/icons";
import UserCreateDrawer from "../components/users/UserCreateDrawer";
import Link from 'next/link'
import _ from 'lodash'
import {fetchUsers,clearSingleNotificationByMessage,fetchNotifications} from '../../store/actions'
import Moment from "react-moment";
import Head from 'next/head'
const { Header, Content, Footer, Sider } = Layout;
import moment from 'moment'
import axios from "axios";
const { RangePicker } = DatePicker;
export class index extends Component {
  state = {
    searchText: "",
    searchedColumn: "",
  };

  componentDidMount() {
    this.props.fetchUsers();
    this.props.clearSingleNotificationByMessage('notification_new_user_register')
    .then(resp=>{
      this.props.fetchNotifications();
    })
  }


  markAllasRead=()=>{
    axios.get(`${process.env.backendURL}/user/mark_all_seen`)
    .then(response=>{
      this.props.fetchUsers();
      message.success('Success')
    })
  }

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

  getColumnSearchPropsDateFilterCustom = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Space>
          <RangePicker 
            // format={"DD-MM-YY"}
            onChange={(e,dateString) => {
            setSelectedKeys([dateString])
            }}
            allowClear={true}
          />
        </Space>
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
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {


        if(value[0]==='' && value[1]===''){
            return record[dataIndex];
        }else{
            var compareDate = moment(record.createdAt).format('L')
            var startDate   = moment(value[0]).subtract(1, 'days').format('L')
            var endDate     = moment(value[1]).add(1, 'days').format('L')
            if(moment(compareDate).isBetween(startDate, endDate)){
                return record[dataIndex];
            }else{
                return '';
            }
        }
    },

    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        // setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
        moment(text).format('lll')
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

  render() {
    const columns = [
      
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        // width: "20%",
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        ...this.getColumnSearchProps("email"),
      },
      {
        title: "Email Verified",
        key: "emailverification",
        dataIndex: "emailverification",
        filters: [
          {
            text: 'Verified',
            value: true,
          },
          {
            text: 'Pending',
            value: false,
          },
        ],
        onFilter: (value, record) => record.emailverification.indexOf(value) === 0,
        render: (aa, data) => (
          <>
            {data.emailverification===true
              ?<Tag color="#87d068">Verified</Tag>
              :<Tag color="#f50">Pending</Tag>
              }
          </>
        ),
      },
      {
        title: "Type",
        key: "type",
        dataIndex: "type",
        filters: [
          {
            text: 'User',
            value: 'User',
          },
          {
            text: 'Admin',
            value: 'Admin',
          },
        ],
        onFilter: (value, record) => record.type.indexOf(value) === 0,
        render: (aa, data) => (
          <>
            {data.type==='User'
              ?<Tag color="cyan">User</Tag>
              :<Tag color="gold">Admin</Tag>
              }
          </>
        ),
      },
      {
        title: "Status",
        key: "status",
        dataIndex: "status",
        filters: [
          {
            text: 'Active',
            value: true,
          },
          {
            text: 'Inactive',
            value: false,
          },
        ],
        onFilter: (value, record) => record.status.indexOf(value) === 0,
        render: (aa, data) => (
          <>
            {data.status===true
              ?<Tag color="#87d068">Active</Tag>
              :<Tag color="#f50">Inactive</Tag>
              }
          </>
        ),
      },
      {
        title: "Created",
        dataIndex: "createdAt",
        key: "createdAt",
        width: "250px",
        responsive: ["lg"],
        render: (createdAt) => (
          <Moment format="lll">{createdAt}</Moment>
        ),
        ...this.getColumnSearchPropsDateFilterCustom('createdAt')
      },
      // {
      //   title: "Type",
      //   dataIndex: "type",
      //   key: "type",
      //   ...this.getColumnSearchProps("type"),
       
      // },
      {
        title: '',
        dataIndex: '',
        key: 'x',

        render: data => (
          <>
            <Space warp>
              <Link href='/users/view'>
                <Tooltip title='View user information'>
                  <Link href={`/users/${data._id}`}><Button type="primary" icon={<EyeOutlined />}>View</Button></Link>
                </Tooltip>
              </Link>
              
              
              {/* <Tooltip title='Edit user information'>
                <Button type="primary" icon={<EditOutlined />}></Button>
              </Tooltip>
              
              <Tooltip title='Delete user information'>
              <Button type="danger" icon={<DeleteOutlined />}></Button>
              </Tooltip> */}
            </Space>
            

          </>
        ),
      },
    ];
    return (
      <Body>
        <Head>
        <title>Users</title>
        </Head>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item><Link href='/'>Dashboard</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Users</Breadcrumb.Item>
          </Breadcrumb>
          <PageHeader
            title="All Users"
            onBack={() => window.history.back()}
            ghost={false}
            className="site-page-header-gray"
            extra={[
              <UserCreateDrawer />,
              <>
              {_.filter(this.props.datas, function(o) { if (o.isAdminSeen === false) return o }).length>0 &&
                <Button type="primary" icon={<EyeOutlined />} onClick={()=>this.markAllasRead()}>
                  Mark all as read
                </Button>
              }
              </>
              
            ]}
          >
            <Row>
                <Col xs={24} sm={24} md={4} lg={2} xl={2}>
                  <Statistic title="Total Users" value={this.props.datas.length} />
                </Col>
                <Col xs={24} sm={24} md={4} lg={2} xl={2}>
                  <Statistic title="Active Users" value={_.filter(this.props.datas, function(o) { if (o.status === true) return o }).length} />
                </Col>
                <Col xs={24} sm={24} md={4} lg={2} xl={2}>
                  <Statistic title="Inactive Users" value={_.filter(this.props.datas, function(o) { if (o.status === false) return o }).length} />
                </Col>
                <Col xs={24} sm={24} md={4} lg={2} xl={2}>
                  <Statistic title="Verified Users" value={_.filter(this.props.datas, function(o) { if (o.emailverification === true) return o }).length} />
                </Col>
            </Row>
          </PageHeader>

       

          <br />
          <Table
            rowClassName={record=>record.isAdminSeen?'':'activetabletr'}
            columns={columns}
            dataSource={this.props.datas}
            pagination={{ pageSize: 15 }}
          />
        </Content>
      </Body>
    );
  }
}

const mapStateToProps = (state) => ({
  datas:state.all_users
});


export default connect(mapStateToProps, {fetchUsers,clearSingleNotificationByMessage,fetchNotifications})(index);
