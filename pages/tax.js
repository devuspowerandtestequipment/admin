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
  Tag,
  Table,
  Input,
  Button,
  Space,
  Breadcrumb,
} from "antd";
import Highlighter from "react-highlight-words";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import TaxEditDrawer from "./components/tax/TaxEditDrawer";
import Link from "next/link";
import { fetchTaxes } from "../store/actions";
import Moment from "react-moment";
import axios from "axios";
import _ from 'lodash'
import TaxCreateDrawer from "./components/tax/TaxCreateDrawer";
import Head from "next/head";
const { Header, Content, Footer, Sider } = Layout;


export class tax extends Component {
  state = {
    searchText: "",
    searchedColumn: "",
    tableLoading: false,
  };

  componentDidMount() {
    this.props.fetchTaxes();
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
      .get(`${process.env.backendURL}/tax/deletefile/${id}`)
      .then((response) => {
        if (response.data.response) {
          this.props.fetchTaxes();
          this.setState({ tableLoading: false });
          message.success("Success");
        }
      });
  };


  render() {
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        ...this.getColumnSearchProps("name"),
      },

      {
        title: "",
        dataIndex: "",
        key: "x",
        width: "",
        render: (data) => (
          <>
            {data.type==='1'
            ?<>{data.percentage}%</>
            :<>${data.amount}</>
            }
          </>
        ),
      },



      // {
      //   title: "Percentage",
      //   dataIndex: "percentage",
      //   key: "percentage",
      //   ...this.getColumnSearchProps("percentage"),
      // },
      // {
      //   title: "Amount",
      //   dataIndex: "amount",
      //   key: "amount",
      //   ...this.getColumnSearchProps("amount"),
      // },
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
      {
        title: "Created",
        dataIndex: "createdAt",
        key: "createdAt",
        width: "250px",
        responsive: ["lg"],
        render: (createdAt) => (
          <Moment format="lll">{createdAt}</Moment>
        ),
      },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        width: "224px",

        render: (data) => (
          <>
            <TaxEditDrawer data={data} />
            &nbsp;
            <Popconfirm
              title="Are you sure to delete this tax?"
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
        <Head><title>Taxes</title></Head>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item><Link href='/'>Dashboard</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Taxes</Breadcrumb.Item>
          </Breadcrumb>
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}

            className="site-page-header-gray"
            title="Taxes"
            extra={[<TaxCreateDrawer key='1' />]}
          >
            <Row>
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Total Tax" value={this.props.datas.length} />
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
  datas: state.all_taxes,
});

export default connect(mapStateToProps, { fetchTaxes })(tax);
