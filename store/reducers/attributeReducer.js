import cookie from 'react-cookies'


const attributeReducer = (state=[], action) => {

    const ISSERVER = typeof window === "undefined";

        // if(!ISSERVER) {
        // // Access localStorage
        //     if(cookie.load('all_categories_999')===undefined) {  
        //     }else{
        //     state = cookie.load('all_categories_999');
        //     }
        // }
        

        switch(action.type){
            case 'GET_ALL_ATTRIBUTES':
                return action.payload
            default:
                return state;
        }
}

export default attributeReducer;