import ls from 'localstorage-slim';
import * as ACTION  from '../types'

const currencyReducer = (state=[], action) => {

    switch(action.type){
        case 'SET_CURRENCY_LIST':
            return action.payload
        default:
            return state;
    }
}

export default currencyReducer;