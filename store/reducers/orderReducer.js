import cookie from 'react-cookies'


const orderReducer = (state=[], action) => {

        // if(!ISSERVER) {
        // // Access localStorage
        //     if(cookie.load('all_brands_999')===undefined) {  
        //     }else{
        //     state = cookie.load('all_brands_999');
        //     }
        // }
        

        switch(action.type){
            case 'GET_ALL_ORDERS':
                return action.payload
            default:
                return state;
        }
}

export default orderReducer;