import cookie from 'react-cookies'


const contactReducer = (state=[], action) => {

   
        switch(action.type){
            case 'GET_ALL_CONTACTS':
                return action.payload
            default:
                return state;
        }
}

export default contactReducer;