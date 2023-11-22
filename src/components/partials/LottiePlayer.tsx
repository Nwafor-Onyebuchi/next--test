import React, {useState, useEffect, useContext} from 'react'

import { ILottieProps } from '../../utils/types';

import checkData from '../../_data/check-data-green.json'

const LottiePlayer = ({ lottieData, width, height, loop }: Partial<ILottieProps>) => {

    const defaultOptions = {
        loop: loop ? true : false,
        autoplay: true, 
        animationData: lottieData ? lottieData : checkData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };

    useEffect(() => {

    }, [])

    return (
        <>
            <Lottie 
            options={defaultOptions}
            height={height}
            width={width}
            isStopped={false}
            isPaused={false}/>
        </>
    )
  
}

export default LottiePlayer