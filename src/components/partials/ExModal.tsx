import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Modal } from 'react-bootstrap';
import { IModalProps } from '../../utils/types';


const ExModal = ({ isShow, closeModal, modalTitle, flattened, stretch, slim }: IModalProps) => {

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

                                

                            </div>
                        </div>

                    </div>

                </Modal.Body>

            </Modal>
        
        </>
    )
  
}

export default ExModal