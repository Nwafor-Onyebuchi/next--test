import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Modal } from 'react-bootstrap';

import { IDoneModal } from '../../../utils/types';
import Message from '../../partials/Message';


const DoneModal = ({ isShow, closeModal, modalTitle, flattened, stretch, slim, cover, type, data }: Partial<IDoneModal>) => {

    const [email, setEmail] = useState<string>('')
    const [step, setStep] = useState<number>(0)

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

                        <div className="dm--dbx ui-full-bg-norm" style={{ backgroundImage: 'url("../../../images/assets/bg@auth01.jpg")' }}>
                            <div className="dm--d">
                                <div>
                                    {/* <img src="../../../images/assets/i" alt="icon" /> */}
                                </div>
                            </div>
                        </div>

                        <div className={`dm--body form ${cover ? 'flat' : ''}`}>

                            <div className={`${cover ? 'modal-cover' : ''} ui-full-bg-norm ui-bg-center`} style={{ backgroundImage: `url("${cover ? '../../../images/assets/bg@modal-01.jpg' : ''}")` }}>

                                <div className="d-flex align-items-center mrgb1">
                                    <h2 className="onwhite mrgb0 font-satoshiblack fs-19">
                                        {modalTitle}
                                    </h2>
                                    <div className="ml-auto">
                                        <Link href="" onClick={(e) => closeX(e)} className="link-round minix bgd-disable ui-icon-animate">
                                            <span className="fe fe-x fs-16 onwhite"></span>
                                        </Link>
                                    </div>
                                </div>

                            </div>

                            <div className="dm--ct mrgt2">

                                {
                                    step === 0 &&
                                    <>
                                        
                                        <Message
                                            title={data?.title}
                                            displayTitle={false}
                                            message={data?.message}
                                            action={data && data.action ? data.action : closeX}
                                            status="success"
                                            lottieSize={200}
                                            loop={false}
                                            actionType={data?.actionType}
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

export default DoneModal