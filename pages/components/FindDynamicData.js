
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

export const FindDynamicData = (props) => {

  
  const findNonParent = (reduxstate,find,value,get) => {
    var data = _.find(props.dynamic_datas[reduxstate], function(o) { return o[find] === value });
    if(data===undefined){
      return(
        // <>not_found1 {value}</>
        false
      )
    }else{

      //check item is active or inactive
      if(data.status==='InActive'){
        return(
          <>inactive</>
        )
      }else{
        return(
          <>{data[get]}</>
        )
      }

      
    }
  }


  const findHaveParent = (find,value,get,parentAttributeId) => {
    var check = _.find(props.dynamic_datas.attributes, function(o) { return o._id === parentAttributeId });
    if(check===undefined){
      return(
        <>attribute_not_found</>
      )
      // return(
      //   false
      // )
    }else{
      if(check.type==='Text'){
        return(
          <>{props.value} </>
        )
      }else{
        var data=_.find(_.find(props.dynamic_datas.attributes, function(o) { return o._id === parentAttributeId }).attrbutes_list, function(o) { return o[find] === value });
      
        if(data===undefined){
          // return(
          //   <>not_found2</>
          // )
          return(
            false
          )
        }else{
          return(
            <>{data[get]} {data.type}</>
          )
        }
      }
      
    }
  }


  return (
    <>
    {props.dynamic_datas===null
    ?<>Loading...</>
    :
    <>
      {props.parentAttributeId===undefined
      ?
        <>
        {findNonParent(props.redux_state,props.find,props.value,props.get)}
        </>
      :
        <>

          {_.isArray(props.value)
          ?
          <ul className="comma-list">
            {props.value.map((lp,key)=>{
              if(findHaveParent(props.find,lp,props.get,props.parentAttributeId)){ //check if not bloank
                return(
                  <li>{findHaveParent(props.find,lp,props.get,props.parentAttributeId)}</li>
                )
              }
            })}
          </ul>
          :<>{findHaveParent(props.find,props.value,props.get,props.parentAttributeId)}</>
          }

      
        </>
      }
    
    </>  
    }
    </>
  )
}

const mapStateToProps = (state) => ({
    dynamic_datas:state.dynamic_datas
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(FindDynamicData)