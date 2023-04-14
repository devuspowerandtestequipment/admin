import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Body from "../components/Body";
import { Layout, Breadcrumb, PageHeader,Statistic,Row, Col,Button } from "antd";
import {
  Pagination,
  Icon,
  Table,
  Menu,
  Select,
  Form,
} from "semantic-ui-react";
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from "axios";
import cookie from 'react-cookies'

import { useRouter } from 'next/router'
import _, { forEach, isNull } from 'lodash'
import FindDynamicData from "../components/FindDynamicData";
const { Content } = Layout;


export const index = (props) => {
  const router = useRouter()
  const [parentdata, setParentData] = useState(null);
  const [childDatas, setChildDatas] = useState(null);
  const [childDatasFiltered, setChildDatasFiltered] = useState(null);

  const [childdatashow, setChildDataShow] = useState(null); //active single child data to show
  const [childFilterDropdown, setChilldFilterDropdown] = useState(null); //filter dropdown default
  const [childFilterDropdownSelected, setChilldFilterDropdownSelected] = useState(null);
  const [childDataAttributeFilter, setChildDataAttributeFilter] = useState(null); 


  useEffect(()=>{
   console.log(router.query.codeid)

   axios.get(`${process.env.backendURL}/product/view_productinfo/Configurable/${router.query.codeid}`)
   .then(response=>{
      
      var childFilterDropdown = {} //dropdown items
      Object.entries(response.data.parentdata.config_attribues).map((data,number)=>{
        if(number===0){
          childFilterDropdown[data[0]]=data[1]
        }else{
          // childFilterDropdown[data[0]]=[]
          childFilterDropdown[data[0]]=data[1]
        }
      })
      setChilldFilterDropdown(childFilterDropdown)


      var childFilterDropdownSelected = {} //set dropdown
      Object.entries(response.data.parentdata.config_attribues).map((data,number)=>{
        childFilterDropdownSelected[data[0]]=null
      })
      setChilldFilterDropdownSelected(childFilterDropdownSelected)



      setParentData(response.data.parentdata)
      setChildDatas(response.data.childdata)
      setChildDataShow(_.find(response.data.childdata,{order:0})) //order 0 child data will save
      // setChildDataAttributeFilter(_.find(response.data.childdata,{order:0}).config_attribues)


      console.log(cookie.load('ecom_dash9437'))
   })

  
  },[])


  const handleChangeDropdown = (key,name,value) => {

    var tmpObjectList=[]; // all dropdowndatas to array
    Object.entries(childFilterDropdownSelected).map((obj)=>{
      tmpObjectList.push(obj[0])
    })

    var datas=childFilterDropdownSelected;
    datas[name]=value;

  
    var array2=tmpObjectList.splice(key);
    array2.forEach(element => {
      datas[element]=null
    });

    setChilldFilterDropdownSelected({
      ...childFilterDropdownSelected,
      ...datas
    })

    //update next item data
    Object.entries(childFilterDropdownSelected).map((obj,numk)=>{
      if(numk+1===key+1){
        childFilterDropdown[obj[0]]=_.uniq(_.map(_.filter(childDatas,_.omitBy(childFilterDropdownSelected, _.isNil)), obj[0]))
      }
    })

    if(key===Object.keys(childFilterDropdownSelected).length){
      console.log(_.filter(childDatas,_.omitBy(childFilterDropdownSelected, _.isNil)))
    }

  }



  return (
    <Body>
      <Content style={{ margin: "0 16px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>Products</Breadcrumb.Item>
          <Breadcrumb.Item>View</Breadcrumb.Item>
        </Breadcrumb>
        
        {/* {props.dynamic_datas  
        && */}
        
        <div
        className="site-layout-background"
        style={{ padding: 24 }}
      >
        {parentdata===null
        ?<center>Loading...</center>
        :
        <>
          <h3>Name: {parentdata.name}</h3>
          <h3>SKU: {parentdata.sku}</h3>
          

          {/* //IMP DONT DELETE */}
          {/* <FindDynamicData redux_state='category' find='name' value='Men' get='url' /> */}

        
          <br />
          {Object.entries(childFilterDropdown).map((ddwn,num)=>{
              
                return(

                  <div >
                    <h5> 
                      <FindDynamicData redux_state={`attributes`} find='_id' value={ddwn[0]} get='name' />
                    </h5>
                      {childFilterDropdown[ddwn[0]].map((cd,key)=>{
                      return(
                        <span key={key}>
                        &nbsp;
                        <Button size='small' type={childFilterDropdownSelected[ddwn[0]]===cd?`primary`:``} onClick={()=>handleChangeDropdown(num+1,ddwn[0],cd)}>
                          
                          <FindDynamicData redux_state={`attributes`} parentAttributeId={ddwn[0]} find='_id' value={cd} get='name' />
                        </Button>
                        </span>
                      )
                    })}
                    <br />
                    <br />

                  </div>

                )
            })}




<br /><br /><br />
          {childDatas && 
            _.filter(childDatas,_.omitBy(childFilterDropdownSelected, _.isNil)).map((cd)=>{
              return(
                <p>{cd.name}</p>
              )
            })
          }


        </>
        }
      </div>
        
        {/* }*/}

        
      </Content>
    </Body>
  );
};

const mapStateToProps = (state) => ({
  dynamic_datas:state.dynamic_datas
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(index);
