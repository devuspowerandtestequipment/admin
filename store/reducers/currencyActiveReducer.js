import ls from 'localstorage-slim';
import * as ACTION  from '../types'

const currencyActiveReducer = (state={_id:'1',code:'inr',name:'(₹) Indian rupee',symbol:'₹', value:'1'}, action) => {

        if(ls.get(ACTION.USER_CURRENCY)!==null){
            state = ls.get(ACTION.USER_CURRENCY);
        }

        switch(action.type){
            case 'SET_ACTIVE_CURRENCY_NAME':
                return action.payload
            default:
                return state;
        }
}

export default currencyActiveReducer;