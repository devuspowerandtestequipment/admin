const cartitemsReducer = (state=[], action) => {

        switch(action.type){
            case 'GET_ALL_CRAT_PRODUCTS':
                return action.payload
            default:
                return state;
        }
}

export default cartitemsReducer;