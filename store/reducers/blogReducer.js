
const blogReducer = (state=[], action) => {

    // const ISSERVER = typeof window === "undefined";

    //     if(!ISSERVER) {
    //     // Access localStorage
    //         if(cookie.load('all_categories_999')===undefined) {  
    //         }else{
    //         state = cookie.load('all_categories_999');
    //         }
    //     }
        

        switch(action.type){
            case 'GET_ALL_BLOGS':
                return action.payload
            default:
                return state;
        }
}

export default blogReducer;