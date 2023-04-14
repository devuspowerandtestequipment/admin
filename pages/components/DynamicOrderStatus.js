import React from 'react'
import { connect } from 'react-redux'

export const DynamicOrderStatus = ({status}) => {

  if(status==='0'){
    return (
      <div>Canceled</div>
    )
  }
  if(status==='1'){
    return (
      <div>Waiting</div>
    )
  }
  if(status==='2'){
    return (
      <div>Accepted</div>
    )
  }
  if(status==='3'){
    return (
      <div>In Progress</div>
    )
  }
  if(status==='4'){
    return (
      <div>Packing</div>
    )
  }
  if(status==='5'){
    return (
      <div>Ready For Pickup</div>
    )
  }
  if(status==='6'){
    return (
      <div>Shipped</div>
    )
  }
  if(status==='7'){
    return (
      <div>Delivered</div>
    )
  }
  if(status==='8'){
    return (
      <div>Courier details has been updated</div>
    )
  }
  
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DynamicOrderStatus)
