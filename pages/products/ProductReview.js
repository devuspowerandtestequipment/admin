import { DeleteOutlined, EyeOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Rate, message } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { List } from 'semantic-ui-react';
import Link from 'next/link'
import DrawerProductReviewInfo from '../components/products/DrawerProductReviewInfo';
import {fetchAllReviews} from '../../store/actions'
import axios from 'axios';
import Moment from 'react-moment';

export const ProductReview = (props) => {

    const [reviews,setReviews]=useState(false);

    useEffect(()=>{
        let filtered_array = _.filter(props.reviews, 
            { 'product_id': props.product_id}
        );
        setReviews(filtered_array)
    },[props])

    const handleDelete = (id) => {
        axios.get(`${process.env.backendURL}/product/review_delete/${id}`)
        .then((response) => {
            if (response.data.response) {
                props.fetchAllReviews();
                message.success("Success");
            }else{
              message.warning("Failed");
            }
        });
      };

  return (
    <>
    <div className="site-layout-background" id='block_review' style={{ padding: 24 }}>
    <h3 className="text-primary">{reviews && reviews.length>0 && reviews.length} Reviews</h3>
    {reviews!==false &&

            <>
            <List>
            {reviews.map((rv)=>{
                return(
                    <List.Item key={rv._id} style={{marginBottom:'1.5rem'}}>
                        <List.Header>{rv.user_id.name}  <Rate value={rv.rating} disabled/>
                            <div style={{float:'right'}}>
                            
                            <DrawerProductReviewInfo data={rv} bigButton={false} />
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
                        <small><Moment format="LLLL">{rv.createdAt}</Moment></small>
                        <br />
                        <br />
                        <p>{rv.comment}</p>
                    </List.Item>
                )
            })}
            </List>
            </>

    }
    <br/>
    </div>
    <br/>
    <br/>

    </>
  )
}

const mapStateToProps = (state) => ({
    reviews:state.all_reviews
})

export default connect(mapStateToProps, {fetchAllReviews})(ProductReview)