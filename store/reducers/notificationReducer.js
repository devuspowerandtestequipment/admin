import cookie from 'react-cookies'


const orderReducer = (state=[], action) => {
        
        switch(action.type){
            case 'GET_ALL_NOTIFICATION_DATA':
                return action.payload
            default:
                return state;
        }
}

export default orderReducer;