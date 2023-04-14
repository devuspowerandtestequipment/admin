import cookie from 'react-cookies'

const courierReducer = (state=[], action) => {
        
        switch(action.type){
            case 'GET_ALL_COURIER':
                return action.payload
            default:
                return state;
        }
}

export default courierReducer;