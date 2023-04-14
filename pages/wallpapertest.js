import React from 'react'
import { connect } from 'react-redux'
import Body from './components/Body'

export const wallpaper = (props) => {
  return (
    <>
    <Body>
      <div></div>
    </Body>
    </>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(wallpaper)