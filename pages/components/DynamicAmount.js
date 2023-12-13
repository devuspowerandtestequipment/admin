import React from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'
// import CurrencyConverter from 'react-currency-conv';

export const DynamicAmount = (props) => {

var number = numeral(props.amount);
numeral.defaultFormat('0,0.00');

    console.log('Called')
  return (
    <>
    ${number.format()}
{/* xxxxxxx */}
    {/* <CurrencyConverter from={'USD'} to={'INR'} value={2}/> */}

    </>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DynamicAmount)