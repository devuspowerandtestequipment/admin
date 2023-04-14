import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Icon, Image, Statistic } from 'semantic-ui-react'
import { BsMinecart } from "react-icons/bs";
import { MdOutlineShoppingCart, MdLockClock } from "react-icons/md";
import axios from 'axios';
import DynamicAmount from '../../DynamicAmount';



export const UserTabDashboard = (props) => {

 const [data,setData]=useState(false);

 useEffect(()=>{
    axios.get(`${process.env.backendURL}/user/admin_view_user_dashboard_details/${props.user_id}`)
    .then(response=>{
        console.log(response.data.data)
        setData({
            total_logins:response.data.data.total_logins,
            total_cart:response.data.data.total_cart,
            total_order:response.data.data.total_order,
            total_buy_amount:response.data.data.total_buy_amount[0]===undefined?0:response.data.data.total_buy_amount[0].TotalSum,

        })
    })
 },[props])


  return (
    <>
        <br />
        <br />

    {data &&
    <>
        <Statistic.Group widths='two'>
            <Statistic>
                <Statistic.Value><DynamicAmount amount={data.total_buy_amount} /></Statistic.Value>
                <Statistic.Label>₹ Amount Purchased</Statistic.Label>
            </Statistic>
            <Statistic>
                <Statistic.Value>{data.total_order}</Statistic.Value>
                <Statistic.Label><BsMinecart /> Total Order</Statistic.Label>
            </Statistic>
        </Statistic.Group>
        <br />
        <br />
        <br />

        <Statistic.Group widths='two'>
            <Statistic>
                <Statistic.Value>{data.total_cart}</Statistic.Value>
                <Statistic.Label><MdOutlineShoppingCart /> Total Cart</Statistic.Label>
            </Statistic>
            <Statistic>
                <Statistic.Value>{data.total_logins}</Statistic.Value>
                <Statistic.Label><MdLockClock /> Total Logins</Statistic.Label>
            </Statistic>
        </Statistic.Group>
        </>
    }
        <br />
        <br />

    
    </>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(UserTabDashboard)