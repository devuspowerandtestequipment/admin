import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Body from "../components/Body";
import {
  Checkbox,
  Form,
  FormGroup,
  Input,
  Radio,
  Select,
  TextArea,
} from "semantic-ui-react";
import { Layout, Breadcrumb,Button, message, Popconfirm,PageHeader } from "antd";
import SimpleReactValidator from 'simple-react-validator';
import CKEditor from 'ckeditor4-react-advanced';
import Dropzone from 'react-dropzone';
import {fetchBlogs} from '../../store/actions'
import axios from "axios";
import  { useRouter } from "next/router";
import { useState } from 'react';
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import Head from "next/head";

const { Content } = Layout;

export const Edit = (props) => {
 
    const router = useRouter();
    const [data,setData]=useState(false);
    const [imageLoading,setImageLoading]=useState(false);
    const [formLoading,setFormLoading]=useState(true);



    useEffect(()=>{
        console.log(router.query.id)
        axios.get(`${process.env.backendURL}/blog/${router.query.id}`)
        .then(response=>{
            if(response.data.response){
                setData(response.data.data);
                setFormLoading(false);
            }else{
                router.push('/blogs')
            }
        })
    },[])


    function convertToSlug( str ) {
      
    
      //replace all special characters | symbols with a space
      str = str.replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ')
               .toLowerCase();
        
      // trim spaces at start and end of string
      str = str.replace(/^\s+|\s+$/gm,'');
        
      // replace space with dash/hyphen
      str = str.replace(/\s+/g, '-');   
      // document.getElementById("slug-text").innerHTML = str;

      // setData({...data,'url':str});

      return str;
      //return str;
    }    





    const onDrop = (files) => {


    var file=files[0];

    if(file.type==='image/jpg' || file.type==='image/jpeg' || file.type==='image/png' || file.type==='image/webp' || file.type==='application/pdf'){
      if (file.size >= 5242880){
        message.warning(`${file.path} size is more than 5mb.`)
      }else{
        
        setImageLoading(true)
      var formData = new FormData();
      formData.append("image", file);
      formData.append("filename", file.name);
      formData.append("server_path", 'blog_images');

      axios.post(`${process.env.backendURL}/image/uploadwithoutsave`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response=>{
        console.log(response.data.data)
        setData({
          ...data,'image':{fileId:response.data.data.fileId,filePath:response.data.data.filePath,url:response.data.data.url
          }
        })
        setImageLoading(false)
      })



      }
    }else{
      message.warning(`${file.path} is not an image.`)
    }



    
    }

    const handleChange=(e)=>{

        if(e.target.name==='title'){
          // convertToSlug(e.target.value);

          setData({
            ...data,
            [e.target.name]:e.target.value,
            url:convertToSlug(e.target.value)
          })

        }else{
          setData({
            ...data,[e.target.name]:e.target.value
        })
        }

        
    }
    const calculateReadingTime = (textdata) => {
        const text = textdata;
        const wpm = 225;
        const words = text.trim().split(/\s+/).length;
        const time = Math.ceil(words / wpm);
        return time;
        // this.setState({
        //     contentreadtime:time
        // })
        // console.log(time)
        // document.getElementById("time").innerText = time;
     }
  
      const onEditorChange=( evt )=>{
        setData({
          ...data,'content':evt.editor.getData(),readtime:calculateReadingTime(evt.editor.getData())
        })
      }


    const deleteBlogImage=id=>{
      setImageLoading(true)
      axios.get(`${process.env.backendURL}/image/deletenow/deleteFile/${id}`)
      .then(response=>{
        setData({
          ...data,'image':false
        })
        setImageLoading(false)
      })
    }
    

    const handleSubmit=()=>{
      setFormLoading(true);

      axios.post(`${process.env.backendURL}/blog/update`,data)
      .then(response=>{
        if(response.data.response){
          message.success('Success')
          props.fetchBlogs();
          router.push('/blogs');
        }
        setFormLoading(false);
      })
      console.log(data)
    }

  return (
    <Body>
        <Head><title>Edit Blog</title></Head>

        <Content style={{ margin: "0 16px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>Blogs</Breadcrumb.Item>
            <Breadcrumb.Item>Edit</Breadcrumb.Item>
        </Breadcrumb>
        <PageHeader
            ghost={false}
            className="site-page-header-gray"
            title="Edit Blog"
            onBack={() => router.push('/blogs')}
          ></PageHeader>
          <br />
        {data &&
        <Form onSubmit={handleSubmit} loading={formLoading}>
        <div className="site-layout-background" style={{ padding: 24 }}>
          <h3 className="text-primary">Blog Information</h3>
              <div>
                {/* <h3 className='text-primary'>Basic Information</h3> */}
                    <Form.Input fluid label="Title" placeholder="Title" name="title" value={data.title} onChange={handleChange} required />
                    <Form.Field className='required '>
                        <span style={{fontSize:'14px'}}>https://www.reactnodeecommerce.cloud/blogs/{data.url}</span>
                    </Form.Field>
                    

                    <Form.Field className='required '>
                        <label>Image</label>
                        <input type='text' id="uploadFile" value={data.image?'-':''}  required className='hidden7678981' />
                        <div id="uploadFile">
                          {imageLoading
                          ?
                          <center style={{width:'350px'}}>
                            <img src='/images/throbber.gif' style={{height:'73px', margin:'60px'}} />
                          </center>
                          :
                          data.image
                            ?
                            <>
                            <div><img src={`${data.image.url}?tr=w-300,q-70`} /></div>
                            <div>
                            <Popconfirm
                              title="Are you sure?"
                              placement="topLeft"
                              // description="Are you sure to delete this task?"
                              onConfirm={()=>deleteBlogImage(data.image.fileId)}
                              // onCancel={cancel}
                              okText="Yes"
                              cancelText="No"
                            >
                              <p className='deleteimage'> <DeleteOutlined /> Delete Image</p>
                            </Popconfirm>
                            </div>
                            
                            
                            </>
                            :
                            <Dropzone 
                              onDrop={onDrop}
                              multiple={false}
                            >
                              {({getRootProps, getInputProps}) => (
                                <section className="dropzonecontainer" style={{width:'350px'}}>
                                  <div {...getRootProps({className: 'dropzone'})}>
                                    <input {...getInputProps()} />
                                    
                                    <p>
                                    <center>
                                      <img src='/images/Upload-Icon-Logo-Transparent-File.png' />
                                    </center>
                                    <br/>
                                      Drag and drop image here, or click to select file
                                      </p>
                                  </div>
                                </section>
                              )}
                            </Dropzone>
                          

                          
                          }
                        </div>
                        
                    </Form.Field>
                    <Form.Field className='required '>
                    <label>Content ({data.readtime} min read)</label>
                    <input type='text' id="uploadContent" value={data.content?'-':''}  required className='hidden7678981' />
                    <div id="uploadContent">
                    <CKEditor
                        config={{
                        width: '100%',
                        height: '150px',
                        }}
                        onChange={onEditorChange}
                        data={data.content}
                    /> 
                    </div>         
                    </Form.Field>
                    

                </div>
            
        </div>
        <br />
        <div className="site-layout-background" style={{ padding: 24 }}>
                <h3 className="text-primary">SEO Information</h3>
                <Form.Input
                  fluid
                  label="Meta Title"
                  placeholder="Meta Title"
                  name='meta_title' value={data.meta_title} onChange={handleChange} required
                />
                <Form.Field
                  fluid
                  label="Meta Descripion"
                  control="textarea"
                  rows="3"
                  name='meta_description' value={data.meta_description} onChange={handleChange} required
                />
                <Form.Input
                  fluid
                  label="Meta Keyword"
                  placeholder="Meta Keyword"
                  name='meta_keyword' value={data.meta_keyword} onChange={handleChange} required
                />

                <br />
                <div className="googlesearchres">
                  <h6>https://www.reactnodeecommerce.cloud/blogs/{data.url}</h6>
                  <h3>{data.meta_title?data.meta_title:'Meta Title'}</h3>
                  <p>{data.meta_description?data.meta_description:'Meta Description'}</p>
                  <h5>{data.meta_keyword?data.meta_keyword:'Meta Keywords'}</h5>
                </div>
                <br/>

                <Form.Field>
                      <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                        Submit
                      </Button>
                    </Form.Field>
          </div>
          </Form>
        
        }
        </Content>
    </Body>
  )
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {fetchBlogs})(Edit)