import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Tag,
    Table,
    Input,
    Button,
    Space,
    PageHeader
  } from "antd";
  import Highlighter from "react-highlight-words";
  import { SearchOutlined, EyeOutlined,EditOutlined,DeleteOutlined } from "@ant-design/icons";
  import Link from 'next/link'
import Moment from 'react-moment';
import moment from "moment";
import axios from 'axios';
import DrawerUserLoginDetails from './DrawerUserLoginDetails';
import DynamicAmount from '../../DynamicAmount'
import {fetchCartItems,clearSingleNotificationByMessageUser,fetchNotifications} from '../../../../store/actions'

export class UserTabCartList extends Component {

      state = {
        searchText: "",
        searchedColumn: "",
        datas:[]
      };

      componentDidMount(){
        axios.get(`${process.env.backendURL}/user/admin_view_user_cart_details/${this.props.user_id}`)
        .then(response=>{
          this.setState({
            datas:response.data.datas
          })
        })


        // seen all items of user cart
        axios.get(`${process.env.backendURL}/cart/admin_setseen_all_userscart/${this.props.user_id}`)
        .then(response=>{
          this.props.fetchCartItems();
        })
        
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

  render() {

    const columns = [
        {
            title: "Name",
            dataIndex: "product_name",
            key: "product_name",
            ...this.getColumnSearchProps("product_name"),
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            ...this.getColumnSearchProps("quantity"),
        },
        {
            title: 'Price',
            dataIndex: '',
            key: 'x',
            width: "150px",
    
            render: data => (
              <>
              <DynamicAmount amount={data.product_price} />
  
                
                  {/* <Link href='/users/view'><Button type="primary" icon={<EyeOutlined />} size="small">View</Button></Link> */}
  
              </>
            ),
          },

        {
          title: 'Date and Time',
          dataIndex: '',
          key: 'x',
          width: "350px",
  
          render: tags => (
            <>
            <Moment format="LLL">{tags.createdAt}</Moment> ({moment(tags.createdAt).fromNow()})

              
                {/* <Link href='/users/view'><Button type="primary" icon={<EyeOutlined />} size="small">View</Button></Link> */}

            </>
          ),
        },
        // {
        //   title: '',
        //   dataIndex: '',
        //   key: 'x',
        //   width: "100px",
  
        //   render: tags => (
        //     <>
              
        //       <DrawerUserLoginDetails data={tags} />

        //     </>
        //   ),
        // },
      ];
    return (
        <>
            {/* <PageHeader
    className="site-page-header"
    title="Login Logs"
    // subTitle="This is a subtitle"
  /> */}
  <h5>Total Products: {this.state.datas.length}</h5>
  <Table
  loading={false}
  size="small"
        columns={columns}
        dataSource={this.state.datas}
        pagination={{ pageSize: 15 }}
  />
        </>
        
    )
  }
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {fetchCartItems,clearSingleNotificationByMessageUser,fetchNotifications})(UserTabCartList)