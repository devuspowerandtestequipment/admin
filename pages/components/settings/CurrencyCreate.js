import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Form } from 'semantic-ui-react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import {fetchAllCurrency} from '../../../store/actions'

export const CurrencyCreate = (props) => {

    const [submitButtonLoading,setSubmitButtonLoading]=useState(false);
    const [data,setData]=useState({
        name:'',
        value:'',
        code:'',
        symbol:'',
    })

    const handleChange = e => {
        setData({
            ...data,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit = e => {
        setSubmitButtonLoading(true);
        axios.post(`${process.env.backendURL}/currency`,data)
        .then(response=>{
            props.fetchAllCurrency();
            message.success('Success');
            setSubmitButtonLoading(false);
            setData({
                name:'',
                value:'',
                code:'',
                symbol:'',
            })
        })
    }

    return (
    <>
    <Form onSubmit={handleSubmit}>
        <Form.Group>
            {/* <Form.Input placeholder='Symbol' value={'₹'} name='name' readonly/> */}
            <Form.Input placeholder='Name' value={data.name} name='name' onChange={handleChange} required />
            <Form.Input placeholder='Value' value={data.value} name='value' onChange={handleChange} required />
            <Form.Input placeholder='Code' value={data.code} name='code' onChange={handleChange} required />
            <Form.Input placeholder='Symbol' value={data.symbol} name='symbol' onChange={handleChange} required />
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={submitButtonLoading} disabled={submitButtonLoading} className='btnsui'>Submit</Button>
            {/* &nbsp;
            <Button type="primary" danger htmlType="submit" icon={<DeleteOutlined />} loading={submitButtonLoading} className='btnsui'>Delete</Button> */}

        </Form.Group>
    </Form>
    </>
    )
}

const mapStateToProps = (state) => ({})


export default connect(mapStateToProps, {fetchAllCurrency})(CurrencyCreate)