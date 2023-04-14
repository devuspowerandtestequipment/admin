import cookie from 'react-cookies'


const brandReducer = (state=[], action) => {

    const ISSERVER = typeof window === "undefined";

        if(!ISSERVER) {
        // Access localStorage
            if(cookie.load('all_categories_999')===undefined) {  
            }else{
            state = cookie.load('all_categories_999');
            }
        }
        

        switch(action.type){
            case 'GET_ALL_BRANDS':
                return action.payload
            default:
                return state;
        }
}

export default brandReducer;