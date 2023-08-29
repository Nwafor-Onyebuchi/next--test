import React, {useState, useEffect, useContext} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Modal } from 'react-bootstrap';

import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { ICropModal } from '../../utils/types'

const CropModal = ({ isShow, closeModal, modalTitle, flattened, stretch, slim, data, cropType, imageLoaded, capture }: Partial<ICropModal>) => {

    const [crop, setCrop] = useState<Crop>({
        unit: 'px',
        width: 250,
        height: 250,
        x: 50,
        y: 50
    })

    const [landCrop, setLandCrop] = useState<Crop>({
        unit: 'px',
        width: 350,
        height: 196,
        x: 50,
        y: 50
    })

    useEffect(() => {

    }, [])

    const closeX = (e: any = null): void => {
        if (e) e.preventDefault();
        closeModal();
    }

    const cropChange = (crop: any) => {
        if(cropType === 'logo'){
            setCrop(crop);
        }

        if(cropType === 'cover'){
            setLandCrop(crop)
        }
    }

    const complete = (e: any) => {
        if(e) e.preventDefault();
        capture(crop, cropType);
        closeX()
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

                            {
                                    cropType === 'logo' &&
                                    <ReactCrop 
                                        crop={crop}
                                        locked={false}
                                        maxWidth={350}
                                        maxHeight={350}
                                        minWidth={250}
                                        minHeight={250}
                                        className='react-crop'
                                        onChange={cropChange}
                                        ruleOfThirds={true}
                                        keepSelection={true}
                                        aspect={1}
                                    >
                                        <img src={data} onLoad={imageLoaded} style={{ width: '300px', margin: '0 auto' }} />
                                    </ReactCrop>
                                }

                                {
                                    cropType === 'cover' &&
                                    <ReactCrop 
                                        crop={landCrop}
                                        locked={false}
                                        maxWidth={350}
                                        maxHeight={196}
                                        minWidth={276}
                                        minHeight={154}
                                        className='react-crop'
                                        onChange={cropChange}
                                        ruleOfThirds={true}
                                        keepSelection={true}
                                        aspect={16 / 9}
                                    >
                                        <img src={data} onLoad={imageLoaded} style={{ width: '450px', margin: '0 auto' }} />
                                    </ReactCrop>
                                }

                                <div className='mrgt1'>
                                    <Link href="" onClick={(e) => complete(e)} className='font-modernbold fs-17 brand-orange'>Done</Link>
                                </div>

                            </div>

                        </div>

                    </div>

                </Modal.Body>

            </Modal>   
        
        </>
    )
  
}

export default CropModal