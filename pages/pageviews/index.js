import React, { Component } from "react";
import { connect } from "react-redux";
import Body from "../components/Body";
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
  Segmented,
} from "antd";
import Highlighter from "react-highlight-words";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ShippingEditDrawer from "../components/shipping/ShippingEditDrawer";
import Link from "next/link";
import { fetchPageViews } from "../../store/actions";
import Moment from "react-moment";
import axios from "axios";
import _ from 'lodash'
import ShippingCreateDrawer from "../components/shipping/ShippingCreateDrawer";
import Head from "next/head";
import MostViewedPage from "./MostViewedPage";
import MostViewedProduct from "./MostViewedProduct";
import DrawerPageView from "./DrawerPageView";

const { Header, Content, Footer, Sider } = Layout;

export class PageViews extends Component {
  state = {
    searchText: "",
    searchedColumn: "",
    tableLoading: false,
    segmented:'View All',
    pageSize:10

  };

  componentDidMount() {
    this.props.fetchPageViews();
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

      // console.log('text',text);

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
    axios
      .get(`${process.env.backendURL}/shipping/deletefile/${id}`)
      .then((response) => {
        if (response.data.response) {
          this.props.fetchPageViews();
          this.setState({ tableLoading: false });
          message.success("Success");
        }
      });
  };

  clearAllDatas=()=>{
    this.setState({ tableLoading: true });
    axios.get(`${process.env.backendURL}/user/admin_clearall_pagevisit_records`)
    .then((response) => {
        if (response.data.response) {
          this.props.fetchPageViews();
          this.setState({ tableLoading: false });
          message.success("Success");
        }
    });
  }


  render() {
    const columns = [
      // {
      //   title: "Name",
      //   dataIndex: "name",
      //   key: "name",
      //   ...this.getColumnSearchProps("name"),
      // },

    //   {
    //     title: "Name",
    //     dataIndex: "",
    //     key: "1",
    //     render: (data) => (
    //       <>{data.name} <br/> ({data.desc})</>
    //     ),
    //   },
      {
        title: "Page URL",
        dataIndex: "page_url",
        key: "page_url",
        ...this.getColumnSearchProps("page_url"),
      },
      {
        title: "User Name",
        dataIndex: ["user_id", "name"],
        key: "name",
        width: "20%",
        ...this.getColumnSearchPropsCustom(["user_id", "name"],'name')
      },
      {
        title: "User IP",
        dataIndex: ["ipinfo", "ipAddress"],
        key: "ipAddress",
        // width: "30%",
        ...this.getColumnSearchPropsCustom(["ipinfo", "ipAddress"],'ip address')
      },
         {
        title: "Created",
        dataIndex: "createdAt",
        key: "createdAt",
        width: "250px",
        responsive: ["lg"],
        render: (createdAt) => (
          <Moment format="LLL">{createdAt}</Moment>
        ),
      },
      
    //   {
    //     title: "Percentage",
    //     dataIndex: "percentage",
    //     key: "percentage",
    //     ...this.getColumnSearchProps("percentage"),
    //   },
    //   {
    //     title: "Amount",
    //     dataIndex: "amount",
    //     key: "amount",
    //     render: (data) => (
    //       <>{data.amount}</>
    //     ),
    //     ...this.getColumnSearchProps("amount"),
    //   },
      // {
      //   title: "Status",
      //   key: "status",
      //   dataIndex: "status",
      //   filters: [
      //     {
      //       text: 'Active',
      //       value: 'Active',
      //     },
      //     {
      //       text: 'InActive',
      //       value: 'InActive',
      //     },
      //   ],
      //   onFilter: (value, record) => record.status.indexOf(value) === 0,
      //   render: (aa, data) => (
      //     <>
      //       {data.status==='Active'
      //         ?<Tag color="#87d068">Active</Tag>
      //         :<Tag color="#f50">InActive</Tag>
      //         }
      //     </>
      //   ),
      // },
    //   {
    //     title: "Created",
    //     dataIndex: "createdAt",
    //     key: "createdAt",
    //     width: "250px",
    //     responsive: ["lg"],
    //     render: (createdAt) => (
    //       <Moment format="LLL">{createdAt}</Moment>
    //     ),
    //   },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        width: "224px",

        render: (data) => (
          <>
            <DrawerPageView data={data} />
            &nbsp;
            <Popconfirm
              title="Are you sure to delete this category?"
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
        <Head><title>Page Views</title></Head>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item><Link href='/'>Dashboard</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Page Views</Breadcrumb.Item>
          </Breadcrumb>
          <PageHeader
            ghost={false}
            className="site-page-header-gray"
            title="Page Views"
            onBack={() => window.history.back()}
            extra={[
                <Popconfirm 
                    title="Are you sure to clear all datas?"
                    placement="topRight"
                    // description="Are you sure to clear all datas?"
                    onConfirm={this.clearAllDatas}
                    okText="Yes"
                    cancelText="No"
                ><Button type='primary'>Clear All</Button></Popconfirm>
            ]}
          >
            <Row>
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Total Page Views" value={this.props.datas.length} />
                </Col>
                {/* <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Active Tax" value={_.filter(this.props.datas, function(o) { if (o.status === 'Active') return o }).length} />
                </Col>
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Inactive Tax" value={_.filter(this.props.datas, function(o) { if (o.status === 'InActive') return o }).length} />
                </Col> */}
            </Row>
          </PageHeader>
          <Segmented options={['View All', 'Top Visited Page URL', 'Top Visited Product URL']} value={this.state.segmented} onChange={(e)=>this.setState({segmented:e})} />
          <br />
          <br />
          {this.state.segmented==='View All' &&
            <Table
              columns={columns}
              dataSource={this.props.datas}
              loading={this.state.tableLoading}
              scroll={{ x: 500 }}

              onChange={(e)=>this.setState({pageSize:e.pageSize})}
              pagination={{ pageSize: this.state.pageSize, pageSizeOptions: ['10', '20', '50', '100', '150', '200', '500'] }}
            />
          }

          {this.state.segmented==='Top Visited Page URL' &&
            <MostViewedPage />
          }  

          {this.state.segmented==='Top Visited Product URL' &&
            <MostViewedProduct />
          } 
          
        </Content>
      </Body>
    );
  }
}

const mapStateToProps = (state) => ({
  datas: state.all_pageviews,
});

export default connect(mapStateToProps, { fetchPageViews })(PageViews);
