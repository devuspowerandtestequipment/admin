import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    DatePicker,
    Table,
    Input,
    Button,
    Space,
    Rate,
    Popconfirm,
    message
  } from "antd";
  import Highlighter from "react-highlight-words";
  import { SearchOutlined, EyeOutlined,EditOutlined,DeleteOutlined } from "@ant-design/icons";
  import Link from 'next/link'
import Moment from 'react-moment';
import moment from "moment";
import axios from 'axios';
import DrawerUserLoginDetails from './DrawerUserLoginDetails';
import DynamicAmount from '../../DynamicAmount'
import {fetchAllReviews} from '../../../../store/actions'
import DrawerProductReviewInfo from '../../products/DrawerProductReviewInfo';
const { RangePicker } = DatePicker;

export class UserTabReviews extends Component {

      state = {
        searchText: "",
        searchedColumn: "",
        datas:[]
      };

      // componentDidMount(){
      //   axios.get(`${process.env.backendURL}/user/admin_view_user_order_details/${this.props.user_id}`)
      //   .then(response=>{
      //     this.setState({
      //       datas:response.data.datas
      //     })
      //   })
      // }

      handleDelete = (id) => {
        this.setState({ tableLoading: true });
    
        axios.get(`${process.env.backendURL}/product/review_delete/${id}`)
        .then((response) => {
            if (response.data.response) {
                this.props.fetchAllReviews();
                message.success("Success");
            }else{
              message.warning("Failed");
            }
        });
      };


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
            text===null?'Item Not Found':text
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

  render() {

    const columns = [
        {
          title: "Rating",
          dataIndex: "rating",
          key: "rating",
          width: "250px",
          render: (rating) => (
            <Rate disabled value={rating}></Rate>
          ),
        },
        {
            title: "Comment",
            dataIndex: 'comment',
            key: "comment",
            width: "20%",
            ...this.getColumnSearchProps('comment')
          },
        // {
        //   title: "User IP",
        //   dataIndex: ["ipinfo", "ipAddress"],
        //   key: "ipAddress",
        //   // width: "30%",
        //   ...this.getColumnSearchPropsCustom(["ipinfo", "ipAddress"],'ip address')
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
          ...this.getColumnSearchPropsDateFilterCustom('createdAt')
        },
        {
          title: "Action",
          dataIndex: "",
          key: "x",
          width: "224px",
  
          render: (data) => (
            <>
              {/* <CouponsEditDrawer data={data} />
              &nbsp; */}
              {/* <DrawerUserLoginDetails data={data} /> */}
              <DrawerProductReviewInfo data={data} bigButton={true} />
              &nbsp;
              {data.product_type==='Configurable'
              ?
              <a href={`/products/create3config?codeid=${data.product_id}&target=review`}  target="_blank" rel="noopener">
                <Button type="primary" icon={<EyeOutlined />}>View</Button>
              </a>
              :
              <a href={`/products/create2simple?codeid=${data.product_id}&target=review`}  target="_blank" rel="noopener">
                <Button type="primary" icon={<EyeOutlined />}>View</Button>
              </a>
              }
              &nbsp;
              <Popconfirm
                title="Are you sure to delete this review?"
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

    var filter_reviews = _.filter(this.props.datas, { user_id: { _id: this.props.user_id } });
    
      console.log('filter_reviews',filter_reviews);
    return (
        <>
            <h5>Total Ratings: {filter_reviews.length}</h5>
            <Table
                loading={false}
                size="small"
                columns={columns}
                dataSource={filter_reviews}
                pagination={{ pageSize: 15 }}
            />
        </>
        
    )
  }
}

const mapStateToProps = (state) => ({
    datas: state.all_reviews,
})

export default connect(mapStateToProps, {fetchAllReviews})(UserTabReviews)