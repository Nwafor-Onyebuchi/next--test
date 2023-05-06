import React, { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ISubscribeComp } from '../../../utils/types'
import Axios from 'axios';
import storage from '../../../helpers/storage';
import body from '../../../helpers/body';


const SubscribeForm = ({ display }: Partial<ISubscribeComp>) => {

    const [error, setError] = useState({
        flag: false,
        message: '',
        status: 0
    });

    const [email, setEmail] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {

    }, [])

    const subscribe = async (e: any) => {

        if(e) { e.preventDefault() }

        setLoading(true)

        await Axios.post(`${process.env.NEXT_PUBLIC_BLOG_URL}/subscribers`, { email: email }, storage.getConfig())
        .then((resp) => {

            if(resp.data.error === false && resp.data.status === 200){

                setError({ ...error, flag: false, message: 'Thank you for subscribing!', status: 200 })
                setTimeout(() => {
                    setError({ ...error, flag: false, message: '', status: 0 })
                    setEmail('')
                }, 2000)

            }

            setLoading(false);

        }).catch((err) => {

            if (err.response.data.errors && err.response.data.errors.length > 0) {

                setError({ ...error, flag: true, message: err.response.data.errors[0], status: err.response.data.status })
                setTimeout(() => {
                    setError({ ...error, flag: false, message: '', status: 0 })
                    setEmail('')
                }, 2000)

            } else {

                setError({ ...error, flag: true, message: err.response.data.message, status: err.response.data.status })
                setTimeout(() => {
                    setError({ ...error, flag: false, message: '', status: 0 })
                    setEmail('')
                }, 2000)
            }

            setLoading(false);
            
        })

    }
    
    return (
        <>

            <div className="subscribe-form">

                {
                    display === 'single' &&
                    <>

                        {
                            error.flag && error.status > 0 &&
                            <>
                                <div className='sub-box err'>
                                    <span className='cp-icon cp-error fs-30 grad'></span>
                                    <p className='mrgb0 onwhite fs-14 font-frei'>{ error.message ? body.captialize(error.message) : 'No Message' }</p>
                                </div>
                            </>
                        }

                        {
                            !error.flag && error.status === 200 &&
                            <>
                                <div className='sub-box succ'>
                                    <p className='mrgb0 onwhite fs-14 font-frei'>{ error.message ? body.captialize(error.message) : 'No Message' }</p>
                                </div>
                            </>
                        }

                        {
                            !error.flag && error.status <= 0 &&
                            <>
                                <form className='form' onSubmit={(e) => e.preventDefault()}>

                                    <div className="form-group">

                                        <label htmlFor='subscribe' className='font-freimedium fs-15 mrgb1 ui-line-height pdr2' style={{ color: "#A3A1C9" }}>
                                            Get updates right into your inbox. Drop your mail.
                                        </label>
                                        <input 
                                        onChange={(e) => { setEmail(e.target.value) }}
                                        type="email" 
                                        name="subscribe-input" 
                                        className='form-control inbox-input font-freimedium onwhite fs-13 brand-auth' 
                                        id="" placeholder='Your email'
                                        autoComplete='off' 
                                        />

                                    </div>

                                    <div className="d-flex align-items-center mrgt">
                                        <Link 
                                        onClick={(e) => subscribe(e)} 
                                        className={`ml-auto onwhite stretch-md fs-12 font-freibold btn sm bgd-yellow ${(loading || !email) ? 'disabled-lt' : ''}`} href="">
                                            { loading ? <span className='cp-loader sm white'></span> : 'Subscribe' }
                                        </Link>
                                    </div>


                                </form>
                            </>
                        }

                   </>
                }

                {
                    display === 'hero' &&
                    <>
                    
                        {
                            error.flag && error.status > 0 &&
                            <>
                                <div className='sub-box hero err'>
                                    <span className='cp-icon cp-error fs-30 grad'></span>
                                    <p className='mrgb0 onwhite fs-14 font-frei pdl1'>{ error.message ? body.captialize(error.message) : 'No Message' }</p>
                                </div>
                            </>
                        }

                        {
                            !error.flag && error.status === 200 &&
                            <>
                                <div className='sub-box hero succ'>
                                    <p className='mrgb0 onwhite fs-14 font-frei'>{ error.message ? body.captialize(error.message) : 'No Message' }</p>
                                </div>
                            </>
                        }

                        {
                            !error.flag && error.status <= 0 &&
                            <>
                                <div className='hero-form mrgt4'>
                                    <input onChange={(e) => { setEmail(e.target.value) }} type="text" className='font-frei fs-16 onwhite' placeholder='Your email' />
                                    <Link 
                                    onClick={(e) => subscribe(e)} 
                                    className={`ml-auto onwhite stretch-md font-freibold fs-14 btn md bgd-yellow ${(loading || !email ? 'disabled-lt' : '')}`} 
                                    href="">
                                        { loading ? <span className='cp-loader sm white'></span> : 'Subscribe' }
                                    </Link>
                                </div>
                            </>
                        }
                    
                    </>
                }
                

            </div>

        </>
    )
}

export default SubscribeForm