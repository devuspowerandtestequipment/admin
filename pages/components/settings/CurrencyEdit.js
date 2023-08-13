import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Form } from 'semantic-ui-react'
import { Button, Popconfirm, message } from 'antd'
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons'
import axios from 'axios'
import {fetchAllCurrency} from '../../../store/actions'

export const CurrencyEdit = (props) => {

    const [submitButtonLoading,setSubmitButtonLoading]=useState(false);
    const [deleteButtonLoading,setDeleteButtonLoading]=useState(false);

    const [data,setData]=useState({
        _id:'',
        name:'',
        value:'',
        code:'',
        symbol:'',
    })

    useEffect(()=>{
        setData(props.currencydata)
    },[props])

    const handleChange = e => {
        setData({
            ...data,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit = e => {
        setSubmitButtonLoading(true);
        axios.post(`${process.env.backendURL}/currency/update`,data)
        .then(response=>{
            props.fetchAllCurrency();
            message.success('Success');
            setSubmitButtonLoading(false);
            // setData({
            //     name:'',
            //     value:'',
            //     code:'',
            //     symbol:'',
            // })
        })
    }

    const handleDelete = id => {
        setDeleteButtonLoading(true);
        axios.get(`${process.env.backendURL}/currency/deletefile/${id}`)
        .then(response=>{
            props.fetchAllCurrency();
            message.success('Success');
            setDeleteButtonLoading(false);
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
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitButtonLoading} disabled={submitButtonLoading} className='btnsui'>Update</Button>
            &nbsp;
            <Popconfirm
                title="Are you sure to delete this currency?"
                onConfirm={()=>handleDelete(data._id)}
                okText="Yes"
                cancelText="No"
            >
                <Button type="primary" danger htmlType="button" icon={<DeleteOutlined />} loading={deleteButtonLoading} disabled={deleteButtonLoading}  className='btnsui'>Delete</Button>
            </Popconfirm>

        </Form.Group>
    </Form>
    </>
    )
}

const mapStateToProps = (state) => ({})


export default connect(mapStateToProps, {fetchAllCurrency})(CurrencyEdit)