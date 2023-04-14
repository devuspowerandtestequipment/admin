import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ReactSortable } from "react-sortablejs";
import { Grid } from 'semantic-ui-react';

export class VideoSorting extends Component {


componentDidUpdate(props){
     console.log(props)
 }

 componentDidCatch(props){
    console.log(props)

 }

 
  render() {
      console.log(this.props.videos)
    return (
      <>
      asassa
        <ReactSortable list={this.props.videos} 
                  setList={collection => {
                    // this.setState(prevState => ({
                    //     ...prevState.data,
                    //     data:{
                    //       images: collection
                    //     }
                    // }))
                    this.props.updateSortingVideos(collection)
                  }}
                  animation={200}
                  delayOnTouchStart={true}
                  delay={2}
                >
                  {this.props.videos.map((video,key)=>{
                    return(
                        <Grid key={key}>
                            <Grid.Column computer={1}>
                                            <br />
                                            <br />
                                            <label><img src="https://img.icons8.com/color/30/000000/resize-four-directions.png" style={{cursor:'move'}}/> </label>
                            </Grid.Column>
                            <Grid.Column computer={14}>
                                <iframe
                                width={'100%'}
                                height={100}
                                src={video}
                                title="YouTube video "
                                frameBorder={0}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen={true}
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

export default connect(mapStateToProps, mapDispatchToProps)(VideoSorting)