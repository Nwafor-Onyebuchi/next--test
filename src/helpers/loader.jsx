import React from 'react';

const MainLoader = () => {

    return (
        <div>
            <div className="suspense bg-brand-black">

                <div className="suspense_image ui-text-center">
                    <span className='loader white md'></span>
                </div>

            </div>
        </div>
    )

}

const popNetwork = () => {
    window.location.href = '/network'
}

const loadJquery = () => {
    window.$ = window.jQuery = require("jquery");
}

const pop = { MainLoader, popNetwork, loadJquery }

export default pop;