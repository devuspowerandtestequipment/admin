import React from 'react'
import { connect } from 'react-redux'


export const demo_print = (props) => {
  return (
    <div>demo_print</div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(demo_print)