import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Modal } from 'react-bootstrap';

import lottieSuccess from '../../_data/check.json'
import lottieError from '../../_data/check-error.json'
import LottiePlayer from './LottiePlayer';

import { IAlertModal } from '../../utils/types';


const AlertModal = ({ isShow, closeModal, modalTitle, flattened, stretch, slim, type, data }: Partial<IAlertModal>) => {

    useEffect(() => {

    }, [])

    const closeX = (e: any): void => {
        if (e) e.preventDefault();
        closeModal();
    }

    return (
        <>

            <Modal show={isShow}
                onHide={() => closeX}
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

                        <div className="dm--body">

                            <div className="d-flex align-items-center mrgb1">
                                <h2 className="brand-coal mrgb0 font-mattermedium fs-16">
                                    {modalTitle}
                                </h2>
                                <div className="ml-auto">
                                    <Link href="" onClick={(e) => closeX(e)} className="link-round sm bg-brand-orangewhite ui-icon-animate">
                                        <span className="fe fe-x fs-12 brand-orange"></span>
                                    </Link>
                                </div>
                            </div>

                            <div className="dm--ct mrgt2">

                                <div className="ui-text-center mrgb2 mrgt2">
                                    <LottiePlayer lottieData={type === "success" ? lottieSuccess : lottieError } width='130px' height='130px' loop={true} />
                                </div>
                                <div className="mrgb2 pdl3 pdr3">
                                    <h3 className="title fs-20 ui-text-center">{data ? data.title : 'No Title'}</h3>
                                    <p className="onmineshaft fs-14 ui-text-center mrgb1">{data ? data.message : 'No Message'}</p>
                                </div>

                                <div className="ui-text-center">
                                    <Link href="" style={{minWidth: '200px'}} onClick={(e) => closeX(e)} className="btn btn-lgr onwhite bg-brand-orange fs-16 mb-3">{data ? data.buttonText : 'No Text'}</Link>
                                </div>

                            </div>

                        </div>

                    </div>

                </Modal.Body>

            </Modal>        

        </>
    )
  
}

export default AlertModal