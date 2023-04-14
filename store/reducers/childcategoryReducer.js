import cookie from 'react-cookies'


const childcategoryReducer = (state=[], action) => {

    const ISSERVER = typeof window === "undefined";

        // if(!ISSERVER) {
        // // Access localStorage
        //     if(cookie.load('all_brands_999')===undefined) {  
        //     }else{
        //     state = cookie.load('all_brands_999');
        //     }
        // }
        

        switch(action.type){
            case 'GET_ALL_CHILDCATEGORIES':
                return action.payload
            default:
                return state;
        }
}

export default childcategoryReducer;