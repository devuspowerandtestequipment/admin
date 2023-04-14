
const emailReducer = (state=[], action) => {
        switch(action.type){
            case 'GET_ALL_EMAIL_RECORDS_DATA':
                return action.payload
            default:
                return state;
        }
}
export default emailReducer;