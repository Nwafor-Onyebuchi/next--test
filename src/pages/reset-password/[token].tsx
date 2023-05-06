import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Axios from 'axios'
import storage from '../../helpers/storage'
import body from '../../helpers/body'

import Alert from '../../components/partials/Alert'
import Message from '../../components/partials/Message'
import SEO from '../../components/global/SEO';
import DoneModal from '../../components/app/auth/DoneModal';
import { NextPage } from 'next'

const ResetPassword: NextPage<any> = ({ token }: any) => {

    const navigate = useRouter();

    const [step, setStep] = useState<number>(0);
    const [show, setShow] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [pass, setPass] = useState<string>('password');
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

    const toggleShow = (e: any) => {
        if (e) { e.preventDefault() }
        setShow(!show)  
    }

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

    const resetPassword = async (e: any) => {

        if(e) { e.preventDefault() }

        if(!password.new && !password.confirm){
            setAlert({...alert, type: "danger", show:true, message:'All fields are required'})
            setTimeout(()=> {
                 setAlert({...alert, show:false});
            }, 5000)
        }else if(!password.new){
            setAlert({...alert, type: "danger", show:true, message:'Type your new password'})
            setTimeout(()=> {
                 setAlert({...alert, show:false});
            }, 5000)
        }else if(!password.confirm){
            setAlert({...alert, type: "danger", show:true, message:'Type password again'})
            setTimeout(()=> {
                 setAlert({...alert, show:false});
            }, 5000)
        } else if(password.new !== password.confirm){
            setAlert({...alert, type: "danger", show:true, message:'Password does not match'})
            setTimeout(()=> {
                 setAlert({...alert, show:false});
            }, 5000)
        } else{

            setLoading(true);

            await Axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/reset-password/${token}`, { password: password.new }, storage.getConfig())
            .then(async (resp) => {

                if(resp.data.error === false && resp.data.status === 200){
                    toggleShow(e)
                }
 
                setLoading(false);

            }).catch((err) => {
            
                if(err.response.data.errors && err.response.data.errors.length > 0){

                    setAlert({...alert, type: "danger", show:true, message:err.response.data.errors[0]})
                    setTimeout(()=> {
                        setAlert({...alert, show:false});
                    }, 5000)

                }else{
                    setAlert({...alert, type: "danger", show:true, message:err.response.data.message})
                    setTimeout(()=> {
                        setAlert({...alert, show:false});
                    }, 5000)
                }

                setLoading(false);
            
            });

        }
    }

    return (
        <>

            <SEO pageTitle={'Next App - Reset Password'} type="page" />
            
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
                                        {step === 0 && 'Change password'}
                                    </h3>
                                    <p className='brand-auth font-freilight fs-14 mrgb3 ui-text-center'>
                                        {step === 0 && 'Change your account password.'}
                                    </p>

                                    <div className='row'>

                                        <div className='col-md-6 mx-auto'>

                                            <div className='pdl1 pdr1'>

                                                <Alert type={alert.type} show={alert.show} message={alert.message} />

                                                {
                                                    step === 0 &&
                                                    <>

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
                                                                <label className='fs-14 onwhite font-freimedium mrgb0'>New password</label>
                                                                <input
                                                                    defaultValue={''}
                                                                    onChange={(e) => { setPassword({ ...password, new: e.target.value }) }}
                                                                    type={pass} className="form-control fs-14 xl on-black font-frei auth-input brand-auth"
                                                                    placeholder="Type here" autoComplete='off' />
                                                            </div>

                                                        </div>

                                                        <div className='form-group form-row mrgb0'>

                                                            <div className='col password-input lg'>
                                                                <label className='fs-14 onwhite font-freimedium mrgb0'>Type password again</label>
                                                                <input
                                                                    defaultValue={''}
                                                                    onChange={(e) => { setPassword({ ...password, confirm: e.target.value }) }}
                                                                    type={pass} className="form-control fs-14 xl on-black font-frei auth-input brand-auth"
                                                                    placeholder="Type here" autoComplete='off' />
                                                            </div>

                                                        </div>

                                                        <div className='d-flex align-items-center mrgt3'>

                                                            <Link onClick={(e) => resetPassword(e)} href="" className={`w-100 onwhite stretch-md btn lg bgd-yellow ${loading ? 'disabled-lt' : ''}`}>
                                                                <span className='fs-14 font-freibold'>{loading ? <span className='cp-loader white sm'></span> : 'Change Password'}</span>
                                                                { !loading && <span className='fe fe-chevrons-right fs-15 onwhite ui-relative' style={{ top: '2px', left: '5px' }}></span> }
                                                            </Link>

                                                        </div>

                                                    </>
                                                }

                                                <div className='ui-text-center mrgt2 mrgb5'>
                                                        
                                                    <Link href="/login" className='font-frei brand-auth fs-14'>I remember my password</Link>
                                                    
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

            <DoneModal
                isShow={show} 
                closeModal={toggleShow} 
                modalTitle="" 
                flattened={true} 
                slim="slim-lg"
                cover={false}
                data={{
                    title: 'Successful!',
                    message: 'Your password was changed successfully and a email has been sent to confirm. Proceed to login',
                    buttonText: '',
                    action: '/login',
                    actionType: 'action'
                }}
            />
        
        </>
    )
  
}

ResetPassword.getInitialProps = async (ctx: any) => {

    const token = ctx.query.token as string;
    return { token }

}

export default ResetPassword