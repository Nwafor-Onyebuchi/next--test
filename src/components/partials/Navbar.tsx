import React, {useState, useEffect, useContext} from 'react'
import Link from 'next/link'
import body from '../../helpers/body'
import { INavbarProps, IUserContext } from '../../utils/types'

import LaunchModal from '../app/auth/LaunchModal'
import '../../helpers/jquery'

const Navbar = ({ isFixed, backgroundColor, display }: Partial<INavbarProps>) => {
    const [show, setShow] = useState<boolean>(false)

    useEffect(() => {

        body.fixNav()

    }, [])

    const toggleShow = (e: any) => {

        if(e) { e.preventDefault() }

        setShow(!show)
    }

    return (
        <>
            <header id="header" className={`header header-nav ${isFixed && isFixed === true ? 'stick' : 'bg-white blocked flat'}`} style={{ backgroundColor: backgroundColor ? backgroundColor : '' }}>
                <div className="nav-body">
                
                    <div className={`navigation ${display}`}>
                        <div className="container-fluid">

                            <nav className="main-nav navbar navbar-right navbar-expand-md">

                                        <Link href="/" className="navbar-brand logo"><img src="../../../images/assets/test_logo.png" alt="logo" /></Link>
                                    
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
                                               
                                            </ul>

                                            {/* Right */}
                                            <ul className="nav navbar-nav right-nav ml-auto">
                                            <li className="nav-item link"><Link onClick={(e) => toggleShow(e)} className="nav-link onwhite font-freimedium fs-14 tighten-text" href="/">Creon Pass</Link></li>
                                                <li className="nav-item link"><Link href="" onClick={(e) => toggleShow(e)} className="nav-link onwhite font-freimedium fs-14 tighten-text">Token</Link></li>
                                                <li className="nav-item link"><Link href="" onClick={(e) => toggleShow(e)} className="nav-link onwhite font-freimedium fs-14 tighten-text">AI Revenue</Link></li>
                                                <li className="nav-item link"><Link href="" onClick={(e) => toggleShow(e)} className="nav-link onwhite font-freimedium fs-14 tighten-text">AI Launchpad</Link></li>
                                            
                                                <li className="nav-item">
                                                    <Link onClick={(e) => toggleShow(e)} className="nav-link nav-btn onwhite font-freibold btn md fs-14" href="">Connect</Link>
                                                </li>
                                            </ul>
                                            
                                        </div>

                                 
                                

                                

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