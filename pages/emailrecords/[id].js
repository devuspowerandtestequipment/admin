import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Body from '../components/Body';
import Head from 'next/head'
import Link from 'next/link';
import {Layout,Breadcrumb,PageHeader, Popconfirm, message} from 'antd'
import axios from 'axios';
import moment from 'moment';
import {Button} from 'antd'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import {fetchEmailRecords} from '../../store/actions'
const { Content, Footer, Sider } = Layout;


export const View = (props) => {
    
    const router=useRouter();
    const [data,setData]=useState(false);

    useEffect(()=>{
        console.log(router.query.id)
        axios.get(`${process.env.backendURL}/user/admin_view_emailrecord/${router.query.id}`)
        .then(response=>{
            if(response.data.response){
                setData(response.data.data)
            }else{
                router.push('/emailrecords');
            }
        })
    },[])

    const handleDelete = id => {
        axios.get(`${process.env.backendURL}/user/admin_delete_emailrecord/${id}`)
        .then(response=>{
            if(response.data.response){
                props.fetchEmailRecords();
                router.push('/emailrecords');
                message.success('Success');
            }else{
                message.warning('Failed');
            }
        })
    }

    console.log('data',data)

    return (
        <Body>
            <Head>View Email Record</Head>
            <Content style={{ margin: "0 16px" }}>
                <Breadcrumb style={{ margin: "16px 0" }}>
                    <Breadcrumb.Item><Link href='/'>Dashboard</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link href='/emailrecords'>Email Records</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>View</Breadcrumb.Item>
                </Breadcrumb>
                <PageHeader
                    ghost={false}
                    onBack={() => router.push('/emailrecords')}
                    className="site-page-header-gray"
                    title="View Email Record"
                    extra={[
                    <>
                    {data &&
                        data.user_id && <Link href={`/users/${data.user_id._id}`}><Button type='primary' icon={<EyeOutlined />}>View User</Button></Link>
                    }
                    </>,
                    <Popconfirm
                        placement="topRight"
                        title="Are you sure?"
                        // description="Are you sure to delete this task?"
                        onConfirm={()=>handleDelete(data._id)}
                        // onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type='primary' danger icon={<DeleteOutlined />}>Delete</Button>
                    </Popconfirm>]}
                >
                </PageHeader>
                <br />
                {!data
                ?
                <>loading...</>
                :
                <div className="site-layout-background" style={{ padding: 24 }}>
                    <div className='emailbox'>
                        <h2 className='emailbox_h2'>{data.email_subject}</h2>
                        
                        {!data.user_id
                        ?
                        <>
                        <br />
                        <p className='emailbox_p22'><b>bis@qtonix.com</b> | {moment(data.createdAt).format('llll')} ({moment(data.createdAt).fromNow()})</p>
                        </>
                        :
                        <>
                        {/* <img src={data.user_id.image.url} /> */}
                        <p className='emailbox_p11'>{data.user_id.name}</p>
                        <p className='emailbox_p22'>bis@qtonix.com | {moment(data.createdAt).format('llll')} ({moment(data.createdAt).fromNow()})</p>
                        </>}

                        
                            
                    
                        {/* <img src='https://lh3.googleusercontent.com/a/AEdFTp4DubCfhYBOrmLjJgX3h66qV5GnGA06k9GPr3kT=s40-p-mo' />
                        <p className='emailbox_p1'>Biswanath Prasad Singh (bis@qtonix.com)</p>
                        <p className='emailbox_p2'>{moment(data.createdAt).format('llll')} ({moment(data.createdAt).fromNow()})</p>
                         */}
                    </div>

                    <br/>
                    <div dangerouslySetInnerHTML={{__html: data.email_body}} style={{width:'100%',pointerEvents:'none'}} />
                </div>
                }
            </Content>

            
        </Body>
    )
}

const mapStateToProps = (state) => ({})


export default connect(mapStateToProps, {fetchEmailRecords})(View)