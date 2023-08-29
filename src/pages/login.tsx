import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Axios from 'axios'
import storage from '../helpers/storage'
import body from '../helpers/body'
import Cookies from 'universal-cookie';

import Alert from '../components/partials/Alert'
import Message from '../components/partials/Message'
import SEO from '../components/global/SEO';
import ForgotModal from '../components/app/auth/ForgotModal'
import BlogContext from '@/context/blog/blogContext'
import { IBlogContext } from '@/utils/types'


const Login = (props: any) => {

    const navigate = useRouter();
    const cookie = new Cookies();

    const exp = new Date(
        Date.now() + 70 * 24 * 60 * 60 * 1000
    )

    const blogContext = useContext<IBlogContext>(BlogContext)

    const [step, setStep] = useState<number>(0);
    const [timer, setTimer] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [qLoading, setQLoading] = useState<boolean>(false);
    const [forgot, setForgot] = useState<boolean>(false)
    const [pass, setPass] = useState<string>('password');
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        code: '',
        callback: `${process.env.NEXT_PUBLIC_BASE_URL}/activate-account`
    });
    const [password, setPassword] = useState({
        new: '',
        confirm: ''
    });
    const [alert, setAlert] = useState({
        type: '',
        show: false,
        message: ''
    });

    useEffect(() => {
        setStep(0)
    }, [])

    const showPass = (e: any) => {
        e.preventDefault();
        if (pass === 'password') {
            setPass('text');
        } else {
            setPass('password');
        }
    }

    const resetStep = (e: any) => {
        if (e) { e.preventDefault(); }
        setStep(0)
    }

    const toggleTimer = () => {

        setTimer(true);

        setTimeout(() => {
            setTimer(false)
        }, 1800000)

    }

    const toggleForgot = (e: any) => {
        if (e) { e.preventDefault() }
        setForgot(!forgot)
        
    }

    const login = async (e: any) => {

        if (e) { e.preventDefault() }

        if (!loginData.email && !loginData.password) {
            setAlert({ ...alert, type: "danger", show: true, message: 'All fields are required' })
            setTimeout(() => {
                setAlert({ ...alert, show: false });
            }, 2500)
        } else if (!loginData.email) {
            setAlert({ ...alert, type: "danger", show: true, message: 'Email is required' })
            setTimeout(() => {
                setAlert({ ...alert, show: false });
            }, 2500)
        } else if (!loginData.password) {
            setAlert({ ...alert, type: "danger", show: true, message: 'Password is required' })
            setTimeout(() => {
                setAlert({ ...alert, show: false });
            }, 2500)
        } else {

            setLoading(true);

            await Axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/login`, { ...loginData }, storage.getConfig())
                .then(async (resp) => {

                    if (resp.data.error === false && resp.data.status === 200) {

                        storage.saveCredentials(resp.data.token, resp.data.data._id);

                        if (resp.data.data.isUser && resp.data.data.isActive) {

                            if (resp.data.data.isSuper || resp.data.data.isAdmin || resp.data.data.isWriter) {

                                if (resp.data.data.isWriter && resp.data.data.passwordType === 'generated') {
                                    setStep(1);
                                } else {

                                    cookie.set("userType", resp.data.data.userType , {
                                        path: '/',
                                        expires: exp
                                    })

                                    cookie.set("token", resp.data.token , {
                                        path: '/',
                                        expires: exp
                                    })

                                    navigate.push('/dashboard');
                                }

                            } else {

                                setAlert({ ...alert, type: "danger", show: true, message: 'Incorrect login details' })
                                setTimeout(() => {
                                    setAlert({ ...alert, show: false });
                                }, 2500)

                            }

                        } else {

                            setAlert({ ...alert, type: "danger", show: true, message: 'Account currently inactive. Contact support' })
                            setTimeout(() => {
                                setAlert({ ...alert, show: false });
                            }, 2500)

                        }


                    }

                    if (resp.data.error === false && resp.data.status === 206) {

                        if (resp.data.errors[0] === 'email verification is required') {

                            setStep(2);
                            toggleTimer();

                        }

                    }

                    setLoading(false);

                }).catch((err) => {

                    if (err.response.data.errors[0] === 'invalid credentials') {

                        setAlert({ ...alert, type: "danger", show: true, message: 'Incorrect email or password' })
                        setTimeout(() => {
                            setAlert({ ...alert, show: false });
                        }, 2500)

                        setLoading(false);

                    } else {

                        if (err.response.data.errors && err.response.data.errors.length > 0) {

                            setAlert({ ...alert, type: "danger", show: true, message: err.response.data.errors[0] })
                            setTimeout(() => {
                                setAlert({ ...alert, show: false });
                            }, 2500)

                        } else {
                            setAlert({ ...alert, type: "danger", show: true, message: err.response.data.message })
                            setTimeout(() => {
                                setAlert({ ...alert, show: false });
                            }, 2500)
                        }

                    }

                    setLoading(false);

                });

        }
    }

    const loginWithCode = async (e: any) => {

        if (e) { e.preventDefault() }

        if (!loginData.code) {
            setAlert({ ...alert, type: "danger", show: true, message: 'Enter verification code' })
            setTimeout(() => {
                setAlert({ ...alert, show: false });
            }, 5000)
        } else {

            setLoading(true);

            await Axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/login`, { ...loginData }, storage.getConfig())
                .then(async (resp) => {

                    if (resp.data.error === false && resp.data.status === 200) {

                        storage.saveCredentials(resp.data.token, resp.data.data._id);

                        if (resp.data.data.isUser && resp.data.data.isActive) {

                            if (resp.data.data.isSuper || resp.data.data.isAdmin || resp.data.data.isWriter) {

                                if (resp.data.data.isWriter && resp.data.data.passwordType === 'generated') {
                                    setStep(1);
                                } else {

                                    if(process.env.REACT_APP_ENV === 'development'){

                                        if(process.env.REACT_APP_ENV === 'development'){

                                            cookie.set("userType", resp.data.data.userType , {
                                                path: '/',
                                                expires: exp
                                            })
    
                                            cookie.set("token", resp.data.token , {
                                                path: '/',
                                                expires: exp
                                            })
    
                                        }
                                        
                                    }

                                    navigate.push('/dashboard');
                                }

                            } else {

                                setAlert({ ...alert, type: "danger", show: true, message: 'Incorrect login details' })
                                setTimeout(() => {
                                    setAlert({ ...alert, show: false });
                                }, 2500)

                            }

                        } else {

                            setAlert({ ...alert, type: "danger", show: true, message: 'Account currently inactive. Contact support' })
                            setTimeout(() => {
                                setAlert({ ...alert, show: false });
                            }, 2500)

                        }

                    }

                    setLoading(false);

                }).catch((err) => {

                    if (err.response.data.errors[0] === 'invalid credentials') {

                        setAlert({ ...alert, type: "danger", show: true, message: 'Incorrect email or password' })
                        setTimeout(() => {
                            setAlert({ ...alert, show: false });
                        }, 2500)

                        setLoading(false);

                    } else {

                        if (err.response.data.errors && err.response.data.errors.length > 0) {

                            setAlert({ ...alert, type: "danger", show: true, message: err.response.data.errors[0] })
                            setTimeout(() => {
                                setAlert({ ...alert, show: false });
                            }, 2500)

                        } else {
                            setAlert({ ...alert, type: "danger", show: true, message: err.response.data.message })
                            setTimeout(() => {
                                setAlert({ ...alert, show: false });
                            }, 2500)
                        }

                    }

                    setLoading(false);

                });

        }
    }

    const changePassword = async (e: any) => {

        if (e) e.preventDefault();

        if (!password.new && !password.confirm) {

            setAlert({ ...alert, type: "danger", show: true, message: 'All fields are required' });
            setTimeout(() => {
                setAlert({ ...alert, show: false });
            }, 2500)

        } else if (!password.new) {

            setAlert({ ...alert, type: "danger", show: true, message: 'Enter a new password' });
            setTimeout(() => {
                setAlert({ ...alert, show: false });
            }, 2500)

        } else if (!password.confirm) {

            setAlert({ ...alert, type: "danger", show: true, message: 'Confirm your password' });
            setTimeout(() => {
                setAlert({ ...alert, show: false });
            }, 2500)

        } else if (password.new !== password.confirm) {

            setAlert({ ...alert, type: "danger", show: true, message: 'Password does not match' });
            setTimeout(() => {
                setAlert({ ...alert, show: false });
            }, 2500)

        } else {

            const data = {
                email: loginData.email,
                password: password.new
            }

            setLoading(true)

            await Axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/force-password`, { ...data }, storage.getConfig())
                .then(async (resp) => {
                    if (resp.data.error === false && resp.data.status === 200) {
                        setStep(3);
                    } else {

                        setAlert({ ...alert, type: "danger", show: true, message: resp.data.errors[0] });
                        setTimeout(() => {
                            setAlert({ ...alert, show: false });
                        }, 2500)

                    }

                    setLoading(false)

                }).catch((err) => {

                    if (err.response.data.errors && err.response.data.errors.length > 0) {

                        setAlert({ ...alert, type: "danger", show: true, message: err.response.data.errors[0] });
                        setTimeout(() => {
                            setAlert({ ...alert, show: false });
                        }, 2500)

                    } else {
                        setAlert({ ...alert, type: "danger", show: true, message: err.response.data.message });
                        setTimeout(() => {
                            setAlert({ ...alert, show: false });
                        }, 2500)
                    }

                    setLoading(false);

                })


        }

    }

    const sendCode = async (e: any, type: any) => {

        if (e) e.preventDefault();

        const data = {
            email: loginData.email
        }

        setQLoading(true);

        await Axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/emails/send-${type}-code`, { ...data }, storage.getConfig())
            .then(async (resp) => {

                if (resp.data.error === false && resp.data.status === 200) {

                    setAlert({ ...alert, type: "success", show: true, message: 'code sent successfully' });
                    setTimeout(() => {
                        setAlert({ ...alert, show: false });
                    }, 5000)

                    toggleTimer()

                }

                setQLoading(false)

            }).catch((err) => {

                if (err.response.data.errors && err.response.data.errors.length > 0) {

                    setAlert({ ...alert, type: "danger", show: true, message: err.response.data.errors[0] });
                    setTimeout(() => {
                        setAlert({ ...alert, show: false });
                    }, 5000)

                } else {
                    setAlert({ ...alert, type: "danger", show: true, message: err.response.data.message });
                    setTimeout(() => {
                        setAlert({ ...alert, show: false });
                    }, 5000)
                }

                setQLoading(false);

            })

    }

    return (
        <>
            <SEO pageTitle={'Concreap - Login'} type="page" />

            <section className='split-screen auth-screen hero hero-home bg-brand-black ui-full-bg-norm' style={{ backgroundImage: `url("../../../images/assets/bg@auth-01.jpg")` }}>

                <div className='hero-inner'>

                    <div className='row no-gutters wp-100'>

                        <div className='col-md-7'>

                            <form onSubmit={(e) => { e.preventDefault() }} className='form box-heigthed cont-area'>

                                <div className='split-screen-mobile'>

                                    <div className='ui-text-center'>
                                        <Link href="/" className="navbar-brand logo"><img src="../../../images/assets/logo-white.svg" alt="" style={{ width: 188 }} /></Link>
                                    </div>

                                    <h3 className='onwhite font-freilight fs-25 mrgb mrgt2 ui-text-center'>
                                        {step === 0 && 'Welcome back!'}
                                        {step === 1 && 'Change password'}
                                        {step === 2 && 'Verify your account'}
                                    </h3>
                                    <p className='brand-auth font-freilight fs-14 mrgb3 ui-text-center'>
                                        {step === 0 && 'Login to your admin account'}
                                        {step === 1 && 'Change your password.'}
                                        {step === 2 && 'Verify your account'}
                                    </p>

                                    <div className='row'>

                                        <div className='col-md-6 mx-auto'>

                                            <div className='pdl1 pdr1'>

                                                <Alert type={alert.type} show={alert.show} message={alert.message} />

                                                {
                                                    step === 0 &&
                                                    <>

                                                        <div className='form-group form-row mrgb'>

                                                            <div className='col'>
                                                                <label className='fs-14 onwhite font-freimedium mrgb0'>Your email</label>
                                                                <input
                                                                    defaultValue={''}
                                                                    onChange={(e) => { setLoginData({ ...loginData, email: e.target.value }) }}
                                                                    type="email" className="form-control fs-14 xl on-black font-frei auth-input brand-auth"
                                                                    placeholder="Ex. you@example.com" autoComplete='off' />
                                                            </div>

                                                        </div>

                                                        <div className='form-group form-row mrgb0'>

                                                            <div className='col password-input lg'>
                                                                <Link onClick={(e) => showPass(e)} href="" className="eye shift">
                                                                    <span className={`cp-icon ${pass === 'password' ? 'cp-eye' : 'cp-eye-break active'}`}>
                                                                        <i className='path1 fs-18'></i>
                                                                        <i className='path2 fs-18'></i>
                                                                        {
                                                                            pass === 'text' &&
                                                                            <>
                                                                                <i className='path3 fs-18'></i>
                                                                                <i className='path4 fs-18'></i>
                                                                            </>
                                                                        }
                                                                    </span>
                                                                </Link>
                                                                <label className='fs-14 onwhite font-freimedium mrgb0'>Your password</label>
                                                                <input
                                                                    defaultValue={''}
                                                                    onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }) }}
                                                                    type={pass} className="form-control fs-14 xl on-black font-frei auth-input brand-auth"
                                                                    placeholder="Type here" autoComplete='off' />
                                                            </div>

                                                        </div>

                                                        <div className='d-flex align-items-center mrgt3'>

                                                            <Link onClick={(e) => login(e)} href="" className={`w-100 onwhite stretch-md btn lg bgd-yellow ${loading ? 'disabled-lt' : ''}`}>
                                                                <span className='fs-14 font-freibold'>{loading ? <span className='cp-loader white sm'></span> : 'Login'}</span>
                                                                { !loading && <span className='fe fe-chevrons-right fs-15 onwhite ui-relative' style={{ top: '2px', left: '5px' }}></span> }
                                                            </Link>

                                                        </div>

                                                    </>
                                                }

                                                {
                                                    step === 1 &&
                                                    <>
                                                        <div className='form-group form-row mrgb'>

                                                            <div className='col password-input'>

                                                                <Link onClick={(e) => showPass(e)} href="" className="eye shift">
                                                                    <span className={`cp-icon ${pass === 'password' ? 'cp-eye' : 'cp-eye-break active'}`}>
                                                                        <i className='path1 fs-18'></i>
                                                                        <i className='path2 fs-18'></i>
                                                                        {
                                                                            pass === 'text' &&
                                                                            <>
                                                                                <i className='path3 fs-18'></i>
                                                                                <i className='path4 fs-18'></i>
                                                                            </>
                                                                        }
                                                                    </span>
                                                                </Link>

                                                                <label className='fs-14 onwhite font-freimedium mrgb0'>New password</label>

                                                                <input
                                                                    defaultValue={''}
                                                                    onChange={(e) => { setPassword({ ...password, confirm: e.target.value }) }}
                                                                    type={pass} className="form-control fs-14 xl on-black font-frei auth-input"
                                                                    placeholder="Choose password" autoComplete='off' />

                                                            </div>

                                                        </div>

                                                        <div className='form-group form-row mrgb0'>

                                                            <div className='col password-input'>

                                                                <Link onClick={(e) => showPass(e)} href="" className="eye shift">
                                                                    <span className={`cp-icon ${pass === 'password' ? 'cp-eye' : 'cp-eye-break active'}`}>
                                                                        <i className='path1 fs-18'></i>
                                                                        <i className='path2 fs-18'></i>
                                                                        {
                                                                            pass === 'text' &&
                                                                            <>
                                                                                <i className='path3 fs-18'></i>
                                                                                <i className='path4 fs-18'></i>
                                                                            </>
                                                                        }
                                                                    </span>
                                                                </Link>

                                                                <label className='fs-14 onwhite font-freimedium mrgb0'>Confirm password</label>

                                                                <input
                                                                    defaultValue={''}
                                                                    onChange={(e) => { setPassword({ ...password, new: e.target.value }) }}
                                                                    type={pass} className="form-control fs-14 xl on-black font-frei auth-input"
                                                                    placeholder="Type password again" autoComplete='off' />
                                                            </div>

                                                        </div>

                                                        <div className='mrgt3'>

                                                            <Link onClick={(e) => changePassword(e)} href="" className={`w-100 onwhite stretch-md btn lg bgd-yellow ${loading ? 'disabled-lt' : ''}`}>
                                                                <span className='fs-14 font-freibold'>{loading ? <span className='chk-loader white sm'></span> : 'Save Password'}</span>
                                                                <span className='fe fe-chevrons-right fs-15 onwhite ui-relative' style={{ top: '2px', left: '5px' }}></span>
                                                            </Link>

                                                        </div>

                                                    </>
                                                }

                                                {
                                                    step === 2 &&
                                                    <>

                                                        <p className='font-frei onwhite fs-14 ui-line-height ui-text-center mrgb2'>A 6-digit code has been sent to your email. Please, enter the code below to verify your account.</p>

                                                        <div className='form-row mrgb0'>

                                                            <div className='col'>
                                                                <label className='fs-14 onwhite font-freimedium mrgb0'>Verification code</label>
                                                                <input
                                                                    defaultValue={''}
                                                                    onChange={(e) => { setLoginData({ ...loginData, code: e.target.value }) }}
                                                                    type="text" className="form-control fs-14 xl on-black font-frei auth-input"
                                                                    placeholder="000000" autoComplete='off' />
                                                            </div>

                                                        </div>

                                                        <div className='mrgt3'>

                                                            <Link onClick={(e) => loginWithCode(e)} href="" className={`w-100 onwhite stretch-md btn lg bgd-yellow ${loading ? 'disabled-lt' : ''}`}>
                                                                <span className='fs-14 font-freibold'>{loading ? <span className='chk-loader white sm'></span> : 'Verify Account'}</span>
                                                                <span className='fe fe-chevrons-right fs-15 onwhite ui-relative' style={{ top: '2px', left: '5px' }}></span>
                                                            </Link>

                                                        </div>

                                                    </>
                                                }

                                                {
                                                    step === 3 &&
                                                    <>
                                                        <div className='ui-separate-small mrgb1'></div>
                                                        <Message
                                                            title="Successful!"
                                                            message="Your password has been changed successfully"
                                                            action={resetStep}
                                                            status="success"
                                                            lottieSize={200}
                                                            loop={false}
                                                            actionType="action"
                                                            buttonText='Continue'
                                                            setBg={false}
                                                            bgColor={'#fefefe'}
                                                            buttonPosition={'inside'}
                                                            slim={false}
                                                        />
                                                        <div className='ui-separate-small'></div>

                                                    </>
                                                }

                                                <div className='ui-text-center mrgt2 mrgb5'>
                                                        
                                                    {
                                                        step === 0 && 
                                                        <Link onClick={(e) => toggleForgot(e)} href="" className='font-frei brand-auth fs-14'>Can't login?</Link>
                                                    }

                                                    {
                                                        step === 1 && 
                                                        <Link onClick={(e) => { e.preventDefault(); setStep(0) }} href="" className='font-frei brand-auth fs-14'>Do this later</Link>
                                                    }
                                                    {
                                                        step === 2 && 
                                                        <Link onClick={(e) => { e.preventDefault(); setStep(0) }} href="" className='font-frei brand-auth fs-14'>Cancel</Link>
                                                    }
                                                    
                                                </div>

                                                <div className='ui-text-center mrgb1'>
                                                    <span className='font-frei brand-auth fs-14'>Any issues? Contact hello@concreap.com</span>
                                                </div>

                                            </div>

                                        </div>
                                    </div>

                                </div>

                            </form>

                        </div>

                        <div className="col-md-5">

                        </div>

                    </div>

                </div>

            </section>

            <ForgotModal
                isShow={forgot} 
                closeModal={toggleForgot} 
                modalTitle="Forgot Password?" 
                flattened={true} 
                slim="slim-lg"
            />
        </>

    )

}

export default Login