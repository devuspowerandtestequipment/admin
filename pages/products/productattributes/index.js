import React, { Component } from "react";
import { connect } from "react-redux";
import Body from "../../components/Body";
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
} from "@ant-design/icons";
import AttributeEditDrawer from "../../components/attributes/AttributeEditDrawer";
import Link from "next/link";
import { fetchAttributes } from "../../../store/actions";
import Moment from "react-moment";
import axios from "axios";
import _ from 'lodash'
import AttributeCreateDrawer from "../../components/attributes/AttributeCreateDrawer";
const { Header, Content, Footer, Sider } = Layout;


export class index extends Component {
  state = {
    searchText: "",
    searchedColumn: "",
    tableLoading: false,
  };

  componentDidMount() {
    this.props.fetchAttributes();
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
      .get(`${process.env.backendURL}/attribute/deletefile/${id}`)
      .then((response) => {
        if (response.data.response) {
          this.props.fetchAttributes();
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
        title: "Type",
        dataIndex: "type",
        key: "type",
        ...this.getColumnSearchProps("type"),
        render: (type) => (
          <>
          {type==='Single Dropdown'?`Dropdown`:type}
          </>
        ),
      },
      {
        title: "Required",
        dataIndex: "isrequired",
        key: "isrequired",
        ...this.getColumnSearchProps("isrequired"),
      },
      // {
      //   title: "Visible on Product View Page on Front-end",
      //   dataIndex: "isvisiblesearch",
      //   key: "isvisiblesearch",
      //   ...this.getColumnSearchProps("isvisiblesearch"),
      // },
      {
        title: "Configurable Attribute",
        dataIndex: "isconfigproduct",
        key: "isconfigproduct",
        ...this.getColumnSearchProps("isconfigproduct"),
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
      },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        width: "224px",

        render: (data) => (
          <>
            <AttributeEditDrawer data={data} />
            &nbsp;
            <Popconfirm
              title="Are you sure to delete this attribute?"
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
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item><Link href='/'>Dashboard</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Attributes</Breadcrumb.Item>
          </Breadcrumb>
          <PageHeader
            ghost={false}
            className="site-page-header-gray"
            onBack={() => window.history.back()}
            title="Attributes"
            extra={[<AttributeCreateDrawer />]}
          >
            <Row>
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Total Attributes" value={this.props.datas.length} />
                </Col>
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Text" value={_.filter(this.props.datas, function(o) { if (o.type === 'Text') return o }).length} />
                </Col>
                {/* <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Longtext Attribute" value={_.filter(this.props.datas, function(o) { if (o.type === 'Longtext') return o }).length} />
                </Col> */}
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Single Dropdown" value={_.filter(this.props.datas, function(o) { if (o.type === 'Single Dropdown') return o }).length} />
                </Col>
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Multiple Dropdown" value={_.filter(this.props.datas, function(o) { if (o.type === 'Multiple Dropdown') return o }).length} />
                </Col>
                {/* <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Radio Attribute" value={_.filter(this.props.datas, function(o) { if (o.type === 'Radio') return o }).length} />
                </Col>
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Checkbox Attribute" value={_.filter(this.props.datas, function(o) { if (o.type === 'Checkbox') return o }).length} />
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
  datas: state.all_attributes,
});

export default connect(mapStateToProps, { fetchAttributes })(index);
