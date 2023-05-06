import React, { useReducer } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'universal-cookie';

import Axios from 'axios';
import storage from '../../helpers/storage'
import loader from '../../helpers/loader'

import UserContext from './userContext';
import UserReducer from './userReducer';

import {
    GET_LOGGEDIN_USER,
    SET_USERTYPE,
    SET_IS_ADMIN,
    SET_IS_SUPER,
    SET_LOADING,
    SET_SIDEBAR,
    UNSET_LOADING
} from '../types'

const UserState = (props: any) => {

    const cookie = new Cookies();

    const exp = new Date(
        Date.now() + 70 * 24 * 60 * 60 * 1000
    )

    const navigate = useRouter()
    Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

    const initialState = {
        user: {},
        userType: '',
        sidebar: {},
        isSuper: false,
        isAdmin: false,
        loading: false,
    }

    const [state, dispatch] = useReducer(UserReducer, initialState);

    const logout = async () => {

        storage.clearAuth();
        localStorage.clear()
        navigate.push('/login');
        cookie.remove('token');
        cookie.remove('userType');
        await Axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/logout`,{}, storage.getConfig());
    }

    const getUser = async (id: string = '') => {

        setLoading()
            try {

                await Axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/user/${id ? id : storage.getUserID()}`, storage.getConfigWithBearer())
                .then((resp) => {

                    dispatch({
                        type: GET_LOGGEDIN_USER,
                        payload: resp.data.data
                    });

                    cookie.set("userType", resp.data.data.userType , {
                        path: '/',
                        expires: exp
                    })

                }).catch((err: any) => {

                    if(err && err.response && err.response.data && err.response.data.status === 401){

                        logout();
        
                    }else if(err && err.response && err.response.data){
        
                        console.log(`Error! Could not get logged in user ${err.response.data}`)
        
                    }else if(err && err  === 'Error: Network Error'){
        
                        loader.popNetwork();
        
                    }else if(err){
        
                        console.log(`Error! Could not get logged in user ${err}`)
        
                    }
                    
                })
                
            } catch (err: any) {
                
                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();
    
                }else if(err && err.response && err.response.data){
    
                    console.log(`Error! Could not get logged in user ${err.response.data}`)
    
                }else if(err && err  === 'Error: Network Error'){
    
                    loader.popNetwork();
    
                }else if(err){
    
                    console.log(`Error! Could not get logged in user ${err}`)
    
                }
                
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

    const setUserType = (n: string) => {

        dispatch({
            type: SET_USERTYPE,
            payload: n
        })

        if(n === 'superadmin'){
            dispatch({
                type: SET_IS_SUPER,
                payload: true
            })
            dispatch({
                type: SET_IS_ADMIN,
                payload: false
            })
        }else if(n === 'admin'){
            dispatch({
                type: SET_IS_SUPER,
                payload: false
            })
            dispatch({
                type: SET_IS_ADMIN,
                payload: true
            })
        }else {
            dispatch({
                type: SET_IS_SUPER,
                payload: false
            })
            dispatch({
                type: SET_IS_ADMIN,
                payload: false
            })
        }
    }

    const setSidebar = (a: boolean, l: string) => {
        dispatch({
            type: SET_SIDEBAR,
            payload: { active: a, label: l }
        })
    }

    const getUserType = () => {
        const ut = cookie.get('userType');
        return ut ? ut.toString() : '';
    }

    const isLoggedIn = (): boolean => {

        let flag = false;

        const ut = cookie.get('userType');
        const tk = cookie.get('token');

        if(tk && ut){
            flag = true;
        }

        return flag

    }

    return <UserContext.Provider
        value={{
            user: state.user,
            userType: state.userType,
            sidebar: state.sidebar,
            isSuper: state.isSuper,
            isAdmin: state.isAdmin,
            loading: state.loading,
            getUser,
            setUserType,
            setSidebar,
            getUserType,
            unsetLoading,
            isLoggedIn
        }}
    >
        {props.children}

    </UserContext.Provider>
  
}

export default UserState