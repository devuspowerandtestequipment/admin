import { DeleteOutlined, EyeOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Rate, message } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { List } from 'semantic-ui-react';
import Link from 'next/link'
import DrawerProductReviewInfo from '../components/products/DrawerProductReviewInfo';
import {fetchAllLastVisitedProducts} from '../../store/actions'
import axios from 'axios';
import moment from 'moment';
import LazyLoad from 'react-lazyload';
import DrawerLastVisitedProductInfo from '../components/users/view/DrawerLastVisitedProductInfo';

export const TabRecentlyViewedProducts = (props) => {

    
    useEffect(()=>{
       props.fetchAllLastVisitedProducts(); 
    },[])

    const handleClear = () => {
        axios.get(`${process.env.backendURL}/user/admin_user_all_productvisit_list_clear`)
        .then((response) => {
            if (response.data.response) {
                props.fetchAllLastVisitedProducts();
                message.success("Success");
            }else{
              message.warning("Failed");
            }
        });
    };

  return (
    <>
    <div className="site-layout-background" id='block_review' style={{ padding: 24 }}>
    <h3 className="text-primary">{props.datas && props.datas.length>0 && props.datas.length} Recently Viewed Products
        <span style={{float:'right'}}>
           <Popconfirm
                 placement="top"
                 title={`Are you sure?`}
                 onConfirm={handleClear}
                 okText="Yes"
                 cancelText="No"
            >
                 <Button type="primary" danger htmlType="submit" icon={<DeleteOutlined />}>Clear All</Button>
            </Popconfirm>
        </span>
    </h3>
    <br />
    <br />

    {props.datas &&
        <List relaxed='very'>
            {props.datas.map((data,key)=>{
                return(
                    <LazyLoad height={21} key={data._id}>
                        <List.Item style={{marginBottom:'15px'}}>
                            <List.Header as='a'><DrawerLastVisitedProductInfo data={data} bigButton={false} /> </List.Header>
                            <List.Content>
                                <List.Description>
                                    {/* <a href={`${process.env.frontendURL}/${data._id}`} target="_blank" rel="noopener noreferrer">{data._id}</a> <span style={{float:'right'}}>{data.count} times</span> */}

                                    
                                </List.Description>
                            </List.Content>
                        </List.Item>
                    </LazyLoad>
                )
            })}
            
        </List>
    }
    
    
    
    {/* {props.datas!==false &&

    <List>
        {props.datas.map((rv)=>{
            return(
                <List.Item key={rv._id} style={{marginBottom:'1rem'}}>
                    <List.Header>{rv.user_id.name}  
                        <Moment format="LLLL">{rv.createdAt}</Moment>
                        <div style={{float:'right'}}>
                        
                        {rv.product_id && rv.product_id.name}
                        &nbsp;
                        <Popconfirm
                            title="Are you sure to delete this review?"
                            onConfirm={() => handleDelete(rv._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                        <Button type="danger" icon={<DeleteOutlined />} size='small' />
                        </Popconfirm>
                        </div>
                    </List.Header>
                    <br />
                    {rv.comment}
                </List.Item>
            )
        })}
    </List>

    } */}
    <br/>
    </div>
    <br/>
    <br/>

    </>
  )
}

const mapStateToProps = (state) => ({
    datas:state.all_user_last_visited_productlist
})

export default connect(mapStateToProps, {fetchAllLastVisitedProducts})(TabRecentlyViewedProducts)