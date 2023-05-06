import React, {useState, useEffect, useContext} from 'react'

import Basic from './Basic';
import IDBox from './ID';
import FaceID from './Face';
import Address from './Address';
import { IUserContext } from '../../../utils/types';
import Layout from '@/components/layouts/Dashboard';
import UserContext from '@/context/user/userContext';


const Verification = (props: any) => {

    const userContext = useContext<IUserContext>(UserContext);

    useEffect(() => {

    }, [])

    const checkKYC = (value: string) => {

        let result;

        if(value === 'pending'){

            result =  <><span className={`ml-auto link-round mini bg-aliz`}>
                        <i className={`fe fe-x onwhite fs-13`}></i>
                    </span></>
        }

        if(value === 'submitted'){
            
            result =  <><span className={`ml-auto link-round mini bg-brandxp-lp`}>
                        <i className={`fe fe-check brandxp-purple fs-13`}></i>
                    </span></>
        }

        if(value === 'approved'){

            result =  <><span className={`ml-auto link-round mini bg-apple`}>
                        <i className={`fe fe-check onwhite fs-13`}></i>
                    </span></>
        }

        return result;

    }

    return (
        <Layout pageTitle='Verification' showBack={true} collapsed={true}>

            <section className='section ui-wrapper-small'>
                
                <div className='row'>

                    <div className='col-md-10 mx-auto'>

                        <h1 className='font-mattermedium onmineshaft fs-22 mb-1'>Your verifications</h1>
                        <p className='font-matterlight onmineshaft fs-15 mrgb2'>Make sure you complete your verifications, <span className='font-mattermedium brandxp-orange fs-15'>{ userContext.user.firstName }</span></p>

                        <div className='row'>

                            <div className='col-md-4'>
                                
                                <div className='ui-rounded-small pdx1 pxhf pdy1 border-silverlight mrgb1'>

                                    <div className='d-flex align-items-center mrgb'>
                                        <span style={{position: 'relative', left: '0', top: '2px'}} className='xp-board'>
                                            <span className='path1 fs-20'></span>
                                            <span className='path2 fs-20'></span>
                                        </span>
                                        <span className='font-mattermedium brandxp-dark fs-15 pdl1'>Basic Verification</span>

                                        { checkKYC( userContext.user.verification ? userContext.user.verification.basic : 'pending' ) }

                                    </div>

                                    <p className='font-matterlight brandxp-neutral fs-14 mrgb0 ui-line-height mrgb'>Verify your basic personal details, personal details.</p>
                                </div>

                                <div className='ui-rounded-small pdx1 pxhf pdy1 border-silverlight mrgb1'>

                                    <div className='d-flex align-items-center mrgb'>
                                        <span style={{position: 'relative', left: '0', top: '2px'}} className='xp-wallet'>
                                            <span className='path1 fs-20'></span>
                                            <span className='path2 fs-20'></span>
                                        </span>
                                        <span className='font-mattermedium brandxp-dark fs-15 pdl1'>ID Verification</span>

                                        { checkKYC( userContext.user.verification ? userContext.user.verification.ID : 'pending' ) }
                                    </div>

                                    <p className='font-matterlight brandxp-neutral fs-14 mrgb0 ui-line-height mrgb'>Verify your ID details. Use your country's govt. approved.</p>
                                </div>

                                <div className='ui-rounded-small pdx1 pxhf pdy1 border-silverlight mrgb1'>

                                    <div className='d-flex align-items-center mrgb'>
                                            <span style={{position: 'relative', left: '0', top: '2px'}} className='xp-anchor'>
                                                <span className='path1 fs-20'></span>
                                                <span className='path2 fs-20'></span>
                                            </span>
                                            <span className='font-mattermedium brandxp-dark fs-15 pdl1'>Face ID verification</span>

                                            { checkKYC( userContext.user.verification ? userContext.user.verification.face : 'pending' ) }
                                        </div>

                                        <p className='font-matterlight brandxp-neutral fs-14 mrgb0 ui-line-height mrgb'>Take a selfie, and upload your picture.</p>
                                </div>

                                <div className='ui-rounded-small pdx1 pxhf pdy1 border-silverlight mrgb1'>

                                    <div className='d-flex align-items-center mrgb'>
                                        <span style={{position: 'relative', left: '0', top: '2px'}} className='xp-security'>
                                            <span className='path1 fs-22'></span>
                                            <span className='path2 fs-22'></span>
                                        </span>
                                        <span className='font-mattermedium brandxp-dark fs-15 pdl1'>Address Verification</span>

                                        { checkKYC( userContext.user.verification ? userContext.user.verification.address : 'pending' ) }
                                    </div>

                                    <p className='font-matterlight brandxp-neutral fs-14 mrgb0 ui-line-height mrgb'>Your address verification is important on Xpresschain</p>
                                </div>

                            </div>
                                
                            <div className='col-md-7 offset-md-1'>
                                
                                <div className='ui-rounded-small pdx2 pdy1 bdr-brandxp-lp mrgb1'>

                                    {
                                        userContext.loading &&
                                        <>
                                            <div className="empty-box" style={{ backgroundColor: '#fff' }}>

                                                <div className="ui-text-center">
                                                    <div className="row">
                                                        <div className="col-md-10 mx-auto">
                                                            <span className="xp-loader md"></span>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </>
                                    }

                                    {
                                        !userContext.loading && userContext.user.verification &&
                                        <>

                                            {
                                                userContext.user.verification.basic !== 'approved' &&
                                                <>
                                                    <Basic 
                                                    status={userContext.user.verification.basic}
                                                    userId={userContext.user._id}
                                                    />
                                                </>
                                            }

                                            {
                                                userContext.user.verification.basic === 'approved' &&
                                                userContext.user.verification.ID !== 'approved' &&
                                                <>
                                                    <IDBox 
                                                    status={userContext.user.verification.ID}
                                                    userId={userContext.user._id}
                                                    />
                                                </>
                                            }

                                            {
                                                userContext.user.verification.basic === 'approved' &&
                                                userContext.user.verification.ID === 'approved' &&
                                                userContext.user.verification.face !== 'approved' &&
                                                <>
                                                    <FaceID 
                                                    status={userContext.user.verification.face}
                                                    userId={userContext.user._id}
                                                    />
                                                </>
                                            }

                                            {
                                                userContext.user.verification.basic === 'approved' &&
                                                userContext.user.verification.ID === 'approved' &&
                                                userContext.user.verification.face === 'approved' &&
                                                userContext.user.verification.address !== 'approved' &&
                                                <>
                                                    <Address 
                                                    status={userContext.user.verification.address}
                                                    userId={userContext.user._id} />
                                                </>
                                            }

                                        </>
                                    }

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>
        
        </Layout>
    )
  
}

export default Verification