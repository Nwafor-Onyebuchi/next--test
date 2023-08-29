import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Cookies from 'universal-cookie';
import storage from '../../helpers/storage'
import { IBlogContext, ISidebarProps, IUserContext } from '../../utils/types'
import Axios from 'axios';

import BlogContext from '@/context/blog/blogContext';
import UserContext from '@/context/user/userContext';

import { useNetworkDetect, usePageRedirect } from '../../helpers/hooks';
import body from '../../helpers/body'
import { NextPage } from 'next';

const SideBar: NextPage<any> = ({ collapsed, barCollapsed, expandSidebar }: ISidebarProps) => {

    const navigate = useRouter()
    const cookie = new Cookies();

    const userContext = useContext<IUserContext>(UserContext);
    const blogContext = useContext<IBlogContext>(BlogContext);

    const [active, setActive] = useState<string | null>('home');
    const [sub, setSub] = useState<string | null>('');

    useEffect(() => {

        body.changeBackground('dash-body');

        // set user type
        userContext.setUserType(cookie.get('userType'));

        // activate submenu
        if(barCollapsed === true){
            userContext.setSidebar(false,'')
        }else{
            
            if(collapsed === true){
                userContext.setSidebar(false,'');
            }else{
                
                const sb = storage.fetch('sub-menu')
                if(sb){
                    userContext.setSidebar(sb.active, sb.label)
                }

            }

        }

        setActive(storage.fetchLegacy('sb-menu') ? storage.fetchLegacy('sb-menu') : 'home');
        setSub(storage.fetchLegacy('sub-link') ? storage.fetchLegacy('sub-link') : '');
        loadDefaults();

    }, [])

    useNetworkDetect();
    usePageRedirect(["superadmin", "admin", "writer"])

    const goTo = (e: any, url: string, p: string) => {
        if (e) { e.preventDefault() }
        setActive(p);

        storage.keepLegacy('sb-menu', p);
        storage.delete('sub-menu', false);
        userContext.setSidebar(false, '')

        navigate.push(url)
    }

    const goToSub = (e: any, url: string, t: string) => {
        if (e) { e.preventDefault() }
        setSub(t);
        storage.keepLegacy('sub-link', t);
        navigate.push(url);

        if(t === 'watch'){
            userContext.setSidebar(false, 'course-details');
        }
    }

    const loadDefaults = async () => {

        if (body.isObjectEmpty(userContext.user) === true) {
            userContext.getUser(storage.getUserID());
        }
    
        blogContext.getOverview(storage.getUserID(), '')

    }

    const redirectToLogin = () => {

        const ut = cookie.get("userType");

        if (!storage.checkToken() && !storage.checkUserID()) {
            logout()
        } else if (ut === '' || ut === undefined || ut === null) {
            logout()
        }
    }

    const logout = async (e: any = null) => {

        if (e) e.preventDefault();

        storage.clearAuth();
        localStorage.clear();
        navigate.push('/login');

        // remove cookies
        cookie.remove('token');
        cookie.remove('userType');
        await Axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/logout`, {}, storage.getConfig());
    }

    const toggleSub = (e: any, lb: string, url: string = '') => {

        if (e) { e.preventDefault() }

        if (userContext.sidebar.active && userContext.sidebar.label === lb) {
            userContext.setSidebar(false,'')
            storage.delete('sub-menu')
        } else {

            userContext.setSidebar(true,lb)
            setActive(lb);

            // local storage
            storage.keepLegacy('sb-menu', lb)
            storage.keep('sub-menu', { active: true, label: lb })
        }

        if (url) { navigate.push(url) }

        if(collapsed && barCollapsed){
            expandSidebar(e)
        }

    }

    const closeSub = (e: any) => {
        if (e) { e.preventDefault() }

        userContext.setSidebar(false,'')
        storage.delete('sub-menu', false)
    }

    const setBarhead = () => {

        let result: { class: string, bg: string } = { class: '', bg: '' }

        if(userContext.sidebar.label === 'course-details'){
            result.class = 'ui-full-bg-norm ui-bg-center lg empty';
        }

        if(userContext.sidebar.label === 'program-details'){
            result.class = 'ui-full-bg-norm ui-bg-center lg empty';
        }

        return result;

    }

    return (
        <>

            <div className='ui-monitor'>
                <div className='d-flex'>
                    <div />
                    <div className='ml-auto'>
                        <Link href='/' className='pullin--btn onblack'>
                            <span
                                className='fe fe-arrow-left fs-20'
                                style={{ color: '#2F80ED' }}
                            />
                        </Link>
                    </div>
                </div>
            </div>

            <section id="ui-sidebar" className={`ui-sidebar ${collapsed && collapsed === true ? 'sdbr--cllps' : 'sdbr--open'}`}>

                {/* secondary */}
                <div className={`ui-sidebar-secondary head-shift ${userContext.sidebar.active ? 'open' : 'close'}`}>

                    <div className={`bar-head ${setBarhead().class}`} style={{ backgroundImage: `url("${setBarhead().bg}")` }}>

                        {
                            userContext.sidebar.label === 'course-details' &&
                            <span className={`ui-relative cp-camera reverse cp-icon`}>
                                <i className='path1 fs-12'></i>
                                <i className='path2 fs-12'></i>
                            </span>
                        }

                        {
                            userContext.sidebar.label === 'program-details' &&
                            <span className={`ui-relative cp-course cp-icon`}>
                                <i className='path1 fs-12'></i>
                                <i className='path2 fs-12'></i>
                            </span>
                        }

                        {
                            userContext.sidebar.label !== 'course-details' && userContext.sidebar.label !== 'program-details' &&
                            <>
                                <Link href={``} className='' style={{ color: "#BBB7EE" }}>
                                    <span className='font-freibold fs-11 ui-upcase pdr'>{userContext.sidebar.label}</span>
                                </Link>
                                <Link onClick={(e) => closeSub(e)} href="" className='ml-auto ui-relative' style={{ opacity: '0.75', top:'1px' }}><span className='fe fe-x fs-15 onwhite'></span></Link>
                            </>
                        }

                    </div>

                    <div className='bar-body'>

                        <ul className='links'>
                            {
                                userContext.sidebar.label === 'blog' &&
                                <>
                                    <li>
                                        <Link onClick={(e) => goToSub(e, '/dashboard/blog/posts', 'posts')} href="">
                                            <span className={`font-freimedium fs-13 ${sub === 'posts' ? 'onwhite' : ''}`}>Posts</span>
                                            <span className='fe fe-chevron-right ml-auto'></span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link onClick={(e) => goToSub(e, '/dashboard/blog/categories', 'categories')} href="">
                                            <span className={`font-freimedium fs-13 ${sub === 'categories' ? 'onwhite' : ''}`}>Categories</span>
                                            <span className='fe fe-chevron-right ml-auto'></span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link onClick={(e) => goToSub(e, '/dashboard/blog/tags', 'tags')} href="">
                                            <span className={`font-freimedium fs-13 ${sub === 'tags' ? 'onwhite' : ''}`}>Tags</span>
                                            <span className='fe fe-chevron-right ml-auto'></span>
                                        </Link>
                                    </li>
                                    
                                    {
                                        (userContext.getUserType() === 'superadmin' || userContext.getUserType() === 'admin') &&
                                        <>
                                            <li>
                                                <Link onClick={(e) => goToSub(e, '/dashboard/blog/campaigns', 'campaigns')} href="">
                                                    <span className={`font-freimedium fs-13 ${sub === 'campaigns' ? 'onwhite' : ''}`}>Campaigns</span>
                                                    <span className='fe fe-chevron-right ml-auto'></span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link onClick={(e) => goToSub(e, '/dashboard/blog/subscribers', 'subscribers')} href="">
                                                    <span className={`font-freimedium fs-13 ${sub === 'subscribers' ? 'onwhite' : ''}`}>Subscribers</span>
                                                    <span className='fe fe-chevron-right ml-auto'></span>
                                                </Link>
                                            </li>
                                        </>
                                    }
                                </>
                            }

                            {
                                userContext.sidebar.label === 'updates' &&
                                <>
                                    <li>
                                        <Link href="">
                                            <span className='font-freimedium fs-13'>What's New</span>
                                            <span className='fe fe-chevron-right ml-auto'></span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="">
                                            <span className='font-freimedium fs-13'>Feedback</span>
                                            <span className='fe fe-chevron-right ml-auto'></span>
                                        </Link>
                                    </li>
                                </>
                            }

                            {
                                userContext.sidebar.label === 'support' &&
                                <>
                                    <li>
                                        <Link href="">
                                            <span className='font-freimedium fs-13'>Help</span>
                                            <span className='fe fe-chevron-right ml-auto'></span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="">
                                            <span className='font-freimedium fs-13'>Contact Us</span>
                                            <span className='fe fe-chevron-right ml-auto'></span>
                                        </Link>
                                    </li>
                                </>
                            }

                        </ul>

                    </div>

                </div>

                {/* primary */}
                <div id="ui-sidebar-primary" className={`ui-sidebar-primary ${collapsed && collapsed === true ? 'sdbr--cllps' : 'sdbr--open'}`}>

                    <div id="ui-sidebar-primary-header" className="ui-sidebar-primary-header mrgb1">

                        <Link href="/dashboard"><img className="logo" src="../../../images/assets/logo-white.svg" alt="" /></Link>

                    </div>

                    <div className='ui-sidebar-primary-body'>

                        <div className="ui-separate-small ui-show-mobile-only"></div>

                        <ul id="ui-sidebar-primary-links" className={`ui-sidebar-primary-links primary-nav pdl0 pdb0`}>

                            {
                                userContext.userType === 'writer' &&
                                <>
                            
                                    <li className={`nav-list ${active === 'home' ? 'active' : ''}`}>
                                        <Link onClick={(e) => goTo(e, '/dashboard', 'home')} href='' className='ui-icon-animate link' title='Home'>
                                            <span style={{ top: '1px' }} className={`ui-relative cp-home cp-icon ${active === 'home' ? 'active' : ''}`}>
                                                <i className='path1 fs-22'></i>
                                                <i className='path2 fs-22'></i>
                                            </span>
                                            <span style={{ position: 'relative', left: '-2px', top: '1px' }} className='lnk--text sb-text font-frei fs-14'>
                                                Dashboard
                                            </span>
                                        </Link>
                                    </li>

                                    <li className={` nav-list ${active === 'blog' ? 'active' : ''}`}>
                                        <Link onClick={(e) => toggleSub(e, 'blog', '/dashboard/blog')} href='' className='ui-icon-animate link' title='Blog'>
                                            <span style={{ position: 'relative', left: '0', top: '1px', color: '#fff' }} className={`ui-relative cp-blog cp-icon ${active === 'blog' ? 'active' : ''}`}>
                                                <i className='path1 fs-22'></i>
                                                <i className='path2 fs-22'></i>
                                            </span>
                                            <span style={{ position: 'relative', left: '-2px' }} className='lnk--text sb-text font-frei fs-14'>
                                                Blog
                                            </span>
                                        </Link>
                                    </li>

                                    <li className={` nav-list ${active === 'updates' ? 'active' : ''}`}>
                                        <Link onClick={(e) => toggleSub(e, 'updates')} href='' className='ui-icon-animate link' title='Updates'>
                                            <span style={{ left: '-1px' }} className={`ui-relative cp-reload reverse cp-icon ${active === 'updates' ? 'active' : ''}`}>
                                                <i className='path1 fs-22'></i>
                                                <i className='path2 fs-22'></i>
                                            </span>
                                            <span style={{ position: 'relative', left: '-4px' }} className='lnk--text sb-text font-frei fs-14'>
                                                Updates
                                            </span>
                                        </Link>
                                    </li>

                                    <li className={` nav-list ${active === 'support' ? 'active' : ''}`}>
                                        <Link onClick={(e) => toggleSub(e, 'support')} href='' className='ui-icon-animate link' title='Support'>
                                            <span style={{ position: 'relative', left: '0', top: '1px', color: '#fff' }} className={`ui-relative cp-callout cp-icon ${active === 'support' ? 'active' : ''}`}>
                                                <i className='path1 fs-22'></i>
                                                <i className='path2 fs-22'></i>
                                            </span>
                                            <span style={{ position: 'relative', left: '-2px' }} className='lnk--text sb-text font-frei fs-14'>
                                                Support
                                            </span>
                                        </Link>
                                    </li>

                                </>
                            }

                            {
                                (userContext.userType === 'superadmin' || userContext.userType === 'admin') &&
                                <>

                                    <li className={`nav-list ${active === 'home' ? 'active' : ''}`}>
                                        <Link onClick={(e) => goTo(e, '/dashboard', 'home')} href='' className='ui-icon-animate link' title='Home'>
                                            <span style={{ top: '1px' }} className={`ui-relative cp-home cp-icon ${active === 'home' ? 'active' : ''}`}>
                                                <i className='path1 fs-22'></i>
                                                <i className='path2 fs-22'></i>
                                            </span>
                                            <span style={{ position: 'relative', left: '-2px', top: '1px' }} className='lnk--text sb-text font-frei fs-14'>
                                                Dashboard
                                            </span>
                                        </Link>
                                    </li>

                                    <li className={` nav-list ${active === 'blog' ? 'active' : ''}`}>
                                        <Link onClick={(e) => toggleSub(e, 'blog', '/dashboard/blog')} href='' className='ui-icon-animate link' title='Blog'>
                                            <span style={{ position: 'relative', left: '0', top: '1px', color: '#fff' }} className={`ui-relative cp-blog cp-icon ${active === 'blog' ? 'active' : ''}`}>
                                                <i className='path1 fs-22'></i>
                                                <i className='path2 fs-22'></i>
                                            </span>
                                            <span style={{ position: 'relative', left: '-2px' }} className='lnk--text sb-text font-frei fs-14'>
                                                Blog
                                            </span>
                                        </Link>
                                    </li>
                                
                                </>
                            }

                        </ul>

                        {/* <div className="ui-line bg-silverlight"></div> */}

                        <ul id="ui-sidebar-primary-links" className={`ui-sidebar-primary-links`}>

                            <li className={`nav-list`}>
                                <Link onClick={(e) => logout(e)} href='' className='ui-icon-animate link' title='Logout'>
                                    <span style={{ top: '1px' }} className='ui-relative cp-power cp-icon'>
                                        <i className='path1 fs-24'></i>
                                        <i className='path2 fs-24'></i>
                                    </span>
                                    <span style={{ position: 'relative', left: '-2px' }} className='lnk--text sb-text font-frei fs-14'>
                                        Logout
                                    </span>
                                </Link>
                            </li>

                        </ul>

                    </div>

                </div>

            </section>

        </>
    )

}

export default SideBar

{/* <li className={`drop ${ active === 'settings' ? 'active' : '' }`}>
    <Link onClick={ (e) => {
        openDrop(e,'settings', 'settings');
        }} className='ui-icon-animate' title='Launch' >
        <span className='concreap-icon'><img src="../../../images/icons/dsettings.svg" alt="icon" /></span>
        <span className='lnk--text font-frei fs-15'>Settings</span>
        <span className="ml-auto fe fs-24" style={{position: 'relative', top: '3px', left: '8px'}}></span>
    </Link>

    <div className={`ui-sidebar-dropdown ${dropType === 'trade' ? 'is-open' : ''}`}>

        <ul className='ui-sidebar-primary-links'>

            <li>
                <Link onClick={(e) => goto(e, '/salex/launch', 'launch')} href='' className='ui-icon-animate' title='Basic info'>
                <span className='lnk--text fs-13 font-montserrat'>
                    Dashboard
                </span>
                </Link>
            </li>

            <li>
                <Link onClick={(e) => goto(e, '/salex/launch/start-sale', 'launch')} href='' className='ui-icon-animate' title='Basic info'>
                <span className='lnk--text  fs-13 font-montserrat'>
                    Start Sale
                </span>
                </Link>
            </li>

            <li>
                <Link onClick={(e) => goto(e, '/salex/launch/manage', 'launch')} href='' className='ui-icon-animate' title='Basic info'>
                <span className='lnk--text  fs-13 font-montserrat'>
                    Manage Presale
                </span>
                </Link>
            </li>

        </ul>

    </div>
</li> */}