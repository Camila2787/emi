import React from 'react';
import { FuseScrollbars } from '@fuse';
import { Icon } from '@material-ui/core';
import Logo from 'app/fuse-layouts/shared-components/Logo';
import Navigation from 'app/fuse-layouts/shared-components/Navigation';


function NavbarLayout2(props) {

    const { isConnected } = props

    return (
        <div className={`flex flex-auto justify-between items-center w-full h-full container p-0 lg:px-24 ${!isConnected && ('opacity-25')}`}>

            <div className="flex flex-shrink-0 items-center pl-8 pr-16">
            {isConnected ? <Logo/> : <Icon className='text-red-500'>signal_wifi_off</Icon> } 
            </div>

            <FuseScrollbars className="flex h-full items-center">
                <Navigation className="w-full" layout="horizontal" dense/>
            </FuseScrollbars>
        </div>
    );
}

export default NavbarLayout2;


