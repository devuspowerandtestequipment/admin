import cookie from 'react-cookies'
import ls from 'localstorage-slim';
import * as ACTION  from '../types'

const authReducer = (state=null, action) => {

        // if(cookie.load('ecomadmin_authuser7569')!==undefined){
        //     state = cookie.load('ecomadmin_authuser7569');
        // }
        
        if(ls.get(ACTION.AUTH_USER_INFORMATION)!==null){
            state = ls.get(ACTION.AUTH_USER_INFORMATION);
        }

        switch(action.type){
            case 'SET_USER_INFORMATION':
                return action.payload
            default:
                return state;
        }
}

export default authReducer;