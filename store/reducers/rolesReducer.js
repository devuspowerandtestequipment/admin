const rolesReducer = (state=null, action) => {

        switch(action.type){
            case 'GET_ALL_ROLES':
                return action.payload
            default:
                return state;
        }
}

export default rolesReducer;