import React from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'

export const DynamicNotificationStatus = ({status,user}) => {

  if(status==='notification_new_user_register'){
    if(user){
        return (
            <span><a><b>{user.name.split(' ')[0]}</b></a> just created a new account.</span>
          )
    }else{
        return (
            <span>(Userdeleted) - just created a new account.</span>
          )
    }
  }
  if(status==='notification_user_account_information_changed'){
    if(user){
        return (
            <span><a><b>{user.name.split(' ')[0]}</b></a> just changed his account information.</span>
          )
    }else{
        return (
            <span>(Userdeleted) - just changed his account information.</span>
          )
    }
  }
  if(status==='notification_user_password_changed'){
    return (
      <span>Password Changed</span>
    )
  }
  if(status==='notification_new_contactus'){
    return (
      <span>Contact Request</span>
    )
  }
  if(status==='notification_new_order'){

    if(user){
        return (
            <span><a><b>{user.name.split(' ')[0]}</b></a> placed an order</span>
          )
    }else{
        return (
            <span>(Userdeleted) - placed an order</span>
          )
    }

    
  }
  if(status==='notification_new_cart_item'){
    if(user){
        return (
            <span><a><b>{user.name.split(' ')[0]}</b></a> added a new item in cart</span>
          )
    }else{
        return (
            <span>(Userdeleted) - added a new item in cart</span>
          )
    }
    
  }

  if(status==='notification_admin_account_information_changed'){
    return (
      <span>Admin account information updated</span>
    )
  }

  if(status==='notification_product_review'){
    if(user){
        return (
            <span><a><b>{user.name.split(' ')[0]}</b></a> new product review</span>
          )
    }else{
        return (
            <span>(Userdeleted) - product review</span>
          )
    }
  }

  if(status==='notification_product_review_update'){
    if(user){
        return (
            <span><a><b>{user.name.split(' ')[0]}</b></a> updated his/her review</span>
          )
    }else{
        return (
            <span>(Userdeleted) - updated his/her review</span>
          )
    }
  }

  
  

  // if(status==='notification_admin_account_information_changed'){
  //   if(user){
  //       return (
  //           <span><a><b>{user.name.split(' ')[0]}</b></a> added a new item in cart</span>
  //         )
  //   }else{
  //       return (
  //           <span>- admin account information updated</span>
  //         )
  //   }
    
  // }


  
  // if(status==='6'){
  //   return (
  //     <span>Shipped</span>
  //   )
  // }
  // if(status==='7'){
  //   return (
  //     <span>Delivered</span>
  //   )
  // }
  
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DynamicNotificationStatus)
