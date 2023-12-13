import React, { Component } from "react";
import { connect } from "react-redux";
import Body from "./components/Body";
import {
  Layout,
  Row,
  Statistic,
  Col,
  Switch,
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
import BrandCreateDrawer from "./components/brands/BrandCreateDrawer";
import BrandEditDrawer from "./components/brands/BrandEditDrawer";
import Link from "next/link";
import { fetchBrands } from "../store/actions";
import Moment from "react-moment";
import axios from "axios";
import BrandViewDrawer from "./components/brands/BrandViewDrawer";
import _ from 'lodash'
import Head from "next/head";

const { Header, Content, Footer, Sider } = Layout;


export class brands extends Component {
  state = {
    searchText: "",
    searchedColumn: "",
    tableLoading: false,
  };

  componentDidMount() {
    this.props.fetchBrands();
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

  handleDelete = (id, fileid) => {
    this.setState({ tableLoading: true });
    axios
      .get(`${process.env.backendURL}/brand/deletefile/${id}/${fileid}`)
      .then((response) => {
        if (response.data.response) {
          this.props.fetchBrands();
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
        this.props.fetchBrands();
      }
    })
  }

  render() {
    const columns = [
      {
        title: "Image",
        dataIndex: "image",
        key: "image",
        width: "120px",
        render: (aa, data) => (
          <img
            src={`${process.env.imagekiturl}${data.image}?tr=w-80,h-80,q=10`}
          />
        ),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        // width: "30%",
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "URL",
        dataIndex: "url",
        key: "url",
        // width: "20%",
        ...this.getColumnSearchProps("url"),
      },
      {
        title: "Status",
        key: "status",
        dataIndex: "status",
        // ...this.getColumnSearchProps("brand_status"),
        // filters: [
        //   { text: 'Male', value: 'male' },
        //   { text: 'Female', value: 'female' },
        // ],

        filters: [
          {
            text: 'Active',
            value: 'Active',
          },
          {
            text: 'InActive',
            value: 'InActive',
          },
        ],
        onFilter: (value, record) => record.status.indexOf(value) === 0,
        render: (aa, data) => (
          <>
            <Switch checkedChildren="Active" unCheckedChildren="InActive" checked={data.status==='Active'?true:false} onChange={(sss)=>this.handleSwitchChange(sss,data._id)} />
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
      },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        width: "334px",

        render: (data) => (
          <>
            <BrandViewDrawer data={data} />
            &nbsp;
            <BrandEditDrawer data={data} />
            &nbsp;
            <Popconfirm
              title="Are you sure to delete this brand?"
              onConfirm={() => this.handleDelete(data._id, data.image_id)}
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
        <Head><title>Brands</title></Head>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item><Link href='/'>Dashboard</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Brands</Breadcrumb.Item>
          </Breadcrumb>
          <PageHeader
            ghost={false}
            className="site-page-header-gray"
            title="Brands"
            onBack={() => window.history.back()}
            // breadcrumb={{ routes }}
            // subTitle="This is a subtitle"
            extra={[<BrandCreateDrawer key="1" />]}
          >
            {/* <Descriptions
              size="small"
              column={{ xxl: 8, xl: 8, lg: 8, md: 3, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="Total Brands">{this.props.brands.length}</Descriptions.Item>
              <Descriptions.Item label="Active Brands">{_.filter(this.props.brands, function(o) { if (o.brand_status === 'Active') return o }).length}</Descriptions.Item>
              <Descriptions.Item label="Inactive Brands">{_.filter(this.props.brands, function(o) { if (o.brand_status === 'InActive') return o }).length}</Descriptions.Item>
            </Descriptions> */}
            <Row>
            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
              <Statistic title="Total Brands" value={this.props.brands.length} />
            </Col>
            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
            <Statistic title="Active Brands" value={_.filter(this.props.brands, function(o) { if (o.status === 'Active') return o }).length} />
            </Col>
            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
            <Statistic title="Inactive Brands" value={_.filter(this.props.brands, function(o) { if (o.status === 'InActive') return o }).length} />
            </Col>
        
      </Row>
          </PageHeader>
          <br />

          <Table
            columns={columns}
            dataSource={this.props.brands}
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
  brands: state.all_brands,
});

export default connect(mapStateToProps, { fetchBrands })(brands);
