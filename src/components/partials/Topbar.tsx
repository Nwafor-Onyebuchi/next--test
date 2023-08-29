import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ITopbarProps, IUserContext } from '../../utils/types'
import Cookies from 'universal-cookie';

import Axios from 'axios'

import storage from '../../helpers/storage'
import Toast from '../partials/Toast'
import UserContext from '@/context/user/userContext';

const Topbar = ({ isFixed, pageTitle, showBack, barType, collapsed, barCollapsed, expandFunc }: Partial<ITopbarProps>) => {

    const navigate = useRouter();
    const cookie = new Cookies();

    const userContext = useContext<IUserContext>(UserContext)
    const [icon, setIcon] = useState('menu')

    const [toast, setToast] = useState({
        type: 'success',
        show: false,
        message: '',
        title: '',
        position: 'top-right'
    })

    useEffect(() => {

    }, [])

    const back = (e: any) => {
        if(e) e.preventDefault();
        navigate.back()
    }

    const logout = async (e: any) => {

        if(e) e.preventDefault();

        await storage.clearAuth();
        await localStorage.clear()
        navigate.push('/');

        cookie.remove('token')
        cookie.remove('userType');
        await Axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/logout`,{}, storage.getConfig());
    }

    const openSidebar = (e: any) => {
        e.preventDefault();
        const sd = document.querySelector('.ui-sidebar');
        
        if(sd){
            if(sd.classList.contains('pull-icons')){
                sd.classList.remove('pull-icons');
                setIcon('menu')
            }else{
                sd.classList.add('pull-icons');
                setIcon('x')
            }
        }

      }

      const expandSideBar = (e: any) => {

        if(e) { e.preventDefault() }
        expandFunc(e);

    }

    const toggleToast = (e: any) => {
        if(e) e.preventDefault();
        setToast({ ...toast, show: !toast.show });
    }

    return (
        <>

            <Toast 
            show={toast.show} 
            title={toast.title} 
            message={toast.message} 
            position={toast.position}
            type={toast.type}
            close={toggleToast} />

            <div id="ui-dashboard-topbar" style={{  backgroundColor: "#05041B"}} className={`ui-dashboard-topbar ${ collapsed && collapsed === true ? 'sdbr--cllps' : 'sdbr--open' } ${ isFixed ? 'stick' : '' }`}>

                {
                    collapsed && collapsed === true &&
                    <div className='ui-hide-mobile-only pdr2'>
                        {
                            (barCollapsed === undefined || barCollapsed === false) &&
                            <Link href="" onClick={(e) => expandSideBar(e)} className="">
                                <span style={{ position: 'relative', top: '3px' }} className="fe fe-x fs-18 onwhite"></span>
                            </Link>
                        }
                        {
                            barCollapsed !== undefined && barCollapsed === true &&
                            <Link href="" onClick={(e) => expandSideBar(e)} className="">
                                <span style={{ position: 'relative', top: '3px' }} className="fe fe-menu fs-18 onwhite"></span>
                            </Link>
                        }
                        
                    </div>
                }

                {
                    showBack && 
                    <>
                    <Link href="" className="link-round sm bgd-disable" onClick={(e) => back(e)}>
                        <span style={{ position: 'relative', top: '0px' }} className="fe fe-arrow-left fs-14 onwhite"></span>
                    </Link>
                    <span className='pdr1'></span>
                    </>
                }

                <h1 className="page-title font-freibold onwhite ui-relative fs-14" style={{ top: '0px' }}>{ pageTitle ? pageTitle : 'Home'}</h1>

                <span className='pdl2 pdr2'></span>

                <div className={`${userContext.userType ? '' : 'ui-hide'}`}>
                    <span className='font-frei fs-12' style={{ color: "#585490" }}>Signed in as</span>
                    <span className='font-freibold fs-12' style={{ color: "#A9A7CE" }}> { userContext.getUserType() } </span>
                </div>

                <div className="options">

                
                    <ul className="ui-topbar-nav">

                        <li className=''>
                            <Link href="/dashboard" className='ui-relative' style={{ top: '2px' }}>
                                <span className='bell-ball'>
                                    <i className='font-freimedium fs-11 onwhite ui-font-normal'>0</i>
                                </span>
                                <span style={{ left: '0', top: '6px' }} className='cp-icon cp-bell ui-relative'>
                                    <span className='path1 fs-22'></span>
                                    <span className='path2 fs-22'></span>
                                </span>
                            </Link>
                        </li>

                        <li className='pdr2 pdl2'></li>

                        <li className='ui-hide-mobile-only'>
                            <Link href="" className="topbar-dp">
                                {
                                    !userContext.loading && userContext.user.dp &&  userContext.user.dp !== 'no-picture.jpg' &&
                                    <img src={userContext.user.dp} alt="dp"/>
                                }
                                {
                                    !userContext.loading && userContext.user.dp && (userContext.user.dp === '' || userContext.user.dp === 'no-picture.jpg') &&
                                    <img src="../../../images/assets/user-avatar.svg" alt="dp"/>
                                }
                                {
                                    !userContext.loading && !userContext.user.dp &&
                                    <img src="../../../images/assets/user-avatar.svg" alt="dp"/>
                                }
                                {
                                    userContext.loading &&
                                    <img src="../../../images/assets/user-avatar.svg" alt="dp"/>
                                }

                            </Link>

                            <div className="ui-topbar-drop">

                                <ul>
                                    <li>
                                        {/* <Link to={`/dashboard/${userContext.user.isSuper ? 'account' : 'manager/account'}`} className="font-matterregular fs-14">Account</Link> */}
                                    </li>

                                    <li>
                                        <Link href="" onClick={(e) => logout(e)} className="font-matterregular fs-14">Logout</Link>
                                    </li>
                                </ul>

                            </div>
                        </li>

                        <li className="pdl1 ui-show-mobile-only">
                            <Link href="" onClick={(e) => openSidebar(e)} className="sd-menu brandcc-red" style={{position: 'relative', top: '5px'}}><span className={`fe fe-${icon} fs-23`}></span></Link>
                        </li>

                    </ul>

                </div>

            </div>
        
        </>
    )
  
}

export default Topbar