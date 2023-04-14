import React from 'react'
import { connect } from 'react-redux'
import cookie from 'react-cookies'
import { useEffect } from 'react'
// import ls from 'localstorage-slim';
// import * as ACTION  from '../store/types'


export const ClearCache = (props) => {

    useEffect(()=>{

        
        // cookie.remove('ecom_lastpage', { path: '/' });
        // cookie.remove('ecom_search_sortby9437', { path: '/' });
        // cookie.remove('ecom_sortShowDatasPerPage9437', { path: '/' });
        // cookie.remove('ecom_uniq_system_id9437', { path: '/' });


        


      // ls.clear()
    })


    const showCache=()=>{
        // console.log(ls.get(ACTION.AUTH_USER_INFORMATION));
        // console.log(ls.get(ACTION.UNIQ_SYSTEM_ID));

        console.log(cookie.loadAll());
    }


    const clearCache=()=>{
        cookie.remove('ecom_authuserid9437', { path: '/' });
        cookie.remove('PRODUCT_FILTER_DATASPERPAGE_REDUCER', { path: '/' });
        cookie.remove('ecom_uniq_system_id9437', { path: '/' });
        cookie.remove('fblo_428564362611406', { path: '/' });
        cookie.remove('_ga', { path: '/' });
        cookie.remove('_ga_NVGJ66VF97', { path: '/' });


      
  }

  return (
    <div>
      <button onClick={showCache}>Show Cache</button>
      <button onClick={clearCache}>Clear Cache</button>

    </div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ClearCache)