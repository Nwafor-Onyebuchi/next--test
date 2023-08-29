import React, { useReducer } from 'react'
import { useRouter } from 'next/router';
import Axios from 'axios';
import storage from '../../helpers/storage';
import loader from '../../helpers/loader'
import Ip from '../../helpers/Ip';

import ResourceContext from './resourceContext';
import ResourceReducer from './resourceReducer';

import {
    GET_BANKS,
    GET_LOCATIONS,
    GET_COUNTRIES,
    GET_IP_ADDRESS,
    SET_LOADING
 } from '../types';

const ResourceState = (props: any) => {

    const navigate = useRouter();
    Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

    const initialState = {
        banks: [],
        locations: [],
        countries: [],
        country: {},
        ipData: {},
        loading: false
    }

    const [state, dispatch] = useReducer(ResourceReducer, initialState);

    const logout = async () => {

        storage.clearAuth();
        navigate.push('/login');
        await Axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/logout`,{}, storage.getConfig());
    }

    const getBanks = async (limit: number = 9999) => {

        setLoading()

        try {
            await Axios.get(`${process.env.NEXT_PUBLIC_RESOURCES_URL}/banks?limit=${limit}`, storage.getConfig())
            .then((resp: any) => {
                dispatch({
                    
                    type: GET_BANKS,
                    payload: resp.data.data
                })
                
            }).catch((err: any) => {
        
                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();

                }else if(err && err.response && err.response.data){

                    console.log(`Error! Could not get banks ${err.response.data}`)

                }else if(err && err  === 'Error: Network Error'){

                    loader.popNetwork();

                }else if(err){

                    console.log(`Error! Could not get banks ${err}`)

                }

            });
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get banks ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not banks ${err}`)

            }

        }
    }

    const getLocations = async () => {

        setLoading()

        try {
            await Axios.get(`${process.env.NEXT_PUBLIC_RESOURCES_URL}/locations?limit=9999`, storage.getConfig())
            .then((resp: any) => {
                dispatch({
                    
                    type: GET_LOCATIONS,
                    payload: resp.data.data
                })
                
            }).catch((err: any) => {
        
                if(err && err.response && err.response.data && err.response.data.status === 401){

                    logout();

                }else if(err && err.response && err.response.data){

                    console.log(`Error! Could not locations ${err.response.data}`)

                }else if(err && err  === 'Error: Network Error'){

                    loader.popNetwork();

                }else if(err){

                    console.log(`Error! Could not get locations ${err}`)

                }

            });
        } catch (err: any) {

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get locations ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not get locations ${err}`)

            }

        }
    }

    const getCountries = async (limit: number = 9999) =>{

        setLoading();

        await Axios.get(`${process.env.NEXT_PUBLIC_RESOURCES_URL}/countries?limit=${limit}`, storage.getConfig())
        .then((resp: any) =>{

            dispatch({
                type: GET_COUNTRIES,
                payload: resp.data.data

            });
        }).catch((err: any) =>{

            if(err && err.response && err.response.data && err.response.data.status === 401){

                logout();

            }else if(err && err.response && err.response.data){

                console.log(`Error! Could not get countries ${err.response.data}`)

            }else if(err && err  === 'Error: Network Error'){

                loader.popNetwork();

            }else if(err){

                console.log(`Error! Could not countries ${err}`)

            }
            
        })
        
    };

    const getIpAddress =  () => {

        setLoading();

        Ip.getAddress()
        .then((resp) => {


            dispatch({
                type: GET_IP_ADDRESS,
                payload: resp
            })
            console.log(resp);
        }).catch((err) => {
            console.log(err)
        })
    }

    const setLoading = () => {
        dispatch({
            type: SET_LOADING
        })
    }
  

    return <ResourceContext.Provider
            value={{
                banks: state.banks,
                locations: state.locations,
                countries: state.countries,
                country: state.country,
                ipData: state.ipData,
                loading: state.loading,
                getBanks,
                getLocations,
                getCountries,
                getIpAddress
            }}>
        {props.children}
        
    </ResourceContext.Provider>
  
}

export default ResourceState