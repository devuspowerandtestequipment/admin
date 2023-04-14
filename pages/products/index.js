import React, { Component } from "react";
import { connect } from "react-redux";
import Body from "../components/Body";
import {
  Layout,
  Row,
  Statistic,
  Col,
  Breadcrumb,
  PageHeader,
  DatePicker,
  message,
  Tag,
  Table,
  Input,
  Button,
  Space,
  Segmented
} from "antd";
import Highlighter from "react-highlight-words";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import BrandCreateDrawer from "../components/brands/BrandCreateDrawer";
import BrandEditDrawer from "../components/brands/BrandEditDrawer";
import Link from "next/link";
import { fetchProducts,fetchChildCategories,fetchCategories,fetchSubCategories } from "../../store/actions";
import Moment from "react-moment";
import axios from "axios";
import Head from "next/head";
import MostViewedProduct from "../pageviews/MostViewedProduct";
import _ from 'lodash'
import FindDynamicData from "../components/FindDynamicData";
import moment from 'moment'
import ListViewProducts from "./ListViewProducts";
import TabRecentlyViewedProduct from "./TabRecentlyViewedProduct";
const { RangePicker } = DatePicker;
const { Header, Content, Footer, Sider } = Layout;
import DynamicAmount from '../components/DynamicAmount'

export class index extends Component {
  state = {
    searchText: "",
    searchedColumn: "",
    tableLoading: false,
    segmented:'View All'
  };

