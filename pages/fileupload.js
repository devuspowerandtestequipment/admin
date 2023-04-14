import React,{useState,useEffect} from 'react'
import { connect } from 'react-redux'
import Body from './components/Body'
import Dropzone from 'react-dropzone';
import { Layout, Breadcrumb, message, Button, Table, Popconfirm, PageHeader,Row,Statistic,Col, } from "antd";
import axios from 'axios'
import { Grid } from 'semantic-ui-react'
import { CopyOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import Moment from 'react-moment';
import Link from 'next/link';
import Head from 'next/head'
const { Content } = Layout;

export const Files = (props) => {


    const [imageLoading,setImageLoading]=useState(false);
    const [images,setImages]=useState(false);



    function getData(){
      axios.get(`${process.env.backendURL}/image`)
        .then(response=>{
          console.log(response.data.datas)
            setImages(response.data.datas)
        })
    }

    useEffect(() => {
      getData();
    }, [props]);


    function getExt(filepath){
     return filepath.split("?")[0].split("#")[0].split('.').pop();
    }

    //image drop uplaod
    const onDrop = (files) => {

      var totalfiles=[];
      
      if(files.length>10){
        message.warning(`You can't upload more than 10 files at a time`)
      }else{
        files.forEach(file => {

          // console.log(file.name)
          // console.log(getExt(file.name))

          // if(file.type==='image/jpg' || file.type==='image/jpeg' || file.type==='image/png' || file.type==='image/webp' || file.type==='application/pdf'){
            if (file.size >= 5242880){
              message.warning(`${file.path} size is more than 5mb.`)
            }else{
              totalfiles.push(file); 
            }
          
          
          // }else{
          //   message.warning(`${file.path} is not an image.`)
          // }
        });
      }

    
      if(totalfiles.length>0){
        
        setImageLoading(true)

        var count=0;
        totalfiles.forEach((file,key) => {

          var formData = new FormData();
          formData.append("image", file);
          formData.append("filename", file.name);
          axios.post(`${process.env.backendURL}/image`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response=>{
            getData();
            count=count+1
            if(count===totalfiles.length){
              setImageLoading(false)
            }
          })
  
        });
      }else{
        setImageLoading(false)
      }

    
    }


    function copyText(text){
      navigator.clipboard.writeText(text);
      message.success('Copied');
    }

    const handleDelete =(fileid,id)=> {
      axios.get(`${process.env.backendURL}/image/${fileid}/${id}`)
      .then((response) => {
        if (response.data.response) {
          getData();
          message.success("Success");
        }
      });
    }


    const columns = [
      {
        title: 'Image',
        key: 'action',
        render: (_, data) => (
          data.fileType==='image'
          ?<img src={`${data.url}?tr=w-50,h-50,q-40`} />
          :<><img src='http://www.clker.com/cliparts/l/A/f/s/d/B/folder-with-file-icon.svg' style={{height:'50px',width:'50px'}} /></>
        ),
      },
      // {
      //   title: 'Name',
      //   dataIndex: 'name',
      //   key: 'name',
      //   // render: (text) => <a>{text}</a>,
      // },
      {
        title: 'URL',
        dataIndex: 'url',
        key: 'url',
        render: (url) => <>{url}</>,
      },
      {
        title: 'Created',
        dataIndex: 'createdAt',
        key: "createdAt",
        width: "250px",
        render: (date) => <Moment format='llll'>{date}</Moment>,
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, data) => (
          <>
          <Button type='primary' icon={<CopyOutlined />} onClick={()=>copyText(data.url)}>Copy URL</Button> &nbsp; 
          <a href={data.url} target="_blank" rel="noopener noreferrer"><Button type='primary' icon={<EyeOutlined />}>View</Button></a> &nbsp; 
          <Popconfirm
              title="Are you sure to delete this file?"
              onConfirm={() => handleDelete(data.fileId,data._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger" icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          {/* <Button type='primary' danger icon={<DeleteOutlined />}></Button> */}
          </>
        ),
      },
    ];



    return (
      <Body>
        <Head><title>Files</title></Head>
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item><Link href='/'>Dashboard</Link></Breadcrumb.Item>
              <Breadcrumb.Item>Files</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader
              ghost={false}
              className="site-page-header-gray"
              title="Files"
              onBack={() => window.history.back()}
            >
            <Row>
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Total Files" value={images?images.length:0} />
                </Col>
                {/* <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Active Tax" value={_.filter(this.props.datas, function(o) { if (o.status === 'Active') return o }).length} />
                </Col>
                <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                <Statistic title="Inactive Tax" value={_.filter(this.props.datas, function(o) { if (o.status === 'InActive') return o }).length} />
                </Col> */}
            </Row>
          </PageHeader>
          <br />
            {/* <div className="site-layout-background" style={{ padding: 24 }}> */}

                  {imageLoading
                  ?
                  <center>
                    <img src='/images/throbber.gif' style={{height:'73px', margin:'60px'}} />
                  </center>
                  :
                  <Dropzone 
                    onDrop={onDrop}
                  >
                    {({getRootProps, getInputProps}) => (
                      <section className="dropzonecontainer">
                        <div {...getRootProps({className: 'dropzone'})}>
                          <input {...getInputProps()} />
                          
                          <p>
                          <center>
                            <img src='/images/Upload-Icon-Logo-Transparent-File.png' />
                          </center>
                          <br/>
                            Drag and drop images here, or click to select files
                            </p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                  }


              {/* </div> */}
              <br />
              {/* <div className="site-layout-background" style={{ padding: 24 }}> */}
                {images===false
                ?<>Loading...</>
                :<Table columns={columns} dataSource={images} pagination={{ pageSize: 10 }}
                scroll={{ x: 500 }} />
                }
                {/* <Grid>
                {images===false
                ?
                <>Loading...</>
                :
                images.map((image)=>{
                  return(
                    <Grid.Column mobile={16} tablet={4} computer={2} key={image._id}>
                      <img src={`${image.url}?tr=h-200,w-200,q-50`} style={{width:'100%'}} />
                      <span style={{float:'right', marginTop:'4px'}}>
                        <Button type='primary' shape="circle" size='small' icon={<EyeOutlined />}></Button> &nbsp; 
                        <Button type='primary' shape="circle" size='small' icon={<CopyOutlined />}></Button> &nbsp; 
                        <Button type='primary' danger shape="circle" size='small' icon={<DeleteOutlined />}></Button></span>
                       
                    </Grid.Column>
                  )
                })
                }
                </Grid> */}
              {/* </div> */}
          </Content>
      </Body>
    )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Files)