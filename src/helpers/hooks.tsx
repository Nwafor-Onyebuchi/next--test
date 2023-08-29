import React, { useEffect} from 'react'
import { useRouter } from 'next/router';
import loader from './loader'
import Axios from 'axios';
import storage from './storage';
import Cookies from 'universal-cookie';

const logout = async () => {
    const cookie = new Cookies();

    storage.clearAuth();
    localStorage.clear();

    // remove cookies
    cookie.remove('token');
    cookie.remove('userType');

    await Axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/logout`,{}, storage.getConfig());
}

const trackCampaign = async (data: any) => {

    const cookie = new Cookies();

    await Axios.put(`${process.env.NEXT_PUBLIC_BLOG_URL}/campaigns/track`, { utm: data } , storage.getConfig())
    .then((resp) => {

        if(resp.data.error === false && resp.data.status === 200){
            cookie.remove('cpxtr')
        }

    }).catch((err) => {
        if (err.response.data.errors && err.response.data.errors.length > 0) {

        } else {
            
        }
    })

}

export function useNetworkDetect(){

    
    const toggleNetwork = (e: any) => {
        loader.popNetwork()
    }

    useEffect(() => {

        window.addEventListener(`offline`, toggleNetwork, false);
        window.addEventListener(`online`, () => { }, false);

    }, [])

}

export const usePageRedirect = (types: Array<string>) => {

    const navigate = useRouter();
    const cookie = new Cookies();

    const ut = cookie.get("userType");

    useEffect(() => {
        fireRedirect()
    }, [])

    const fireRedirect = () => {

        if(!storage.checkToken() && !storage.checkUserID()){
            navigate.push('/login');
            logout()
        }else if(ut === '' || ut === undefined || ut === null){
            navigate.push('/login');
            logout()
        }else if(types.includes(ut) === false){
            navigate.push('/login');
            logout()
        }

    }

}

export const useTrackCampaign = (data: any) => {

    let ct = 0;

    useEffect(() => {

        if(data && data.medium && data.source && data.content && data.campaign){
            setTimeout(async () => {

                if(ct === 0){
                    await trackCampaign(data);
                    ct += 1;
                }
                
            }, 200)

            setTimeout(() => {
                ct = 0;
            },1500)
        }

    }, [])
    
}

