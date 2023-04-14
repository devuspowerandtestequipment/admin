import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Drawer, Button, Popconfirm } from 'antd';
import {
    Grid,
  } from "semantic-ui-react";
  import { ReactSortable } from "react-sortablejs";
import { ApiFilled, DeleteOutlined } from '@ant-design/icons';


export const DrawerConfigProductImageView = (props) => {
    const [visible, setVisible] = useState(false);
    const [images,setImages]= useState(null)

    useEffect(()=>{
        setImages(props.data.images)
    },[props])


    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };


  return (
    <>
    <img src="https://img.icons8.com/pastel-glyph/14/1890ff/edit--v1.png" onClick={showDrawer} style={{cursor:'pointer'}}  />
    <Drawer title={props.data.name} placement="right" onClose={onClose} visible={visible} width={`50%`}>
        {images===null
        ?<></>
        :
        <ReactSortable list={images} 
                  setList={collection => {
                    setImages(collection)
                    props.childDataImageSort(collection,props.data._id)
                  }}
                  animation={200}
                  delayOnTouchStart={true}
                  delay={2}
                >
                        {images.map((img)=>{
                          return(
                              <Grid key={img.fileId}   style={{cursor:'move'}}>
                                  <Grid.Column computer={1}>
                                      <br />
                                      <br />
                                      <label><img src="https://img.icons8.com/color/30/000000/resize-four-directions.png" style={{cursor:'move'}}/> </label>
                                  </Grid.Column>
                                  <Grid.Column computer={2} >
                                      <img src={`${img.url}?tr=w-100,h-100,q-10`}  />
                                  </Grid.Column>
                                  <Grid.Column computer={12} >
                                      <p style={{marginTop:'35px'}}><a href={img.url} target={'_blank'}>{img.url}</a> </p>
                                  </Grid.Column>
                                  <Grid.Column computer={1} >
                                      <br />
                                      <br />

                                      

                                        <Popconfirm
                                            title={`Are you sure to delete this image?`}
                                            onConfirm={()=>props.handleDeleteChildDataImages(img.fileId,props.data._id)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button type="primary"
                                                danger icon={<DeleteOutlined />}
                                                disabled={props.disabledImageDeleteOption?true:false}
                                            />
                                        </Popconfirm>
                                  </Grid.Column>
                              </Grid>
                          )
                        })}
        </ReactSortable>
        }
        
    </Drawer>
    </>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerConfigProductImageView)