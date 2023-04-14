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

export class UserTabOrderList extends Component {

      state = {
        searchText: "",
        searchedColumn: "",
        datas:[]
      };

      componentDidMount(){
        axios.get(`${process.env.backendURL}/user/admin_view_user_order_details/${this.props.user_id}`)
        .then(response=>{
          this.setState({
            datas:response.data.datas
          })
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
            title: "ID",
            dataIndex: "order_id",
            key: "order_id",
            ...this.getColumnSearchProps("order_id"),
        },
        {
            title: "Payment Status",
            dataIndex: "payment_status",
            key: "payment_status",
            ...this.getColumnSearchProps("payment_status"),
        },
       

        
        {
            title: 'Total',
            dataIndex: '',
            key: 'x',
            width: "150px",
    
            render: data => (
              <>
              <DynamicAmount amount={data.amount_total_final} />
  
                
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
        {
          title: '',
          dataIndex: '',
          key: 'x',
          width: "100px",
  
          render: data => (
            <>
              
              <a href={`/orders/${data._id}`} target="_blank" rel="noopener noreferrer"><Button type="primary" icon={<EyeOutlined />}></Button></a>

            </>
          ),
        },
      ];
    return (
        <>
            {/* <PageHeader
    className="site-page-header"
    title="Login Logs"
    // subTitle="This is a subtitle"
  /> */}
  <h5>Total Orders: {this.state.datas.length}</h5>
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

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(UserTabOrderList)