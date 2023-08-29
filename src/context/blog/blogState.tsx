import React, { useReducer } from 'react'
import { useRouter } from 'next/router'

import Axios from 'axios';
import storage from '../../helpers/storage'
import loader from '../../helpers/loader'

import BlogContext from './blogContext';
import BlogReducer from './blogReducer';

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
    SET_RESPONSE,
    GET_BLOG_GRAPH,
    GET_BLOG_CAMPAIGNS,
    GET_BLOG_CAMPAIGN,
    GET_BLOG_SECTIONS
} from '../types';
import Cookies from 'universal-cookie';

const BlogState = (props: any) => {

    const cookie = new Cookies();

    const navigate = useRouter()
    Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

    const initialState = {
        overview: {},
        graph: [],
        subscribers: [],
        subscriber: {},
        campaigns: [],
        sections: [],
        campaign: {},
        brackets: [],
        bracket: {},
        posts: [],
        latest: [],
        filtered: [],
        post: {},
        tags: [],
        formatted: [],
        tag: {},
        categories: [],
        category: {},
        comments: [],
        comment: {},
        postType: 'all',
        catType: 'all',
        tagType: 'all',
        total: 0,
        count: 0,
        pagination: {},
        loading: false,
        response: {}
    }

    const [state, dispatch] = useReducer(BlogReducer, initialState);

    const logout = async () => {

        storage.clearAuth();

        navigate.push('/login');
        await Axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/logout`,{}, storage.getConfig());
    }

    const getOverview = async (id: string, date: string) => {

        const dt = date ? date : '';

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/users/overview/${id}?date=${dt}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_BLOG_OVERVIEW,
                    payload: resp.data.data
                });

                dispatch({
                    type: GET_BLOG_GRAPH,
                    payload: resp.data.data.graph
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get blog overview ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get blog overview ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get blog overview ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get blog overview ${err}`)

            }
            
        }
        

    }

    const getPosts = async (limit: number = 30, page: number = 1) => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/posts?${q}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_POSTS,
                    payload: resp.data.data
                });

                dispatch({
                    type: SET_PAGINATION,
                    payload: resp.data.pagination
                })

                dispatch({
                    type: SET_TOTAL,
                    payload: resp.data.total
                });

                dispatch({
                    type: SET_COUNT,
                    payload: resp.data.count
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get posts ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get posts ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get posts ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get posts ${err}`)

            }
            
        }
        

    }

    const getLatestPosts = async () => {

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/posts/latest`, storage.getConfig())
            .then((resp) => {

                dispatch({
                    type: GET_LATEST_POSTS,
                    payload: resp.data.data
                });

                unsetLoading()

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get latest posts ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get latest posts ${err}`)
    
                }

                unsetLoading()
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get latest posts ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get latest posts ${err}`)

            }

            unsetLoading()
            
        }
        

    }

    const getAllPosts = async (limit: number = 30, page: number = 1) => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/posts/all?${q}`, storage.getConfig())
            .then((resp) => {

                dispatch({
                    type: GET_POSTS,
                    payload: resp.data.data
                });

                dispatch({
                    type: SET_PAGINATION,
                    payload: resp.data.pagination
                })

                dispatch({
                    type: SET_TOTAL,
                    payload: resp.data.total
                });

                dispatch({
                    type: SET_COUNT,
                    payload: resp.data.count
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get posts ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get posts ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get posts ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get posts ${err}`)

            }
            
        }
        

    }

    const getUserPosts = async (limit: number = 30, page: number = 1, id: string = '') => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;
        let userId: string = id ? id : storage.getUserID()

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/posts/user-posts/${userId}?${q}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_POSTS,
                    payload: resp.data.data
                });

                dispatch({
                    type: SET_PAGINATION,
                    payload: resp.data.pagination
                })

                dispatch({
                    type: SET_TOTAL,
                    payload: resp.data.total
                });

                dispatch({
                    type: SET_COUNT,
                    payload: resp.data.count
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get posts ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get posts ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get posts ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get posts ${err}`)

            }
            
        }
        

    }

    const getPost = async (id: string) => {

        const exp = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        )

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/posts/${id}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_POST,
                    payload: resp.data.data
                });

                cookie.set("post", {
                    title: resp.data.data.title,
                    hadline: resp.data.data.headline,
                    thumbnail: resp.data.data.cover,
                    tags: resp.data.data.tags,
                    premalink: resp.data.data.premalink
                }, {
                    path: '/',
                    expires: exp
                })

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get single post ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get single post ${err}`)
    
                }

                unsetLoading()
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get single post ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get single post ${err}`)

            }

            unsetLoading()
        }
        

    }

    const getPostBySlug = async (slug: string, preview: boolean) => {

        const exp = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        )

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/posts/slug/${slug}?preview=${preview ? 'true':'false'}`, storage.getConfig())
            .then((resp) => {

                dispatch({
                    type: GET_POST,
                    payload: resp.data.data
                });

                unsetLoading();

                dispatch({
                    type: SET_RESPONSE,
                    payload: resp.data
                })

                cookie.set("post", {
                    title: resp.data.data.title,
                    hadline: resp.data.data.headline,
                    thumbnail: resp.data.data.cover,
                    tags: resp.data.data.tags,
                    premalink: resp.data.data.premalink
                }, {
                    path: '/',
                    expires: exp
                })

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get single post ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get single post ${err}`)
    
                }

                unsetLoading()

                dispatch({
                    type: SET_RESPONSE,
                    payload: err.response.data
                })
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get single post ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get single post ${err}`)

            }

            unsetLoading()
            dispatch({
                type: SET_RESPONSE,
                payload: err.response.data
            })
            
        }
        

    }

    const getBrackets = async (limit: number = 30, page: number = 1) => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/brackets?${q}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_BLOG_BRACKETS,
                    payload: resp.data.data
                });

                dispatch({
                    type: SET_PAGINATION,
                    payload: resp.data.pagination
                })

                dispatch({
                    type: SET_TOTAL,
                    payload: resp.data.total
                });

                dispatch({
                    type: SET_COUNT,
                    payload: resp.data.count
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get brackets ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get brackets ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get brackets ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get brackets ${err}`)

            }
            
        }
        

    }

    const getAllBrackets = async (limit: number = 30, page: number = 1) => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/brackets/all?${q}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_BLOG_BRACKETS,
                    payload: resp.data.data
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get brackets ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get brackets ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get brackets ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get brackets ${err}`)

            }
            
        }
        

    }

    const getUserBrackets = async (limit: number = 30, page: number = 1, id: string = '') => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;
        let userId: string = id ? id : storage.getUserID()

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/brackets/user-brackets/${userId}?${q}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_BLOG_BRACKETS,
                    payload: resp.data.data
                });

                dispatch({
                    type: SET_PAGINATION,
                    payload: resp.data.pagination
                })

                dispatch({
                    type: SET_TOTAL,
                    payload: resp.data.total
                });

                dispatch({
                    type: SET_COUNT,
                    payload: resp.data.count
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get posts ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get posts ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get posts ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get posts ${err}`)

            }
            
        }
        

    }

    const getBracket = async (id: string) => {

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/brackets/${id}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_BLOG_BRACKET,
                    payload: resp.data.data
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get bracket ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get bracket ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get bracket ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get bracket ${err}`)

            }
            
        }
        

    }

    const getBracketPosts = async (limit: number = 30, page: number = 1, id: string) => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/brackets/posts/${id}?${q}`, storage.getConfig())
            .then((resp) => {

                dispatch({
                    type: GET_POSTS,
                    payload: resp.data.data
                });

                dispatch({
                    type: SET_PAGINATION,
                    payload: resp.data.pagination
                })

                dispatch({
                    type: SET_TOTAL,
                    payload: resp.data.total
                });

                dispatch({
                    type: SET_COUNT,
                    payload: resp.data.count
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get brackets ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get brackets ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get brackets ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get brackets ${err}`)

            }
            
        }
        

    }

    const getCategories = async (limit: number = 30, page: number = 1) => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/categories?${q}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_BLOG_CATEGORIES,
                    payload: resp.data.data
                });

                dispatch({
                    type: SET_PAGINATION,
                    payload: resp.data.pagination
                })

                dispatch({
                    type: SET_TOTAL,
                    payload: resp.data.total
                });

                dispatch({
                    type: SET_COUNT,
                    payload: resp.data.count
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get categories ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get categories ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get categories ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get categories ${err}`)

            }
            
        }
        

    }

    const getAllCategories = async (limit: number = 30, page: number = 1) => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/categories/all?${q}`, storage.getConfig())
            .then((resp) => {

                dispatch({
                    type: GET_BLOG_CATEGORIES,
                    payload: resp.data.data
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get categories ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get categories ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get categories ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get categories ${err}`)

            }
            
        }
        

    }

    const getUserCategories = async (limit: number = 30, page: number = 1, id: string = '') => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;
        let userId: string = id ? id : storage.getUserID()

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/categories/user-categories/${userId}?${q}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_BLOG_CATEGORIES,
                    payload: resp.data.data
                });

                dispatch({
                    type: SET_PAGINATION,
                    payload: resp.data.pagination
                })

                dispatch({
                    type: SET_TOTAL,
                    payload: resp.data.total
                });

                dispatch({
                    type: SET_COUNT,
                    payload: resp.data.count
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get user categories ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get user categories ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get user categories ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get user categories ${err}`)

            }
            
        }
        

    }

    const getCategory = async (id: string) => {

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/categories/${id}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_BLOG_CATEGORY,
                    payload: resp.data.data
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get category ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get category ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get category ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get category ${err}`)

            }
            
        }
        

    }

    const getCategoryPosts = async (limit: number = 30, page: number = 1, id: string) => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/categories/posts/${id}?${q}`, storage.getConfig())
            .then((resp) => {

                dispatch({
                    type: GET_POSTS,
                    payload: resp.data.data
                });

                dispatch({
                    type: SET_PAGINATION,
                    payload: resp.data.pagination
                })

                dispatch({
                    type: SET_TOTAL,
                    payload: resp.data.total
                });

                dispatch({
                    type: SET_COUNT,
                    payload: resp.data.count
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get category posts ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get category posts ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get category posts ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get category posts ${err}`)

            }
            
        }
        

    }

    const getTags = async (limit: number = 30, page: number = 1) => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/tags?${q}`, storage.getConfigWithBearer())
            .then((resp) => {

                if(resp.data.data.length > 0){

                    const newData = resp.data.data.map((item: any) => { 

                        let tag = {
                            value: item.name,
                            label: item.name
                        }
                        return tag;
        
                    })

                    dispatch({
                        type: GET_FORMATTED_TAGS,
                        payload: newData
                    });

                }

                dispatch({
                    type: GET_BLOG_TAGS,
                    payload: resp.data.data
                });

                dispatch({
                    type: SET_PAGINATION,
                    payload: resp.data.pagination
                })

                dispatch({
                    type: SET_TOTAL,
                    payload: resp.data.total
                });

                dispatch({
                    type: SET_COUNT,
                    payload: resp.data.count
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get tags ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get tags ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get tags ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get tags ${err}`)

            }
            
        }
        

    }

    const getAllTags = async (limit: number = 30, page: number = 1) => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/tags/all?${q}`, storage.getConfig())
            .then((resp) => {

                if(resp.data.data.length > 0){

                    const newData = resp.data.data.map((item: any) => { 

                        let tag = {
                            value: item.name,
                            label: item.name
                        }
                        return tag;
        
                    })

                    dispatch({
                        type: GET_FORMATTED_TAGS,
                        payload: newData
                    });

                }

                dispatch({
                    type: GET_BLOG_TAGS,
                    payload: resp.data.data
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get tags ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get tags ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get tags ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get tags ${err}`)

            }
            
        }
        

    }

    const getUserTags = async (limit: number = 30, page: number = 1, id: string = '') => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;
        let userId: string = id ? id : storage.getUserID()

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/tags/user-tags/${userId}?${q}`, storage.getConfigWithBearer())
            .then((resp) => {

                if(resp.data.data.length > 0){

                    const newData = resp.data.data.map((item: any) => { 

                        let tag = {
                            value: item.name,
                            label: item.name
                        }
                        return tag;
        
                    })

                    dispatch({
                        type: GET_FORMATTED_TAGS,
                        payload: newData
                    });

                }

                dispatch({
                    type: GET_BLOG_TAGS,
                    payload: resp.data.data
                });

                dispatch({
                    type: SET_PAGINATION,
                    payload: resp.data.pagination
                })

                dispatch({
                    type: SET_TOTAL,
                    payload: resp.data.total
                });

                dispatch({
                    type: SET_COUNT,
                    payload: resp.data.count
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get user tags ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get user tags ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get user tags ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get user tags ${err}`)

            }
            
        }
        

    }

    const getTag = async (id: string) => {

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/tags/${id}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_BLOG_TAG,
                    payload: resp.data.data
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get tag ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get tag ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get tag ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get tag ${err}`)

            }
            
        }
        

    }

    const getTagPosts = async (limit: number = 30, page: number = 1, id: string) => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/tags/posts/${id}?${q}`, storage.getConfig())
            .then((resp) => {

                dispatch({
                    type: GET_POSTS,
                    payload: resp.data.data
                });

                dispatch({
                    type: SET_PAGINATION,
                    payload: resp.data.pagination
                })

                dispatch({
                    type: SET_TOTAL,
                    payload: resp.data.total
                });

                dispatch({
                    type: SET_COUNT,
                    payload: resp.data.count
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get tag posts ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get tag posts ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get tag posts ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get tag posts ${err}`)

            }
            
        }
        

    }

    const getSubscribers = async (limit: number = 30, page: number = 1) => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/subscribers?${q}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_BLOG_SUBSCRIBERS,
                    payload: resp.data.data
                });

                dispatch({
                    type: SET_PAGINATION,
                    payload: resp.data.pagination
                })

                dispatch({
                    type: SET_TOTAL,
                    payload: resp.data.total
                });

                dispatch({
                    type: SET_COUNT,
                    payload: resp.data.count
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get subscribers ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get subscribers ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get subscribers ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get subscribers ${err}`)

            }
            
        }
        

    }

    const getSubscriber = async (id: string) => {

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/subscribers/${id}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_BLOG_SUBSCRIBER,
                    payload: resp.data.data
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get subscriber ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get subscriber ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get subscriber ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get subscriber ${err}`)

            }
            
        }
        

    }

    const getCampaigns = async (limit: number = 30, page: number = 1) => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/campaigns?${q}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_BLOG_CAMPAIGNS,
                    payload: resp.data.data
                });

                dispatch({
                    type: SET_PAGINATION,
                    payload: resp.data.pagination
                })

                dispatch({
                    type: SET_TOTAL,
                    payload: resp.data.total
                });

                dispatch({
                    type: SET_COUNT,
                    payload: resp.data.count
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get campaigns ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get campaigns ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get campaigns ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get campaigns ${err}`)

            }
            
        }
        

    }

    const getAllCampaigns = async (limit: number = 30, page: number = 1) => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/campaigns/all?${q}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_BLOG_CAMPAIGNS,
                    payload: resp.data.data
                });

                dispatch({
                    type: SET_PAGINATION,
                    payload: resp.data.pagination
                })

                dispatch({
                    type: SET_TOTAL,
                    payload: resp.data.total
                });

                dispatch({
                    type: SET_COUNT,
                    payload: resp.data.count
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get campaigns ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get campaigns ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get campaigns ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get campaigns ${err}`)

            }
            
        }
        

    }

    const getUserCampaigns = async (limit: number = 30, page: number = 1, id: string = '') => {

        const q = `limit=${limit.toString()}&page=${page.toString()}&order=desc`;
        let userId: string = id ? id : storage.getUserID()

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/campaigns/user-campaigns/${userId}?${q}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_BLOG_CAMPAIGNS,
                    payload: resp.data.data
                });

                dispatch({
                    type: SET_PAGINATION,
                    payload: resp.data.pagination
                })

                dispatch({
                    type: SET_TOTAL,
                    payload: resp.data.total
                });

                dispatch({
                    type: SET_COUNT,
                    payload: resp.data.count
                });

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get campaigns ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get campaigns ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get campaigns ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get campaigns ${err}`)

            }
            
        }
        

    }

    const getCampaign = async (id: string) => {

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/campaigns/${id}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_BLOG_CAMPAIGN,
                    payload: resp.data.data
                });

                if( resp.data.data.sections && resp.data.data.sections.length > 0 ){

                    dispatch({
                        type: GET_BLOG_SECTIONS,
                        payload: resp.data.data.sections
                    });

                    storage.keepLegacy('acs', resp.data.data.sections[0].label)

                }

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get campaign ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get campaign ${err}`)
    
                }
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get campaign ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get campaign ${err}`)

            }
            
        }
        

    }

    const getCampaignByCode = async (code: string) => {

        setLoading();

        try {

            await Axios.get(`${process.env.NEXT_PUBLIC_BLOG_URL}/campaigns/get-campaign/${code}`, storage.getConfigWithBearer())
            .then((resp) => {

                dispatch({
                    type: GET_BLOG_CAMPAIGN,
                    payload: resp.data.data
                });

                if( resp.data.data.sections && resp.data.data.sections.length > 0 ){

                    dispatch({
                        type: GET_BLOG_SECTIONS,
                        payload: resp.data.data.sections
                    });

                    storage.keepLegacy('acs', resp.data.data.sections[0].label)

                }

                unsetLoading()

            }).catch((err) => {

                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get campaign ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get campaign ${err}`)
    
                }

                unsetLoading()
                
            })
            
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get campaign ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get campaign ${err}`)

            }

            unsetLoading()
            
        }
        

    }

    const setLoading = () => {
        dispatch({
            type: SET_LOADING
        })
    }

    const unsetLoading = () => {
        dispatch({
            type: UNSET_LOADING,
        })
    }

    const setPosts = (data: Array<any>) => {
        dispatch({
            type: GET_POSTS,
            payload: data
        })
    }

    const setFiltered = (data: Array<any>) => {
        dispatch({
            type: GET_FILTERED_POSTS,
            payload: data
        })
    }

    const setFormatted = (data: Array<any>) => {
        dispatch({
            type: GET_FORMATTED_TAGS,
            payload: data
        })
    }

    const setSections = (data: Array<any>) => {
        dispatch({
            type: GET_BLOG_SECTIONS,
            payload: data
        })
    }

    const setTypes = (t: string, v: string) => {
        
        if(t === 'post'){

            dispatch({
                type: GET_POST_TYPE,
                payload: v
            })

        }

        if(t === 'category'){

            dispatch({
                type: GET_CAT_TYPE,
                payload: v
            })

        }

        if(t === 'tag'){

            dispatch({
                type: GET_TAG_TYPE,
                payload: v
            })

        }

    }

    return <BlogContext.Provider

        value={{
            overview: state.overview,
            graph: state.graph,
            brackets: state.brackets,
            bracket: state.bracket,
            posts: state.posts,
            latest: state.latest,
            filtered: state.filtered,
            post: state.post,
            tags: state.tags,
            formatted: state.formatted,
            tag: state.tag,
            categories: state.categories,
            category: state.category,
            comments: state.comments,
            comment: state.comment,
            subscribers: state.subscribers,
            subscriber: state.subscriber,
            campaigns: state.campaigns,
            sections: state.sections,
            campaign: state.campaign,
            postType: state.postType,
            tagType: state.tagType,
            catType: state.catType,
            total: state.total,
            count: state.count,
            pagination: state.pagination,
            loading: state.loading,
            response: state.response,
            getOverview,
            getPosts,
            getLatestPosts,
            getAllPosts,
            getUserPosts,
            getPost,
            getPostBySlug,
            getBrackets,
            getAllBrackets,
            getUserBrackets,
            getBracket,
            getBracketPosts,
            getCategories,
            getAllCategories,
            getUserCategories,
            getCategory,
            getCategoryPosts,
            getTags,
            getAllTags,
            getUserTags,
            getTag,
            getTagPosts,
            getSubscribers,
            getSubscriber,
            getCampaigns,
            getCampaign,
            getCampaignByCode,
            getAllCampaigns,
            getUserCampaigns,
            setPosts,
            setFiltered,
            setFormatted,
            setTypes,
            setSections,
            setLoading,
            unsetLoading
            
        }}
    >
        {props.children}

    </BlogContext.Provider>

}

export default BlogState