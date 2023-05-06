import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Axios from 'axios'
import storage from '../helpers/storage'
import body from '../helpers/body'

import Alert from '../components/partials/Alert'
import Message from '../components/partials/Message'
import DropDown from '../components/partials/DropDown';
import SEO from '../components/global/SEO'
import ResourceContext from '@/context/resource/resourceContext'
import { IResourceContext } from '@/utils/types'
import { NextPage } from 'next'


const Register: NextPage<any> = (props: any) => {

    const resourceContext = useContext<IResourceContext>(ResourceContext)

    const [step, SetStep] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [pass, setPass] = useState<string>('password');
    const [selected, setSelected] = useState<boolean>(false);
    const [regData, setRegData] = useState({
        email: '',
        phoneNumber: '',
        password: '',
        phoneCode: '+234',
        callback: `${process.env.NEXT_PUBLIC_BASE_URL}`,
        account: 'store'
    })

    const [alert, setAlert] = useState({
        type: '',
        show: false,
        message: ''
    });

    useEffect(() => {

        SetStep(0);
        resourceContext.getIpAddress()
        resourceContext.getCountries(9999);

    }, [])

    const getOptions = () => {

        const formatted = resourceContext.countries.filter((i) => (i.phoneCode && i.flag !== ''))

        const cp = formatted.map((i) => {
            let c = {
                value: i._id,
                label: i.name,
                left:  i.phoneCode,
                image: i.flag ? i.flag : '../../../../images/assets/c-avatar.png'
            }
            return c;
        })
       
        return cp;
       
    }

    const setDefault = (code: string) => {

            if(!resourceContext.loading && resourceContext.countries.length > 0){

                const ct = resourceContext.countries.find((i) => i.code2 === code);
                const fm = {
                    value: ct._id,
                    label: ct.name,
                    left:  ct.phoneCode,
                    image: ct.flag ? ct.flag : '../../../images/assets/c-avatar.svg'
                }

                if(fm){
                    return fm;
                }else{
                    return 1
                }

            }else{
                return 1;
            }

            
    }
    
    const getSelected = (val: any) => {

       setRegData({...regData, phoneCode: val.left})
       setSelected(true);

    }

    const showPass = (e: any) => {
        e.preventDefault();
        if(pass === 'password'){
            setPass('text');
        }else{
            setPass('password');
        }
    }

    const resetStep = (e: any) => {
        if(e) { e.preventDefault(); }
        SetStep(0)
    } 

    const register = async (e: any) => {
        if(e) e.preventDefault()
        

        // set to the defaut config
        if(!selected){
            
            const cty = setDefault('NG');

            if(cty){
                regData.phoneCode = cty !== 1 ? cty.left : '+234';
            } else{
                regData.phoneCode = '+234'
            }

        }

        if(!regData.phoneNumber && !regData.phoneCode && !regData.email && !regData.password){
            setAlert({...alert, type: "danger", show:true, message:'All fields are required'})
            setTimeout(()=> {
                 setAlert({...alert, show:false});
            }, 5000)
        }else if (!regData.email) {
            setAlert({...alert, type: "danger", show:true, message:'Please enter your email'})
            setTimeout(()=> {
                 setAlert({...alert, show:false});
            }, 5000)
        }else if (!regData.phoneNumber) {
            setAlert({...alert, type: "danger", show:true, message:'Phone number is required'})
            setTimeout(()=> {
                 setAlert({...alert, show:false});
            }, 5000)
        }else  if (!regData.phoneCode) {
            setAlert({...alert, type: "danger", show:true, message:'Phone code is required'})
            setTimeout(()=> {
                 setAlert({...alert, show:false});
            }, 5000)
        } else  if (!regData.password) {
            setAlert({...alert, type: "danger", show:true, message:'Choose a password'})
            setTimeout(()=> {
                 setAlert({...alert, show:false});
            }, 5000)
        } else {
            setLoading(true);

            await Axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/register`,{...regData},  storage.getConfig())
            .then((resp) => {
                if(resp.data.error === false && resp.data.status === 200){

                    SetStep(1);
                    storage.delete('sub', true);
                }
                setLoading(false);
            }).catch((err) => {

                if(err.response.data.errors[0] === 'phone number already exist'){
                    setAlert({...alert, type: "danger", show:true, message:'Phone number is already rgistered'})
                    setTimeout(()=> {
                        setAlert({...alert, show:false});
                    }, 5000) 
                }else if(err.response.data.errors[0] === 'password must contain at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 special character and 1 number'){
                    setAlert({...alert, type: "danger", show:true, message:'Password must have 8 charaters, 1 lowercase and 1 uppercase letters, 1 number and 1 special character'})
                    setTimeout(()=> {
                        setAlert({...alert, show:false});
                    }, 5000)
                } else {
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
                }
                
                setLoading(false);
            })
        }
    }

    return (

        <>
            <SEO pageTitle={'React App - Register'} type="page" />

            <section className='split-screen auth-screen hero hero-home'>

                <div className='hero-inner'>

                    <div className='row no-gutters wp-100'>

                        <div className='col-md-4 ui-hide-mobile-only'>

                            <div className='box-heigthed bg-brand-greendark ui-full-bg-norm ui-absolute ui-overflow-hidden' style={{ backgroundImage: `url("../../../images/assets/bg@splt-screen.svg")` }}>

                                <div className='split-text'>
                                    <p className='mrgb2'>
                                       
                                        <span className='font-modernbold fs-35 onwhite'>Amazing store </span>
                                        <span className='font-modernbold fs-35' style={{ color: '#9FD3DE' }}>experience </span>
                                        <span className='font-modernbold fs-35 onwhite'>for your customers</span>
                                    </p>
                                    <div className='split-line'>
                                        <span className='long'></span>
                                        <span className='short'></span>
                                    </div>
                                </div>

                                <div className='tp-image ui-absolute'>
                                    <img src='../../../images/assets/img@tpi-02.png' alt="tp-blob" className='tp-02' />
                                </div>

                            </div>

                        </div>

                        <div className='col-md-8'>

                            <form onSubmit={(e) => { e.preventDefault() }} className='form box-heigthed bg-white cont-area'>

                                <div className='split-screen-mobile'>

                                    <div className='ui-separate ui-hide-mobile-only'></div>
                                    <div className='ui-separate-small ui-show-mobile-only'></div>
                                    { step > 0 ? <div className='ui-separate'></div> : <div className='ui-separate-small'></div> }

                                    <div className='ui-text-center'><img src="../../../images/assets/logo.svg" width={'200px'} alt="logo" /></div>
                                    <h3 className='brand-coal font-modernbold fs-18 mrgb2 mrgt3 ui-text-center'>
                                        { step === 0 && 'Create a business account' }
                                        { step === 1 && 'Create a business account' }
                                    </h3>

                                    <div className='row'>
                                        <div className='col-md-5 mx-auto'>

                                            <div className='pdl1 pdr1'>

                                                {
                                                    step === 0 &&
                                                    <>
                                                    
                                                        <Alert type={alert.type} show={alert.show} message={alert.message} />

                                                        <div className='form-group form-row mrgb0'>

                                                            <div className='col'>
                                                                <label className='fs-14 brand-coal font-modern mrgb0'>Email address</label>
                                                                <input 
                                                                defaultValue={''}
                                                                onChange={(e) => { setRegData({ ...regData, email: e.target.value }) }}
                                                                type="email" className="form-control fs-14 lg on-black font-matterregular" 
                                                                placeholder="Your email" autoComplete='off' />
                                                            </div>

                                                        </div>

                                                        <div className='form-group form-row mrgb0'>

                                                            <div className='col'>
                                                                <label className='fs-14 brand-coal font-modern mrgb0'>Your phone number</label>

                                                                <div className='boundless-input'>
                                                                    <DropDown 
                                                                    options={getOptions} 
                                                                    selected={getSelected} 
                                                                    className="auth-drop boundless font-modern"
                                                                    placeholder={``} 
                                                                    search={true}
                                                                    displayImage={true}
                                                                    displayControlLeft={true}
                                                                    displayOptionLeft={false}
                                                                    displayOptionLabel={true}
                                                                    displayLabel={false}
                                                                    defaultValue={setDefault('NG')}
                                                                    />
                                                                    <div className='div'></div>
                                                                    <input 
                                                                    defaultValue={''}
                                                                    onChange={(e) => { setRegData({ ...regData, phoneNumber: e.target.value }) }}
                                                                    type="text" className="form-control fs-14 lg on-black font-modern" 
                                                                    placeholder="080xxxxxxxx" autoComplete='off' />
                                                                </div>
                                                                
                                                            </div>

                                                        </div>

                                                        <div className='form-group form-row mrgb0'>

                                                            <div className='col password-input lg'>
                                                                <Link onClick={(e) => showPass(e)} href="" className="eye shift">
                                                                    <span className="checkaam-icon md"><img src={`../../../images/icons/${pass === "password" ? 'eye' : 'eye-break'}.svg`} alt="icon eye" /></span>
                                                                </Link>
                                                                <label className='fs-14 brand-coal font-modern mrgb0'>Your password</label>
                                                                <input 
                                                                defaultValue={''}
                                                                onChange={(e) => { setRegData({ ...regData, password: e.target.value }) }}
                                                                type={pass} className="form-control fs-14 lg on-black font-modern" 
                                                                placeholder="Password" autoComplete='off' />
                                                            </div>

                                                        </div>

                                                        <div className='d-flex align-items-center mrgt2'>

                                                            <Link href="/login" className='brand-orange fs-15 font-modernbold'>Login here?</Link>

                                                            <Link onClick={(e) => register(e)} href="/" className={`btn md bg-brand-orange font-modernbold stretch-md onwhite ml-auto ${ loading ? 'disabled-lt' : '' }`}>
                                                                { loading ? <span className='chk-loader white sm'></span> : 'Create Account' }
                                                            </Link>
                                                        
                                                        </div>

                                                        <div className='ui-text-center mrgt5 mrgb1'>
                                                            <span className='font-modern brand-neutraldk fs-13'>Copyright @ 2022, Checkaam Solutions.</span>
                                                        </div>
                                                    
                                                    </>
                                                }

                                                {
                                                    step === 1 &&
                                                    <>

                                                        <Message 
                                                        title="Successful!" 
                                                        message="Welcome to Checkaam! Noe let's setup your store" 
                                                        action={'/login'}
                                                        status="success"
                                                        lottieSize={130}
                                                        loop={false}
                                                        actionType="url"
                                                        buttonText='Continue'
                                                        setBg={true}
                                                        buttonPosition={'outside'}
                                                        slim={true}
                                                        />

                                                    </>
                                                }

                                            </div>

                                        </div>
                                    </div>

                                </div>

                            </form>
                            
                        </div>

                    </div>

                </div>

            </section>
        
        </>
    )
  
}

Register.getInitialProps = async (ctx: any) => {

    const { id } = ctx.query
    return { id }

}

export default Register