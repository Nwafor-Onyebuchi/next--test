import {
    GET_BANKS,
    GET_LOCATIONS,
    GET_COUNTRIES,
    GET_COUNTRY,
    GET_IP_ADDRESS,
    SET_LOADING
} from  '../types'

// eslint-disable-next-line import/no-anonymous-default-export
export default (state: any, action: any) => {

    switch(action.type){

        case GET_BANKS: 
            return {
                ...state,
                banks: action.payload,
                loading: false
            }
        case GET_LOCATIONS: 
            return {
                ...state,
                locations: action.payload,
                loading: false
            }
        case GET_COUNTRIES:
                return {
                    ...state,
                    countries: action.payload,
                    loading: false
                }
        case GET_COUNTRY:
                return{
                    ...state,
                    country: action.payload,
                    loading: false
                }
            case GET_IP_ADDRESS:
                return{
                    ...state,
                    ipData: action.payload,
                    loading: false
                }
        case SET_LOADING: 
            return {
                ...state,
                loading: true
            }
        default: 
            return state;
    }

}