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
import SubcategoryCreateDrawer from "./components/subcategory/SubCategoryCreateDrawer";
import SubCategoryEditDrawer from "./components/subcategory/SubCategoryEditDrawer";
import Link from "next/link";
import { fetchSubCategories,fetchCategories } from "../store/actions";
import Moment from "react-moment";
import axios from "axios";
import _ from 'lodash'
import FindDynamicData from "./components/FindDynamicData";
const { Header, Content, Footer, Sider } = Layout;
import Head from "next/head";


export class subcategory extends Component {
  state = {
    searchText: "",
    searchedColumn: "",
    tableLoading: false,
  };

  componentDidMount() {
    this.props.fetchSubCategories();
    this.props.fetchCategories();
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
      .get(`${process.env.backendURL}/subcategory/deletefile/${id}`)
      .then((response) => {
        if (response.data.response) {
          this.props.fetchSubCategories();
          this.setState({ tableLoading: false });
          message.success("Success");
        }
      });
  };



  handleSwitchChange=(checked,id)=>{
    console.log(checked);
    console.log(id);
    axios.get(`${process.env.backendURL}/subcategory/updatestatus/${id}/${checked?'Active':'InActive'}`)
    .then(response=>{
      if(response.data.response){
        message.success('Success');
        this.props.fetchSubCategories();
      }
    })
  }



  render() {

    var dropCat=[];
    this.props.category.forEach(element => {
      dropCat.push({
          text: element.name,
          value: element._id,
      })
    });

    
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        filters: dropCat,
        onFilter: (value, record) => record.category_id.indexOf(value) === 0,
        render: (aa, data) => (
          <>
            {/* {_.find(this.props.datas, function(o) {return o.category==='625f5b49e679d148d0d032b4'})} */}
            {/* {_.find(this.props.category, function(o) {return o._id===data.category})===undefined
            ?<></>
            :
            _.find(this.props.category, function(o) {return o._id===data.category}).name
            } */}
            <FindDynamicData redux_state={'category'} find='_id' value={data.category_id} get='name' />
            

          </>
        ),
      },
      {
        title: "URL",
        dataIndex: "url",
        key: "url",
        ...this.getColumnSearchProps("url"),
      },
      {
        title: "Status",
        key: "status",
        dataIndex: "status",
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
            <SubCategoryEditDrawer data={data} />
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

    // console.log()

    return (
      <Body>
        <Head><title>Sub Categories</title></Head>
        <Content style={{ margin: "0 16px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item><Link href='/'>Dashboard</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Sub Categories</Breadcrumb.Item>
          </Breadcrumb>
          <PageHeader
            ghost={false}
            className="site-page-header-gray"
            title="Sub Categories"
            onBack={() => window.history.back()}

            extra={[<SubcategoryCreateDrawer />]}
          >
            <Row>
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Total Sub Categories" value={this.props.datas.length} />
                </Col>
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Active Sub Categories" value={_.filter(this.props.datas, function(o) { if (o.status === 'Active') return o }).length} />
                </Col>
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Inactive Sub Categories" value={_.filter(this.props.datas, function(o) { if (o.status === 'InActive') return o }).length} />
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
  datas: state.all_subcategory,
  category: state.all_category,
});

export default connect(mapStateToProps, { fetchSubCategories,fetchCategories })(subcategory);
