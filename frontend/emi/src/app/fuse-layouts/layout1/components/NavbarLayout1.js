import React, { useEffect, useState } from 'react';
import {AppBar, Hidden, Icon} from '@material-ui/core';
import {FuseScrollbars} from '@fuse';
import { useConnectionStatus } from '@fuse/hooks';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import UserNavbarHeader from 'app/fuse-layouts/shared-components/UserNavbarHeader';
import Logo from 'app/fuse-layouts/shared-components/Logo';
import NavbarFoldedToggleButton from 'app/fuse-layouts/shared-components/NavbarFoldedToggleButton';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import Navigation from 'app/fuse-layouts/shared-components/Navigation';
import * as AppActions from 'app/store/actions';
import { MDText } from 'i18n-react';
import i18n from '../i18n';

const useStyles = makeStyles({
    content: {
        overflowX                   : 'hidden',
        overflowY                   : 'auto',
        '-webkit-overflow-scrolling': 'touch',
        background                  : 'linear-gradient(rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0) 30%), linear-gradient(rgba(0, 0, 0, 0.25) 0, rgba(0, 0, 0, 0) 40%)',
        backgroundRepeat            : 'no-repeat',
        backgroundSize              : '100% 40px, 100% 10px',
        backgroundAttachment        : 'local, scroll',
        '& .ps__rail-x':{
            display: 'none !important',
        }
    }
});

function NavbarLayout1(props){

    const { user, selectedOrganization, setSelectedOrganization, organizationListing, setOrganizationLogo} = props
    let T = new MDText(i18n.get(user.locale));
    const classes = useStyles();
    const dispatch = useDispatch();
    const { isConnected } = useConnectionStatus();
    const [prevIsConnected, setPrevIsConnected] = useState(isConnected);

    useEffect(() => {
        if (prevIsConnected === false && isConnected === true) {
            dispatch(AppActions.showMessage({
                message: T.translate("Layout.messageConnectionRestored"),
                variant: 'success',
            }));
        } else if (isConnected === false) {
            dispatch(AppActions.showMessage({
                message: T.translate("Layout.messageConnectionLost"),
                variant: 'error',
            }));
        }
        setPrevIsConnected(isConnected);
    }, [isConnected, prevIsConnected]); 


    return (
        <div className={clsx(`flex flex-col overflow-hidden h-full ${!isConnected && ('opacity-25')}`, props.className )}>

            <AppBar
                color="primary"
                position="static"
                elevation={0}
                className="flex flex-row items-center flex-shrink h-64 min-h-64 pl-20 pr-12"
            >

                <div className="flex flex-1 pr-8">
                    {isConnected ? <Logo/> : <Icon className='text-red-500'>signal_wifi_off</Icon> } 
                </div>

                <Hidden mdDown>
                    <NavbarFoldedToggleButton className="w-40 h-40 p-0"/>
                </Hidden>

                <Hidden lgUp>
                    <NavbarMobileToggleButton className="w-40 h-40 p-0">
                        <Icon>arrow_back</Icon>
                    </NavbarMobileToggleButton>
                </Hidden>
            </AppBar>

            <FuseScrollbars className={clsx(classes.content)}>

                <UserNavbarHeader {...{user, selectedOrganization, setSelectedOrganization, organizationListing, setOrganizationLogo}}/>

                <Navigation layout="vertical"/>

            </FuseScrollbars>
        </div>
    );
}

export default NavbarLayout1;


