import cookie from 'react-cookies'

const dynamicDatasReducer = (state=null, action) => {

    const ISSERVER = typeof window === "undefined";

        // if(!ISSERVER) {
        // // Access localStorage
        //     if(cookie.load('all_brands_999')===undefined) {  
        //     }else{
        //     state = cookie.load('all_brands_999');
        //     }
        // }
        
        switch(action.type){
            case 'DYNAMIC_DATAS':
                return action.payload
            default:
                return state;
        }
}

export default dynamicDatasReducer;