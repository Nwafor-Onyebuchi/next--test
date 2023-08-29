import {
    GET_LOGGEDIN_USER,
    GET_USER,
    SET_LOADING,
    SET_IS_ADMIN,
    SET_IS_SUPER,
    SET_USERTYPE,
    UNSET_LOADING,
    SET_SIDEBAR
} from '../types';


const reducer = (state: any, action: any) => {

    switch(action.type){

        case GET_LOGGEDIN_USER: 
            return {
                ...state,
                user: action.payload,
                loading: false
            }
        case GET_USER: 
            return {
                ...state,
                getuser: action.payload,
                loading: false
            }
        case SET_USERTYPE: 
            return {
                ...state,
                userType: action.payload
            }

        case SET_SIDEBAR: 
            return {
                ...state,
                sidebar: action.payload,
                loading: false
            }
        
        case SET_IS_SUPER: 
            return {
                ...state,
                isSuper: action.payload
            }
        case SET_IS_ADMIN: 
            return {
                ...state,
                isAdmin: action.payload
            }

        case SET_LOADING: 
            return {
                ...state,
                loading: true
            }

        case UNSET_LOADING: 
            return {
                ...state,
                loading: false
            }
            
        default: 
            return state;
    }

}

export default reducer;