import { Button, message } from 'antd'
import axios from 'axios'
import React from 'react'
import { connect } from 'react-redux'

export const SettingsCache = (props) => {

    const handleClearCache=()=>{
        message.success('Success');
        // axios.get(``)


    }

    return (
    <div>
        <Button type="primary" htmlType="submit" className='btnsui' onClick={()=>handleClearCache()}>Clear All Cache</Button>
    </div>
    )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsCache)