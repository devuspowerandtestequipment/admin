import React, { Component } from "react";
import { connect } from "react-redux";
import Body from "../components/Body";
import {
  Layout,
  Row,
  Statistic,
  Col,
  Breadcrumb ,
  PageHeader,
  Popconfirm,
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
  PlusOutlined,
} from "@ant-design/icons";
import ShippingEditDrawer from "../components/shipping/ShippingEditDrawer";
import Link from "next/link";
import { fetchBlogs } from "../../store/actions";
import Moment from "react-moment";
import axios from "axios";
import _ from 'lodash'
import ShippingCreateDrawer from "../components/shipping/ShippingCreateDrawer";
import CourierCreateDrawer from "../components/courier/CourierCreateDrawer";
import CourierEditDrawer from "../components/courier/CourierEditDrawer";
import Head from "next/head";
const { Header, Content, Footer, Sider } = Layout;

export class Blog extends Component {
  state = {
    searchText: "",
    searchedColumn: "",
    tableLoading: false,
  };

  componentDidMount() {
    this.props.fetchBlogs();
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
      .get(`${process.env.backendURL}/blog/deletefile/${id}`)
      .then((response) => {
        if (response.data.response) {
          this.props.fetchBlogs();
          this.setState({ tableLoading: false });
          message.success("Success");
        }
      });
  };


  render() {
    const columns = [
      // {
      //   title: "Name",
      //   dataIndex: "name",
      //   key: "name",
      //   ...this.getColumnSearchProps("name"),
      // },
      {
        title: "Image",
        dataIndex: "_id",
        key: "_id",
        width: "120px",
        render: (aa, data) => (
          <img
            src={`${process.env.imagekiturl}${data.image.filePath}?tr=w-80,h-80,q=10`}
          />
        ),
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        ...this.getColumnSearchProps("title"),
      },
      {
        title: "Created",
        dataIndex: "createdAt",
        key: "createdAt",
        width: "250px",
        responsive: ["lg"],
        render: (createdAt) => (
          <Moment format="llll">{createdAt}</Moment>
        ),
      },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        width: "224px",

        render: (data) => (
          <>
            <Link href={`/blogs/${data._id}`}><Button type="primary" icon={<EditOutlined />}>Edit</Button></Link>
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
        <Head>
        <title>Blogs</title>
        </Head>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item><Link href='/'>Dashboard</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Blogs</Breadcrumb.Item>
          </Breadcrumb>
        
          <PageHeader
            title="All Blog"
            onBack={() => window.history.back()}
            ghost={false}
            className="site-page-header-gray"
            extra={[<Link href='/blogs/create' key="1"><Button type="primary" icon={<PlusOutlined />}>Create Blog</Button></Link>]}
          >
            <Row>
                <Col xs={24} sm={24} md={4} lg={2} xl={2}>
                  <Statistic title="Total Blogs" value={this.props.datas.length} />
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
  datas: state.all_blogs,
});

export default connect(mapStateToProps, { fetchBlogs })(Blog);
