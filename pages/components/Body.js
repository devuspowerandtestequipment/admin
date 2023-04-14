import React, { useEffect, useState } from 'react'
import cookie from 'react-cookies'
import { connect } from 'react-redux'
import {fetchDynamicDatas,fetchNotifications,fetchCartItems,fetchUsers,fetchOrders,fetchAllReviews,fetchAllLastVisitedProducts,fetchAllPaymentHistory} from '../../store/actions'
import Head from 'next/head'
import ls from 'localstorage-slim';
import * as ACTION  from '../../store/types'
import HeaderAdminSettingsCheck from './HeaderAdminSettingsCheck.js'

export const Body = (props) => {


  useEffect(()=>{

    
    // if(props.dynamic_datas===null){
    //   props.fetchDynamicDatas();
    // }

    props.fetchDynamicDatas();
    props.fetchNotifications();
    props.fetchCartItems();
    props.fetchUsers();
    props.fetchOrders();
    props.fetchAllReviews();
    props.fetchAllLastVisitedProducts();
    props.fetchAllPaymentHistory();
  },[])



  return (
    <>
    
    <Head>
      {ls.get(ACTION.AUTH_USER_INFORMATION) &&
        <link rel="stylesheet" href={`https://api.reactnodeecommerce.cloud/themes/${props.auth?props.auth.admin_theme:'ss'}.css`} />
      }

      {/* <link rel="stylesheet" href={`http://localhost:5000/themes/desert1.css`} /> */}
  
    </Head>
    {props.dynamic_datas===null
    ?
    <center>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h4>Loading...</h4>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </center>
    :<HeaderAdminSettingsCheck auth={ls.get(ACTION.AUTH_USER_INFORMATION)} >{props.children}</HeaderAdminSettingsCheck>
    }
    </>
  )
}

const mapStateToProps = (state) => ({
  dynamic_datas:state.dynamic_datas,
  auth:state.auth
})


export default connect(mapStateToProps, {fetchDynamicDatas,fetchNotifications,fetchCartItems,fetchUsers,fetchOrders, fetchAllReviews,fetchAllLastVisitedProducts,fetchAllPaymentHistory})(Body)