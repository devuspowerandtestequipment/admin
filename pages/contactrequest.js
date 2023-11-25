import React, { Component } from "react";
import { connect } from "react-redux";
import Body from "./components/Body";
import {
  Layout,
  Row,
  Statistic,
  Col,
  Breadcrumb ,
  PageHeader,
  Popconfirm,
  message,
  DatePicker,
  Table,
  Input,
  Button,
  Space,
} from "antd";
import Highlighter from "react-highlight-words";
import {
  SearchOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { fetchAllContacts } from "../store/actions";
import Moment from "react-moment";
import moment from 'moment'
import axios from "axios";
import Head from "next/head";
import _ from 'lodash'
import DrawerUserLoginDetails from "./components/users/view/DrawerUserLoginDetails";
import DynamicAmount from './components/DynamicAmount'
const { Header, Content, Footer, Sider } = Layout;
const { RangePicker } = DatePicker;
// import _ from "lodash";

export class PaymentHistory extends Component {
  state = {
    searchText: "",
    searchedColumn: "",
    tableLoading: false,
  };

  componentDidMount() {
    this.props.fetchAllContacts();
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

      console.log('text',text);

      return _.isEqual(this.state.searchedColumn, dataIndex) ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text===null?'Not Found':text
      );
    }
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

  handleDelete = (id) => {
    this.setState({ tableLoading: true });


    axios.get(`${process.env.backendURL}/user/admin_delete_loginrecord/${id}`)
    .then((response) => {
        if (response.data.response) {
            this.props.fetchAllContacts();
            this.setState({ tableLoading: false });
            message.success("Success");
        }else{
          message.warning("Failed");
        }
    });
  };

  clearAllDatas=()=>{
    this.setState({ tableLoading: true });
    axios.get(`${process.env.backendURL}/user/admin_clearall_loginrecords`)
    .then((response) => {
        if (response.data.response) {
          this.props.fetchAllContacts();
          this.setState({ tableLoading: false });
          message.success("Success");
        }
    });
  }

  render() {
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        ...this.getColumnSearchProps("email"),
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
        ...this.getColumnSearchProps("phone"),
      },
      {
        title: "Subject",
        dataIndex: "subject",
        key: "subject",
        ...this.getColumnSearchProps("subject"),
      },
      {
        title: "Message",
        dataIndex: "message",
        key: "message",
        ...this.getColumnSearchProps("message"),
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
      }
    ];

    return (
      <Body>
        <Head><title>Contact</title></Head>

        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item><Link href='/'>Dashboard</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Contact</Breadcrumb.Item>
          </Breadcrumb>
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            className="site-page-header-gray"
            title="Contact"
        //     extra={[<Popconfirm 
        //       title="Are you sure to clear all datas?"
        //       placement="topRight"
        //       onConfirm={this.clearAllDatas}
        //       okText="Yes"
        //       cancelText="No"
        //   ><Button type='primary'>Clear All</Button></Popconfirm>]}
          >
            <Row>
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                  <Statistic title="Total" value={this.props.datas.length} />
                </Col>
            </Row>
          </PageHeader>
          <br />
          <Table
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
  datas: state.all_contacts,
});

export default connect(mapStateToProps, { fetchAllContacts })(PaymentHistory);
