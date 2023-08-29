import {
    GET_BLOG_BRACKETS,
    GET_BLOG_BRACKET,
    GET_POSTS,
    GET_LATEST_POSTS,
    GET_FILTERED_POSTS,
    GET_POST,
    GET_POST_COMMNENTS,
    GET_POST_COMMNENT,
    GET_BLOG_CATEGORIES,
    GET_BLOG_CATEGORY,
    GET_BLOG_TAGS,
    GET_FORMATTED_TAGS,
    GET_BLOG_TAG,
    SET_LOADING,
    UNSET_LOADING,
    SET_PAGINATION,
    SET_TOTAL,
    SET_COUNT,
    GET_BLOG_SUBSCRIBERS,
    GET_BLOG_SUBSCRIBER,
    GET_POST_TYPE,
    GET_CAT_TYPE,
    GET_TAG_TYPE,
    GET_BLOG_OVERVIEW,
    GET_BLOG_GRAPH,
    SET_RESPONSE,
    GET_BLOG_CAMPAIGNS,
    GET_BLOG_CAMPAIGN,
    GET_BLOG_SECTIONS
} from '../types';

const reducer = (state: any, action: any) => {

    switch(action.type){

        case GET_BLOG_OVERVIEW: 
            return {
                ...state,
                overview: action.payload,
                loading: false
            }

        case GET_BLOG_GRAPH: 
            return {
                ...state,
                graph: action.payload,
                loading: false
            }

        case GET_BLOG_SUBSCRIBERS: 
            return {
                ...state,
                subscribers: action.payload,
                loading: false
            }

        case GET_BLOG_SUBSCRIBER: 
            return {
                ...state,
                subscriber: action.payload,
                loading: false
            }

        case GET_BLOG_CAMPAIGNS: 
            return {
                ...state,
                campaigns: action.payload,
                loading: false
            }
        case GET_BLOG_SECTIONS: 
            return {
                ...state,
                sections: action.payload,
                loading: false
            }
        case GET_BLOG_CAMPAIGN: 
            return {
                ...state,
                campaign: action.payload,
                loading: false
            }

        case GET_BLOG_BRACKETS: 
            return {
                ...state,
                brackets: action.payload,
                loading: false
            }
        case GET_BLOG_BRACKET: 
            return {
                ...state,
                bracket: action.payload,
                loading: false
            }
        case GET_POSTS: 
            return {
                ...state,
                posts: action.payload,
                loading: false
            }

        case GET_LATEST_POSTS: 
            return {
                ...state,
                latest: action.payload,
                loading: false
            }

        case GET_POST: 
            return {
                ...state,
                post: action.payload,
                loading: false
            }

        case GET_FILTERED_POSTS: 
            return {
                ...state,
                filtered: action.payload,
                loading: false
            }

        case GET_POST_COMMNENTS: 
            return {
                ...state,
                comments: action.payload,
                loading: false
            }

        case GET_POST_COMMNENT: 
            return {
                ...state,
                comment: action.payload,
                loading: false
            }

        case GET_BLOG_CATEGORIES: 
            return {
                ...state,
                categories: action.payload,
                loading: false
            }

        case GET_BLOG_CATEGORY: 
            return {
                ...state,
                category: action.payload,
                loading: false
            }

        case GET_BLOG_TAGS: 
            return {
                ...state,
                tags: action.payload,
                loading: false
            }

        case GET_BLOG_TAG: 
            return {
                ...state,
                tag: action.payload,
                loading: false
            }

        case GET_FORMATTED_TAGS: 
            return {
                ...state,
                formatted: action.payload,
                loading: false
            }
        case GET_POST_TYPE: 
            return {
                ...state,
                postType: action.payload,
                loading: false
            }
        case GET_CAT_TYPE: 
            return {
                ...state,
                catType: action.payload,
                loading: false
            }
        case GET_TAG_TYPE: 
            return {
                ...state,
                tagType: action.payload,
                loading: false
            }
        case SET_PAGINATION: 
            return {
                ...state,
                pagination: action.payload,
                loading: false
            }

        case SET_TOTAL: 
            return {
                ...state,
                total: action.payload,
                loading: false
            }

        case SET_COUNT: 
            return {
                ...state,
                count: action.payload,
                loading: false
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
            
        case SET_RESPONSE: 
            return {
                ...state,
                response: action.payload,
                loading: false
            }
            
        default: 
            return state;
    }

}

export default reducer;