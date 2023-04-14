import axios from 'axios'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {osName,osVersion,browserName,browserVersion,deviceType,mobileVendor,mobileModel,fullBrowserVersion,isMobile,isDesktop,isTablet} from 'react-device-detect';
import { useRouter } from 'next/router';
import { message } from 'antd';
import {setAuthUser} from '../../store/actions'
import ls from 'localstorage-slim';
import * as ACTION  from '../../store/types'


export const HeaderAdminSettingsCheck = (props) => {

    const router = useRouter();

    useEffect(()=>{


        axios.get(`${process.env.backendURL}/settingsadmin/anduser/${ls.get(ACTION.AUTH_USER_INFORMATION)._id}`)
        .then(response=>{
            console.log('admin_settings',response.data.data);
            var data=response.data.data;

            // console.log(data);

            if(data.all_admin_instant_logout){
                props.setAuthUser(null);
                ls.clear();
                router.push('/login');
            }

            if(response.data.userinfo.instant_logout_from_all_device){
                props.setAuthUser(null);
                ls.clear();
                router.push('/login');
            }

            if(response.data.userinfo.status===false){
                props.setAuthUser(null);
                ls.clear();
                router.push('/login');
                message.warning('User access blocked.')
            }

            if(data.allow_access_desktop===false){
                if(isDesktop){
                    props.setAuthUser(null);
                    ls.clear();
                    router.push('/login');
                    message.warning('Desktop access blocked.')
                }
            }
            if(data.allow_access_tablet===false){
                if(isTablet){
                    props.setAuthUser(null);
                    ls.clear();
                    router.push('/login');
                    message.warning('Tablet access blocked.')
                }
            }
            if(data.allow_access_mobile===false){
                if(isMobile){
                    props.setAuthUser(null);
                    ls.clear();
                    router.push('/login');
                    message.warning('Mobile access blocked.')
                }
            }
        })

    },[]);


  return (
    props.children
  )
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, {setAuthUser})(HeaderAdminSettingsCheck)