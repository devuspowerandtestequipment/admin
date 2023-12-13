import React, { Component } from "react";
import { connect } from "react-redux";
import Body from "../components/Body";
import {
  Layout,
  Row,
  Statistic,
  Col,
  DatePicker,
  PageHeader,
  Breadcrumb,
  message,
  Tag,
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
import Link from "next/link";
import { fetchOrders,clearSingleNotificationByMessage } from "../../store/actions";
import Moment from "react-moment";
import axios from "axios";
import BrandViewDrawer from "../components/brands/BrandViewDrawer";
import _ from 'lodash'
import Head from "next/head";
import DynamicOrderStatus from "../components/DynamicOrderStatus";
import DynamicAmount from "../components/DynamicAmount";
import moment from 'moment'
const { RangePicker } = DatePicker;
const { Header, Content, Footer, Sider } = Layout;


export class index extends Component {
  state = {
    searchText: "",
    searchedColumn: "",
    tableLoading: false,
  };

  componentDidMount() {
    this.props.fetchOrders();
    this.props.clearSingleNotificationByMessage('notification_new_order');


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

  handleDelete = (id, fileid) => {
    this.setState({ tableLoading: true });
    axios
      .get(`${process.env.backendURL}/brand/deletefile/${id}/${fileid}`)
      .then((response) => {
        if (response.data.response) {
          this.props.fetchOrders();
          this.setState({ tableLoading: false });
          message.success("Success");
        }
      });
  };


  handleSwitchChange=(checked,id)=>{
    console.log(checked);
    console.log(id);
    axios.get(`${process.env.backendURL}/brand/updatestatus/${id}/${checked?'Active':'InActive'}`)
    .then(response=>{
      if(response.data.response){
        message.success('Success');
        this.props.fetchOrders();
      }
    })
  }

  markAllasRead=()=>{
    axios.get(`${process.env.backendURL}/order/mark_all_seen`)
    .then(response=>{
      this.props.fetchOrders();
      message.success('Success')
    })
  }


  render() {

    const columns = [
      {
        title: "Order ID",
        dataIndex: "order_id",
        key: "order_id",
        render: (aa, data) => (
          <>
            {data.order_id}
          </>
        ),
        ...this.getColumnSearchProps("order_id"),
      },
      {
        title: "Total Amount",
        dataIndex: "amount_total_final",
        key: "amount_total_final",
        render: (aa, data) => (
          <>
           <DynamicAmount amount={data.amount_total_final} />
          </>
        ),
        // ...this.getColumnSearchProps("amount_total_final"),
      },
      {
        title: "Status",
        key: "order_status",
        dataIndex: "order_status",
        filters: [
          {
            text: 'Waiting',
            value: '1',
          },
          {
            text: 'Accepted',
            value: '2',
          },
          {
            text: 'In Progress',
            value: '3',
          },
          {
            text: 'Packing',
            value: '4',
          },
          {
            text: 'Ready For Pickup',
            value: '5',
          },
          {
            text: 'Shipped',
            value: '6',
          },
          {
            text: 'Delivered',
            value: '7',
          },
          {
            text: 'Canceled',
            value: '0',
          },
        ],
        onFilter: (value, record) => record.order_status.indexOf(value) === 0,
        render: (aa, data) => (
          <>
            <DynamicOrderStatus status={data.order_status} />
          </>
        ),
      },
      {
        title: "Payment",
        key: "payment_status",
        dataIndex: "payment_status",
        filters: [
          {
            text: 'Unpaid',
            value: 'Unpaid',
          },
          {
            text: 'Paid',
            value: 'Paid',
          },
        ],
        onFilter: (value, record) => record.payment_status.indexOf(value) === 0,
        render: (aa, data) => (
          <>
            
            {data.payment_status==='paid'
            ?<Tag color="#87d068">Paid</Tag>
            :<Tag color="#f50">Unpaid</Tag>
            }
          </>
        ),
      },
      {
        title: "Payment Type",
        key: "payment_type",
        dataIndex: "payment_type",
        filters: [
          {
            text: 'Cash on delivery',
            value: 'Cash on delivery',
          },
          {
            text: 'Paypal',
            value: 'Paypal',
          },
        ],
        onFilter: (value, record) => record.payment_type.indexOf(value) === 0,
        render: (aa, data) => (
          <>
            {data.payment_type}
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
      {
        title: "",
        dataIndex: "",
        key: "x",
        width: "104px",

        render: (data) => (
          this.props.auth && this.props.auth.admin_role && //<===Order view role check
            this.props.auth.admin_role.order_record_view &&
              <Link href={`/orders/${data._id}`} ><Button type="primary" icon={<EyeOutlined />}>View</Button></Link>
            
         
        ),
      },
    ];

    return (
      <Body>
        <Head>
        <title>Orders</title>
        </Head>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item><Link href='/'>Dashboard</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Orders</Breadcrumb.Item>
          </Breadcrumb>
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            className="site-page-header-gray"
            title="Orders"
            extra={[
              <>
              {_.filter(this.props.orders, function(o) { if (o.isAdminSeen === false) return o }).length>0 &&
                <Button type="primary" icon={<EyeOutlined />} onClick={()=>this.markAllasRead()}>
                  Mark all as read
                </Button>
              }
              </>
              
            ]}
          >
            <Row>
            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
              <Statistic title="Total Orders" value={this.props.orders.length} />
            </Col>
            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
              <Statistic title="Pending Orders" value={_.filter(this.props.orders, function(o) { if (o.status === 'Active') return o }).length} />
            </Col>
            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
              <Statistic title="In Progress Orders" value={_.filter(this.props.orders, function(o) { if (o.status === 'Pending') return o }).length} />
            </Col>
            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
              <Statistic title="Delivered Orders" value={_.filter(this.props.orders, function(o) { if (o.type === 'Configurable') return o }).length} />
            </Col>
            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
              <Statistic title="Completed Orders" value={_.filter(this.props.orders, function(o) { if (o.type === 'Simple') return o }).length} />
            </Col>
            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
              <Statistic title="Cancelled Orders" value={_.filter(this.props.orders, function(o) { if (o.type === 'Simple') return o }).length} />
            </Col>
        
      </Row>
          </PageHeader>
          <br />
          {this.props.auth && this.props.auth.admin_role && //<===Order list role check
            this.props.auth.admin_role.order_record_index &&
              <Table
                columns={columns}
                rowClassName={record=>record.isAdminSeen?'':'activetabletr'}
                dataSource={this.props.orders}
                pagination={{ pageSize: 10 }}
                loading={this.state.tableLoading}
                scroll={{ x: 500 }}
              />
          }
        </Content>
      </Body>
    );
  }
}

const mapStateToProps = (state) => ({
  orders: state.all_orders,
  auth:state.auth
});

export default connect(mapStateToProps, { fetchOrders,clearSingleNotificationByMessage })(index);
