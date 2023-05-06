import React, { useEffect } from 'react'
import { IAlertProps } from '../../utils/types'

const Alert = ({ show, message, type }: Partial<IAlertProps>) => {

    useEffect(() => {

    }, [])

    const getIcon = (type: string | undefined) => {
        let ic = 'fe-info';

        if(type === 'info'){
            ic = 'fe-info';
        }else if(type === 'warning'){
            ic = 'fe-alert-triangle'
        }else if(type === 'danger'){
            ic = 'fe-alert-octagon'
        }else if(type === 'success'){
            ic = 'fe-check-circle'
        }

        return ic;
    }

    return (
        <>
            <div className={`alert alert-${type} d-flex align-items-center ${show === false ? 'ui-hide':''}`} role="alert">

                <div><span className={`fe ${getIcon(type)} fs-17 ui-relative`} style={{ top: '1px' }}></span></div>

                <div className="pdl ui-line-height">
                    <div className="message font-frei fs-13 ui-line-height">
                        { message ? message : 'No message' }
                    </div>
                </div>

            </div>
        </>
    )
  
}

export default Alert