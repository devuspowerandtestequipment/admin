
const userLastVisitedProductsReducer = (state=[], action) => {


        switch(action.type){
            case 'GET_ALL_VISITED_PRODUCTS':
                return action.payload
            default:
                return state;
        }
}

export default userLastVisitedProductsReducer;