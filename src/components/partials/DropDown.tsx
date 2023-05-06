import React from 'react';
import { IDropDownProps } from '../../utils/types';
import DropSelect from './DropSelect'

const DropDown = ({ 
    options, 
    className, 
    selected, 
    defaultValue, 
    placeholder, 
    search, 
    displayImage, 
    displayControlLeft, 
    displayOptionLeft, 
    displayLabel, 
    displayOptionLabel,
    disabled,
    position,
    menuBg, 
    }: Partial<IDropDownProps>) => {

    const onSelectChange = (sel: any) => {
        selected(sel);
    }
    
    const getDefault = () => {
        
        if(defaultValue && typeof(defaultValue) === 'object'){
            return defaultValue;
        }else if (defaultValue && typeof(defaultValue) === 'number'){
            return options ? options()[defaultValue] : options()[0];
        }else{
            return;
        }
        

    }



    return (
        <>

            <DropSelect 
                isSearchable={search === undefined ? false : search}
                disableSeparator={true}
                className={className ? className + ' font-metrolight' : ''} 
                controlDisplayImage={displayImage ? true : false}
                controlDisplayLabel={displayLabel ? true : false}
                controlDisplayLeft={displayControlLeft ? true : false} 
                optionDisplayLeft={displayOptionLeft ? true : false}
                optionDisplayLabel={displayOptionLabel !== null && displayOptionLabel !== undefined ? displayOptionLabel : true}
                optionDisplayImage={displayImage ? true : false}
                defaultValue={getDefault()}
                options={options}
                onChange={(item: any) => onSelectChange(item)} 
                placeholder={placeholder ? placeholder : 'Select option'}
                isDisabled={disabled ? disabled : false}
                menuPosition={position ? position : 'bottom'}
                menuBackground={menuBg}
            />

        </>
    )

}

export default DropDown;