import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Axios from 'axios'
import storage from '../../helpers/storage'

import Alert from '../../components/partials/Alert'
import Message from '../../components/partials/Message'
import SEO from '../../components/global/SEO';
import { NextPage } from 'next'

const ActivateAccount: NextPage<any> = ({ token }: any) => {

    const navigate = useRouter();

    const [step, SetStep] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState({
        type: '',
        show: false,
        message: ''
    });

    useEffect(() => {

        SetStep(0)
        activateAccount(null)

    }, [])

    const activateAccount = async (e: any) => {

        if(e) { e.preventDefault() }

        setLoading(true);

        await Axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/activate-account/${token}`, { }, storage.getConfig())
        .then(async (resp) => {

            if(resp.data.error === false && resp.data.status === 200){
                SetStep(1);
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

    return (
        <>
            <SEO pageTitle={'Next App - Activate Account'} type="page" />

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
                                        {step === 0 && 'Verify your account'}
                                    </h3>
                                    <p className='brand-auth font-freilight fs-14 mrgb3 ui-text-center'>
                                        {step === 0 && 'Please wait while we activate your account'}
                                    </p>

                                    <div className='row'>

                                        <div className='col-md-6 mx-auto'>

                                            <div className='pdl1 pdr1'>

                                                <Alert type={alert.type} show={alert.show} message={alert.message} />

                                                {
                                                    step === 0 &&
                                                    <>

                                                        <div className="empty-box md mrgt0" style={{ backgroundColor: '#0d0b2b' }}>

                                                            <div className="ui-text-center">
                                                                <div className="row">
                                                                    <div className="col-md-10 mx-auto ui-line-height">
                                                                        {
                                                                            loading && <span className='cp-loader md white'></span>
                                                                        }
                                                                        {
                                                                            !loading && <p className='fs-14 font-frei mrgb0 ui-text-center onwhite'>Activation token invalid</p>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>

                                                    </>
                                                }

                                                {
                                                    step === 1 &&
                                                    <>

                                                        <div className='mrgt mrgb2'>

                                                            <Message
                                                                title={'Successful!'}
                                                                displayTitle={true}
                                                                message={'Your email was successfully verified'}
                                                                action={'/login'}
                                                                status="success"
                                                                lottieSize={200}
                                                                loop={false}
                                                                actionType={'route'}
                                                                buttonText='Continue'
                                                                setBg={true}
                                                                bgColor={'#0d0b2b'}
                                                                buttonPosition={'inside'}
                                                                slim={false}
                                                            />

                                                        </div>

                                                    </>
                                                }

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

        </>
    )
  
}

ActivateAccount.getInitialProps = async (ctx: any) => {

    const token = ctx.query.token as string;
    return { token }

}

export default ActivateAccount