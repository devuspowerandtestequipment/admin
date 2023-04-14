import React from 'react'
import { connect } from 'react-redux'
import Body from './components/Body'

export const blankpageforthemetest = (props) => {
  return (
    <Body>
        <></>
    </Body>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(blankpageforthemetest)