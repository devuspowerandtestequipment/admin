
const paymentHistoryReducer = (state=[], action) => {
        switch(action.type){
            case 'GET_ALL_PAYMENT_HISTORY':
                return action.payload
            default:
                return state;
        }
}

export default paymentHistoryReducer;