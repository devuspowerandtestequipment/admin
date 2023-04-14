import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ReactSortable } from "react-sortablejs";
import { Grid } from 'semantic-ui-react';

export class ImageSorting extends Component {
    
  render() {
    return (
      <>
        <ReactSortable list={this.props.images} 
                  setList={collection => {
                    // this.setState(prevState => ({
                    //     ...prevState.data,
                    //     data:{
                    //       images: collection
                    //     }
                    // }))
                    this.props.updateSortingImage(collection)
                  }}
                  animation={200}
                  delayOnTouchStart={true}
                  delay={2}
                >
                  {this.props.images.map((img)=>{
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
                                <p style={{lineHeight:'3px',marginTop:'25px'}}><b>Original:</b> <a href={img.url} target={'_blank'}>{img.url}</a> </p>
                                <p style={{lineHeight:'3px'}}><b>Large:</b> <a href={`${img.url}?tr=w-800,h-800`} target={'_blank'}>{img.url}?tr=w-800,h-800</a> </p>
                                <p style={{lineHeight:'3px'}}><b>Medium:</b> <a href={`${img.url}?tr=w-400,h-400`} target={'_blank'}>{img.url}?tr=w-400,h-400</a> </p>
                                <p style={{lineHeight:'3px'}}><b>Small:</b> <a href={`${img.url}?tr=w-100,h-100`} target={'_blank'}>{img.url}?tr=w-100,h-100</a> </p>
                            
                            </Grid.Column>
                            <Grid.Column computer={1} >
                                <br />
                                <br />

                                <Button type="primary"
                                    danger icon={<DeleteOutlined />}
                                    // onClick={()=>this.handleConfigDeleteProduct(img)}
                                 />
                            </Grid.Column>
                        </Grid>
                    )
                  })}

        </ReactSortable> 
      
      </>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ImageSorting)