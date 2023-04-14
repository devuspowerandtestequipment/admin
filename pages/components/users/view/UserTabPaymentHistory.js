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
import {fetchAllLastVisitedProducts} from '../../../../store/actions'
import DrawerProductReviewInfo from '../../products/DrawerProductReviewInfo';
import DrawerLastVisitedProductInfo from './DrawerLastVisitedProductInfo';
const { RangePicker } = DatePicker;

export class UserTabPaymentHistory extends Component {

      state = {
        searchText: "",
        searchedColumn: "",
        datas:[]
      };

    //   componentDidMount(){
    //     axios.get(`${process.env.backendURL}/user/admin_view_user_order_details/${this.props.user_id}`)
    //     .then(response=>{
    //       this.setState({
    //         datas:response.data.datas
    //       })
    //     })
    //   }

      handleDelete = (id) => {
        this.setState({ tableLoading: true });
    
        axios.get(`${process.env.backendURL}/user/admin_delete_user_productvisit_list/${id}`)
        .then((response) => {
            if (response.data.response) {
                this.props.fetchAllLastVisitedProducts();
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
        // {
        //   title: "User Name",
        //   dataIndex: ["user_id", "name"],
        //   key: "name",
        //   width: "20%",
        //   ...this.getColumnSearchPropsCustom(["user_id", "name"],'name')
        // },
        {
          title: "Order",
          dataIndex: ["order_id", "order_id"],
          key: "order_id",
          width: "20%",
          ...this.getColumnSearchPropsCustom(["order_id", "order_id"],'order_id')
        },
        {
          title: "Amount",
          dataIndex: "amount",
          key: "amount",
          width: "150px",
          responsive: ["lg"],
          render: (amount) => (
            <DynamicAmount amount={amount} />
          ),
        },
        {
          title: "Payment Method",
          dataIndex: "payment_method",
          key: "payment_method",
          ...this.getColumnSearchProps("payment_method"),
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
          title: "Action",
          dataIndex: "",
          key: "x",
          width: "224px",
          render: (data) => (
            <>
              {data.order_id && 
                  <a href={`/orders/${data.order_id._id}`}  target="_blank" rel="noopener">
                      <Button type="primary" icon={<EyeOutlined />}>
                          View
                      </Button>
                  </a>
              }
              
              
            </>
          ),
        },
      ];

    var filter_reviews = _.filter(this.props.datas, { user_id: { _id: this.props.user_id } });
    
    return (
        <>
            <h5>Total: {filter_reviews.length}</h5>
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
    datas:state.all_payment_history,
})

export default connect(mapStateToProps, {fetchAllLastVisitedProducts})(UserTabPaymentHistory)