import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Axios from 'axios'
import storage from '../../helpers/storage'
import body from '../../helpers/body'

import Alert from '../../components/partials/Alert'
import Message from '../../components/partials/Message'
import SEO from '../../components/global/SEO';
import { NextPage } from 'next'

const Invite: NextPage<any> = ({ token }: any) => {

    const navigate = useRouter();

    const [step, SetStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pass, setPass] = useState('password');
    const [password, setPassword] = useState({
        new: '',
        confirm: '',
        id: '',
        email: ''
    });
    const [alert, setAlert] = useState({
        type: '',
        show: false,
        message: ''
    });

    useEffect(() => {
        SetStep(0)
    }, [])

    const showPass = (e: any) => {
        e.preventDefault();
        if(pass === 'password'){
            setPass('text');
        }else{
            setPass('password');
        }
    }
    
    const fireInvite = async (e: any, t: string) => {

        if(e) { e.preventDefault() }

        const data= {
            token: token,
            type: t
        }

        setLoading(true);

        await Axios.put(`${process.env.NEXT_PUBLIC_AUTH_URL}/users/accept-invite`, { ...data }, storage.getConfig())
        .then(async (resp) => {

            if(resp.data.error === false && resp.data.status === 200){
                setPassword({ ...password, id: resp.data.data._id, email: resp.data.data.email })
                SetStep(1);
            }

            setLoading(false);

        }).catch((err) => {
        
            if(err.response.data.errors && err.response.data.errors.length > 0){

                setAlert({...alert, type: "danger", show:true, message:err.response.data.errors[0]})
                setTimeout(()=> {
                    setAlert({...alert, show:false});
                }, 2500)

            }else{
                setAlert({...alert, type: "danger", show:true, message:err.response.data.message})
                setTimeout(()=> {
                    setAlert({...alert, show:false});
                }, 2500)
            }

            setLoading(false);
        
        });

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
                email: password.email,
                password: password.new
            }

            setLoading(true)

            await Axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/force-password`, { ...data }, storage.getConfig())
                .then(async (resp) => {
                    if (resp.data.error === false && resp.data.status === 200) {
                        SetStep(2);
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

    return (
        <>

            <SEO pageTitle={'Concreap - Invite'} type="page" />
            
            <section className='split-screen auth-screen hero height-full bg-brand-black ui-full-bg-norm' style={{ backgroundImage: `url("../../../images/assets/bg@hero-03.jpg")` }}>

                <div className='container-fluid'>

                    <div className='ui-text-center pdt4'>
                        <Link href="/" className="navbar-brand logo"><img src="../../../images/assets/logo-white.svg" alt="" style={{ width: 188 }} /></Link>
                    </div>

                    <div className='row no-gutters wp-100'>

                       <div className='col-md-7 mx-auto'>

                            <form onSubmit={(e) => { e.preventDefault() }} className='form box-heigthed cont-area'>

                                <h3 className='onwhite font-freilight fs-25 mrgb mrgt2 ui-text-center'>
                                    { step === 0 && 'Concreap invite' }
                                    { step === 1 && 'Change your password' }
                                </h3>
                                <p className='brand-auth font-freilight fs-14 mrgb3 ui-text-center'>
                                    {step === 0 && 'You\'ve been invited to Concreap. Follow the instructions below'}
                                    {step === 1 && 'You\'re required to change your password'}
                                </p>

                                <div className='row'>

                                    {
                                        step === 0 &&
                                        <>
                                            <div className='col-md-9 mx-auto'>

                                                <div className='invite-box ui-line-height'>

                                                    <Alert type={alert.type} show={alert.show} message={alert.message} />

                                                    <h3 className='mrgb1 font-freimedium fs-16 onwhite mrgt'>Hello Champ!</h3>

                                                    <p className='mrgb0 onwhite font-frei fs-14'>
                                                        Concreap has invited you to join them their platform as a WRITER.
                                                        You can accept invitation by clicking the button below or click the decline button to decline the invite. Invitation expires in 24 hours
                                                    </p>

                                                    <div className='ui-group-button mrgt3 mrgb1'>

                                                        <Link onClick={(e) => fireInvite(e, 'declined')} href="" className={`onwhite btn sm bgd-disable ${loading ? 'disabled-lt' : ''}`}>
                                                            {
                                                                loading ? <span className='cp-loader white sm'></span> : <span className='fs-12 font-freibold'>Decline</span>
                                                            }
                                                        </Link>

                                                        <Link onClick={(e) => fireInvite(e, 'accepted')} href="" className={`onwhite btn sm bgd-yellow ${loading ? 'disabled-lt' : ''}`}>
                                                            {
                                                                loading ? <span className='cp-loader white sm'></span> : <span className='fs-12 font-freibold'>Accept Invite</span>
                                                            }
                                                        </Link>

                                                    </div>

                                                </div>

                                            </div>
                                        </>
                                    }

                                    {
                                        step === 1 &&
                                        <>
                                            <div className='col-md-6 mx-auto'>

                                                <Alert type={alert.type} show={alert.show} message={alert.message} />

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
                                                            type={pass} className="form-control fs-14 xl font-frei onwhite auth-input"
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
                                                            type={pass} className="form-control fs-14 xl onwhite font-frei auth-input"
                                                            placeholder="Type password again" autoComplete='off' />
                                                    </div>

                                                </div>

                                                <div className='mrgt3'>

                                                    <Link onClick={(e) => changePassword(e)} href="" className={`w-100 onwhite stretch-md btn lg bgd-yellow ${loading ? 'disabled-lt' : ''}`}>
                                                        <span className='fs-14 font-freibold'>{loading ? <span className='chk-loader white sm'></span> : 'Change Password'}</span>
                                                    </Link>

                                                </div>

                                            </div>
                                        </>
                                    }

                                    {
                                        step === 2 &&
                                        <>
                                            <div className='col-md-6 mx-auto'>
                                                <div className='ui-separate-small mrgb1'></div>
                                                <Message
                                                    title="Successful!"
                                                    message="Your password has been changed successfully"
                                                    action={'/login'}
                                                    status="success"
                                                    lottieSize={200}
                                                    loop={false}
                                                    actionType="url"
                                                    buttonText='Continue'
                                                    setBg={false}
                                                    bgColor={'#fefefe'}
                                                    buttonPosition={'inside'}
                                                    slim={false}
                                                />
                                                <div className='ui-separate-small'></div>
                                            </div>

                                        </>
                                    }

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </section>
        
        </>
    )
  
}

Invite.getInitialProps = async (ctx: any) => {

    const token = ctx.query.token as string;
    return { token }

}

export default Invite