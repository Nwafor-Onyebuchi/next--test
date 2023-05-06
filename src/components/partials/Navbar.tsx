import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Axios from 'axios';
import storage from '../../helpers/storage'
import body from '../../helpers/body'
import Cookies from 'universal-cookie';
import { INavbarProps, IUserContext } from '../../utils/types'
import UserContext from '@/context/user/userContext';
import LaunchModal from '../app/auth/LaunchModal'

const Navbar = ({ isFixed, backgroundColor, doScroll, display }: Partial<INavbarProps>) => {

    const cookie = new Cookies()

    const [showNotify, setShowNotify] = useState(false);
    const navigate = useRouter();
    const [show, setShow] = useState<boolean>(false)
    const userContext = useContext<IUserContext>(UserContext)

    useEffect(() => {

        body.fixNav()

    }, [])

    const toggleShow = (e: any) => {

        if(e) { e.preventDefault() }

        setShow(!show)
    }

    const logout = async (e: any = null) => {

        if (e) e.preventDefault();

        storage.clearAuth();
        localStorage.clear();
        // remove cookies
        cookie.remove('token');
        cookie.remove('userType');

        navigate.push('/login');
        await Axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/logout`,{}, storage.getConfig());
        
    }

    return (
        <>
            <header id="header" className={`header header-nav ${isFixed && isFixed === true ? 'stick' : 'bg-white blocked flat'}`} style={{ backgroundColor: backgroundColor ? backgroundColor : '' }}>
                <div className="nav-body">
                
                    <div className={`navigation ${display}`}>
                        <div className="container-fluid">

                            <nav className="main-nav navbar navbar-right navbar-expand-md">

                                {
                                    !userContext.isLoggedIn() &&
                                    <>

                                        <Link href="/" className="navbar-brand logo"><img src="../../../images/assets/logo-white.svg" alt="" /></Link>
                                    
                                        <div className="ml-auto d-flex align-items-center ui-hide">
                                            <Link href="" className="sd-menu md-menu onblack"><span className={`fe fe-menu fs-30`}></span></Link>
                                        </div>

                                        <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbar-collapse">
                                            <span className="menu_toggle">
                                            <span className="hamburger">
                                                <span />
                                                <span />
                                                <span />
                                            </span>
                                            <span className="hamburger-cross">
                                                <span />
                                                <span />
                                            </span>
                                            </span>
                                        </button>
                                    
                                        <div id="navbar-collapse" className="navbar-collapse collapse">
                                            {/* left */}
                                            <ul className="nav left-nav navbar-nav pdl2">
                                                {/* <li className="nav-item link"><Link onClick={(e) => { body.scrollToElem('footer') }} className="nav-link onwhite font-freimedium fs-14 tighten-text" href="/">Schools</Link></li> */}
                                                <li className="nav-item link"><Link onClick={(e) => toggleShow(e)} className="nav-link onwhite font-freimedium fs-14 tighten-text" href="/">Schools</Link></li>
                                                <li className="nav-item link"><Link href="" onClick={(e) => toggleShow(e)} className="nav-link onwhite font-freimedium fs-14 tighten-text">Journey</Link></li>
                                                <li className="nav-item link"><Link href="" onClick={(e) => toggleShow(e)} className="nav-link onwhite font-freimedium fs-14 tighten-text">About</Link></li>
                                                <li className="nav-item link"><Link href="" onClick={(e) => toggleShow(e)} className="nav-link onwhite font-freimedium fs-14 tighten-text">Programs</Link></li>
                                            </ul>

                                            {/* Right */}
                                            <ul className="nav navbar-nav right-nav ml-auto">
                                                <li className="nav-item link"><Link href="/blog" className="nav-link onwhite font-freimedium fs-14 tighten-text">Blog</Link></li>
                                                {/* <li className="nav-item link"><Link href="/login" onClick={(e) => { body.scrollToElem('footer') }} className="nav-link onwhite font-freimedium fs-14 tighten-text">Login</Link></li> */}
                                                <li className="nav-item">
                                                    <Link onClick={(e) => toggleShow(e)} className="nav-link nav-btn onwhite font-freibold btn md bgd-yellow fs-14" href="">Get Started</Link>
                                                </li>
                                            </ul>
                                            
                                        </div>

                                    </>
                                }

                                {
                                    userContext.isLoggedIn() &&
                                    <>

                                        <Link href="/" className="navbar-brand logo"><img src="../../../images/assets/logo-white.svg" alt="" /></Link>
                                    
                                        <div className="ml-auto d-flex align-items-center ui-hide">
                                            <Link href="" className="sd-menu md-menu onblack"><span className={`fe fe-menu fs-30`}></span></Link>
                                        </div>

                                        <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbar-collapse">
                                            <span className="menu_toggle">
                                            <span className="hamburger">
                                                <span />
                                                <span />
                                                <span />
                                            </span>
                                            <span className="hamburger-cross">
                                                <span />
                                                <span />
                                            </span>
                                            </span>
                                        </button>
                                    
                                        <div id="navbar-collapse" className="navbar-collapse collapse">
                                            {/* left */}
                                            <ul className="nav left-nav navbar-nav pdl2">
                                                <li className="nav-item link"><Link onClick={(e) => toggleShow(e)} className="nav-link onwhite font-freimedium fs-14 tighten-text" href="/">Schools</Link></li>
                                                <li className="nav-item link"><Link href="" onClick={(e) => toggleShow(e)} className="nav-link onwhite font-freimedium fs-14 tighten-text">Journey</Link></li>
                                                <li className="nav-item link"><Link href="" onClick={(e) => toggleShow(e)} className="nav-link onwhite font-freimedium fs-14 tighten-text">About</Link></li>
                                                <li className="nav-item link"><Link href="" onClick={(e) => toggleShow(e)} className="nav-link onwhite font-freimedium fs-14 tighten-text">Programs</Link></li>
                                            </ul>

                                            {/* Right */}
                                            <ul className="nav navbar-nav right-nav ml-auto">
                                                <li className="nav-item link"><Link href="/blog" className="nav-link onwhite font-freimedium fs-14 tighten-text">Blog</Link></li>
                                                <li className="nav-item link"><Link href="" onClick={(e) => logout(e)} className="nav-link onwhite font-freimedium fs-14 tighten-text">Logout</Link></li>
                                                <li className="nav-item">
                                                    <Link href="/dashboard" className="nav-link nav-btn onwhite font-freibold btn md bgd-yellow fs-14">Dashboard</Link>
                                                </li>
                                            </ul>
                                            
                                        </div>

                                    </>
                                }

                            </nav>

                        </div>
                    </div>
                    
                </div>
            </header>

            <LaunchModal
                isShow={show} 
                closeModal={toggleShow} 
                modalTitle="Coming Soon!" 
                flattened={false} 
                slim="slim-mlg"
            />

        </>
    )
  
}

export default Navbar