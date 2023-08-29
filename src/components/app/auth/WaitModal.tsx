import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Modal } from 'react-bootstrap';
import Axios from 'axios';

import Message from '../../../components/partials/Message';
import Alert from '../../../components/partials/Alert';
import storage from '../../../helpers/storage';
import { IModalProps } from '../../../utils/types';


const WaitModal = ({ isShow, closeModal, modalTitle, flattened, stretch, slim }: Partial<IModalProps>) => {

    const [reset, setReset] = useState({
        email: '',
        name: ''
    })
    const [step, setStep] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [rm, setRm] = useState<boolean>(false)
    const [alert, setAlert] = useState({
        type: '',
        show: false,
        message: ''
    });

    useEffect(() => {
        setStep(0)
    }, [])

    const closeX = (e: any = null) => {
        if (e) e.preventDefault();
        closeModal();

        setTimeout(() => {
            setStep(0)
        }, 400)
    }

    const addToWaitList = async (e: any) => {

        if(e) { e.preventDefault() }

        if(!reset.email){
            setAlert({...alert, type: "danger", show:true, message:'Enter your email'})
            setTimeout(()=> {
                 setAlert({...alert, show:false});
            }, 2500)
        } else{

            setLoading(true);

            await Axios.post(`${process.env.REACT_APP_AUTH_URL}/waitlists`, { ...reset }, storage.getConfig())
            .then(async (resp) => {

                if(resp.data.error === false && resp.data.status === 200){
                    setStep(1);
                    setRm(true);
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

            <Modal show={isShow}
                onHide={() => closeX()}
                size="sm"
                fade={false}
                keyboard={false}
                aria-labelledby="medium-modal"
                centered
                className={`custom-modal ${slim ? slim : ''} ${stretch ? 'stretched' : ''} ${flattened ? 'flat' : ''} lg`}
            >

                <Modal.Body>

                    <div className="d-flex">

                        <div className="dm--dbx ui-full-bg-norm" style={{ backgroundImage: 'url("../../../images/assets/bg@waitlist.jpg")' }}>
                            <div className="dm--d">
                                <div>
                                    {/* <img src="../../../images/assets/i" alt="icon" /> */}
                                </div>
                            </div>
                        </div>

                        <div className="dm--body form">

                            <div className="d-flex align-items-center mrgb1">
                                <h2 className="onwhite mrgb0 font-freimedium fs-19">
                                    {modalTitle}
                                </h2>
                                <div className="ml-auto">
                                    <Link href="" onClick={(e) => closeX(e)} className="link-round sm ui-icon-animate" style={{ backgroundColor: "#413AB9" }}>
                                        <span className="fe fe-x fs-16" style={{ color: '#100E33' }}></span>
                                    </Link>
                                </div>
                            </div>

                            <div className="dm--ct mrgt1">

                                <Alert type={alert.type} show={alert.show} message={alert.message} />

                                {
                                    step === 0 &&
                                    <>

                                        <div className="mrgb1">
                                            <p className="font-frei fs-13 mrgb1 ui-line-height-medium" style={{ color: '#C3C2FB' }}>
                                            Exceed the walls of traditional schools with an online education degree from Concreap. Learn world-class, industry standard professional skills from novice to PRO.
                                            </p>
                                        </div>

                                        <div className="form-row mrgb0">
                                            <div className="col">
                                                <label className='fs-13 onwhite font-freimedium mrgb0'>Your name</label>
                                                <input
                                                    defaultValue={''}
                                                    onChange={(e) => { setReset({ ...reset, name: e.target.value }) }}
                                                    type="text" className="form-control fs-14 lg on-black font-freilight onwhite"
                                                    placeholder="Type here" autoComplete='off' />

                                            </div>

                                        </div>
                                        <div className="form-row mrgb1">
                                            <div className="col">
                                                <label className='fs-13 onwhite font-freimedium mrgb0'>Your email</label>
                                                <input
                                                    defaultValue={''}
                                                    onChange={(e) => { setReset({ ...reset, email: e.target.value }) }}
                                                    type="text" className="form-control fs-14 lg on-black font-freilight onwhite"
                                                    placeholder="Type here" autoComplete='off' />

                                            </div>

                                        </div>
                                        <div className='form-row mrgb1'>

                                            <div className="col">

                                                <Link onClick={(e) => addToWaitList(e)} style={{  top:'-2px' }} className={`w-100 onwhite md fs-11 btn bgd-yellow ui-relative ${loading ? 'disabled-lt' : ''}`} href="">
                                                   { loading ? <span className='cp-loader sm white'></span>  :
                                                    <>
                                                         <span className='font-freibold fs-13'>Join The Waitlist</span>
                                                        <span className='fe fe-chevrons-right fs-15 onwhite ui-relative' style={{ top: '2px', left: '5px' }}></span>
                                                    </>
                                                   }
                                                </Link>

                                            </div>
                                        </div>
                                    </>
                                }

                                {
                                    step === 1 &&
                                    <>
                                        
                                        <Message
                                            title="Successful!"
                                            displayTitle={false}
                                            message="Thank you for joining our waitlist. You're smarter!"
                                            action={closeX}
                                            status="success"
                                            lottieSize={200}
                                            loop={false}
                                            actionType="action"
                                            buttonText='Okay'
                                            setBg={false}
                                            bgColor={'#fefefe'}
                                            buttonPosition={'inside'}
                                            slim={false}
                                        />

                                    </>
                                }


                            </div>

                        </div>

                    </div>

                </Modal.Body>

            </Modal>

        </>
    )

}

export default WaitModal