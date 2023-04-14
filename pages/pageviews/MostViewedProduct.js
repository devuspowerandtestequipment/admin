import axios from 'axios';
import React, { useEffect,useState } from 'react'
import { connect } from 'react-redux'
import { List } from 'semantic-ui-react'

export const MostViewedPage = (props) => {

    const [datas,setDatas]=useState(false);
 
  useEffect(()=>{
    axios.get(`${process.env.backendURL}/user/admin_mostviewed_page`)
    .then(response=>{
        setDatas(response.data.datas)
    })
  },[])

  return (
    <div className="site-layout-background" style={{ padding: 24 }}>
        {datas &&
            <List relaxed='very'>
                {datas.map((data,key)=>{

                    if(data._id.includes("/product/")){
                        return(
                            <List.Item key={key} style={{marginBottom:'-5px'}}>
                                <List.Content>
                                    <List.Description>
                                        <a href={`${process.env.frontendURL}${data._id}`} target="_blank" rel="noopener noreferrer">{process.env.frontendURL}{data._id}</a> <span style={{float:'right'}}>{data.count} times</span>
                                    </List.Description>
                                </List.Content>
                            </List.Item>
                        ) 
                    }
                })}
                
            </List>
        }
    
    </div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(MostViewedPage)