  componentDidMount() {
    this.props.fetchProducts();
    this.props.fetchCategories();
    this.props.fetchSubCategories();
    this.props.fetchChildCategories();
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
          this.props.fetchProducts();
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
        this.props.fetchProducts();
      }
    })
  }

  render() {

    //CATEGORY SEARCH
    var categoryList=[]
    this.props.allcategory.map((cat)=>{
      categoryList.push({text:cat.name,value:cat._id})
    })

    //SUB CATEGORY SEARCH
    var subcategoryList=[]
    this.props.allsubcategory.map((cat)=>{
      subcategoryList.push({text:cat.name,value:cat._id})
    })

    //CHILD CATEGORY SEARCH
    var childcategoryList=[]
    this.props.allchildcategory.map((cat)=>{
      childcategoryList.push({text:cat.name,value:cat._id})
    })


    const columns = [
      // {
      //   title: "Image",
      //   dataIndex: "brand_image",
      //   key: "brand_image",
      //   width: "120px",
      //   render: (aa, data) => (
      //     <img
      //       src={`${process.env.imagekiturl}${data.brand_image}?tr=w-80,h-80,q=1`}
      //     />
      //   ),
      // },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: "200px",

        render: (aa, data) => (
          <>
            {data.name}
          </>
        ),
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "SKU",
        dataIndex: "sku",
        key: "sku",
        // width: "20%",
        ...this.getColumnSearchProps("sku"),
      },
      {
        title: "Category",
        key: "category",
        dataIndex: "category",
        filters: categoryList,
        filterMode: 'tree',
        filterSearch: true,
        onFilter: (value, record) => record.category.includes(value),
        render: (aa, data) => (
          <>
            {data.category.map((dta,key)=>{
              return(
                <span key={key}>
                  <FindDynamicData redux_state={'category'} find='_id' value={dta} get='name' /> 
                  {data.category.length===key+1 //remove comma from last element
                  ?<></>
                  :<>,&nbsp;</>
                  }
                </span>
              )
            })}
            {/* {data.category.join(', ')} */}
          </>
        ),
      },
      {
        title: "Sub Category",
        key: "subcategory",
        dataIndex: "subcategory",
        filters: subcategoryList,
        filterMode: 'tree',
        filterSearch: true,
        onFilter: (value, record) => record.subcategory.includes(value),
        render: (aa, data) => (
          <>
            {data.subcategory.map((dta,key)=>{
              return(
                <span key={key}>
                  <FindDynamicData redux_state={'subcategory'} find='_id' value={dta} get='name' /> 
                  {data.subcategory.length===key+1 //remove comma from last element
                  ?<></>
                  :<>,&nbsp;</>
                  }
                </span>
              )
            })}
          </>
        ),
      },
      {
        title: "Child Category",
        key: "childcategory",
        dataIndex: "childcategory",
        filters: childcategoryList,
        filterMode: 'tree',
        filterSearch: true,
        onFilter: (value, record) => record.childcategory.includes(value),
        render: (aa, data) => (
          <>
            {data.childcategory.map((dta,key)=>{
              return(
                <span key={key}>
                  <FindDynamicData redux_state={'childcategory'} find='_id' value={dta} get='name' /> 
                  {data.childcategory.length===key+1 //remove comma from last element
                  ?<></>
                  :<>,&nbsp;</>
                  }
                </span>
              )
            })}
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
            value: 'Active',
          },
          {
            text: 'Pending',
            value: 'Pending',
          },
        ],
        onFilter: (value, record) => record.status.indexOf(value) === 0,
        render: (aa, data) => (
          <>
            
            {data.status==='Active'
            ?<Tag color="#87d068">Active</Tag>
            :<Tag color="#f50">Pending</Tag>
            }
            {/* <Switch checkedChildren="Active" unCheckedChildren="InActive" checked={data.status==='Active'?true:false} onChange={(sss)=>this.handleSwitchChange(sss,data._id)} /> */}
          </>
        ),
      },
      {
        title: "Type",
        key: "type",
        dataIndex: "type",
        // ...this.getColumnSearchProps("type"),
        filters: [
          { text: 'Configurable', value: 'Configurable' },
          { text: 'Simple', value: 'Simple' },
        ],
        onFilter: (value, record) => record.type.indexOf(value) === 0,
        render: (aa, data) => (
          <>
            {data.type==='Configurable'
            ?<Tag color="#2db7f5">Configurable</Tag>
            :<Tag color="#108ee9">Simple</Tag>
            }
            {/* <Switch checkedChildren="Active" unCheckedChildren="InActive" checked={data.status==='Active'?true:false} onChange={(sss)=>this.handleSwitchChange(sss,data._id)} /> */}
          </>
        ),
      },


      {
        title: "Price",
        key: "type",
        dataIndex: "type",
        // ...this.getColumnSearchProps("type"),
        // filters: [
        //   { text: 'Configurable', value: 'Configurable' },
        //   { text: 'Simple', value: 'Simple' },
        // ],
        width: "200px",

        onFilter: (value, record) => record.type.indexOf(value) === 0,
        render: (aa, data) => (
          <>
            {data.type==='Simple'
              ?<><DynamicAmount amount={data.price_lowest} /></>
              :<><DynamicAmount amount={data.price_lowest} /> - <DynamicAmount amount={data.price_heighest} /> </>
              //  props.data.price_lowest===props.data.price_heighest
              //   ?
              //   <DynamicAmount amount={props.data.price_lowest} />
              //   :
              //   <><DynamicAmount amount={props.data.price_lowest} /> - <DynamicAmount amount={props.data.price_heighest} /> </>
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
      {
        title: "",
        dataIndex: "",
        key: "x",
        width: "100px",

        render: (data) => (
          <>
            {/* <Link href={`/products/viewConfig?codeid=${data._id}`}><Button type="primary" icon={<EyeOutlined />}>View</Button></Link> */}
            {/* {data.type==='Configurable'
            ?<Link href={`/products/viewConfig?codeid=${data._id}`}><Button type="primary" icon={<EyeOutlined />}>View</Button></Link>
            :
            <></>} */}
            
            
            &nbsp;
            {data.step==='step2config'
            ?<a href={`/products/create2config?codeid=${data._id}`} target="_blank" rel="noopener"><Button type="primary" icon={<EditOutlined />}>Edit</Button></a>
            :<></>}

            {data.step==='step3config'
            ?<a href={`/products/create3config?codeid=${data._id}`} target="_blank" rel="noopener"><Button type="primary" icon={<EditOutlined />}>Edit</Button></a>
            :<></>}

            {data.step==='step2simple'
            ?<a href={`/products/create2simple?codeid=${data._id}`} target="_blank" rel="noopener"><Button type="primary" icon={<EditOutlined />}>Edit</Button></a>
            :<></>}
            
          </>
        ),
      },
    ];

    return (
      <Body>
        <Head><title>Products</title></Head>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item><Link href='/'>Dashboard</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Products</Breadcrumb.Item>
          </Breadcrumb>
          <PageHeader
            ghost={false}
            className="site-page-header-gray"
            title="Products"
            onBack={() => window.history.back()}
            // breadcrumb={{ routes }}
            // subTitle="This is a subtitle"
            
            extra={[<Link href='/products/create'><Button type='primary' icon={<PlusOutlined />}>Create Product</Button></Link>]}
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
              <Statistic title="Total Products" value={this.props.products.length} />
            </Col>
            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
              <Statistic title="Active Products" value={_.filter(this.props.products, function(o) { if (o.status === 'Active') return o }).length} />
            </Col>
            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
              <Statistic title="Pending Products" value={_.filter(this.props.products, function(o) { if (o.status === 'Pending') return o }).length} />
            </Col>
            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
              <Statistic title="Configurable Products" value={_.filter(this.props.products, function(o) { if (o.type === 'Configurable') return o }).length} />
            </Col>
            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
              <Statistic title="Simple Products" value={_.filter(this.props.products, function(o) { if (o.type === 'Simple') return o }).length} />
            </Col>
            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
              <Statistic title="Total Visited Products" value={this.props.all_user_last_visited_productlist.length} />
            </Col>

            
        
        </Row>
          </PageHeader>
          <br />

          <Segmented options={['View All', 'Recently Visited Product','Top Visited Product URL', 'List View']} value={this.state.segmented} onChange={(e)=>this.setState({segmented:e})} />

          <br />
          <br />

          {this.state.segmented==='View All' &&
            <Table
              columns={columns}
              dataSource={this.props.products}
              pagination={{ pageSize: 10 }}
              loading={this.state.tableLoading}
              scroll={{ x: 500 }}
            />
          }

          {this.state.segmented==='List View' &&
            <ListViewProducts products={this.props.products} />
          } 

          {this.state.segmented==='Top Visited Product URL' &&
            <MostViewedProduct />
          }

          {this.state.segmented==='Recently Visited Product' &&
            <TabRecentlyViewedProduct />
          }
          
        </Content>
      </Body>
    );
  }
}

const mapStateToProps = (state) => ({
  products: state.all_products,
  allcategory:state.all_category,
  allsubcategory:state.all_subcategory,
  allchildcategory:state.all_childcategory,
  all_user_last_visited_productlist:state.all_user_last_visited_productlist
});

export default connect(mapStateToProps, { fetchProducts,fetchChildCategories,fetchCategories,fetchSubCategories })(index);
