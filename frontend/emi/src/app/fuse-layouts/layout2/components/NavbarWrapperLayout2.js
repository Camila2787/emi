import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useConnectionStatus } from '@fuse/hooks';
import * as AppActions from 'app/store/actions';
import * as Actions from 'app/store/actions';
import * as authActions from 'app/auth/store/actions';
import { Paper, Drawer, Hidden } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import NavbarMobileLayout2 from 'app/fuse-layouts/layout2/components/NavbarMobileLayout2';
import NavbarLayout2 from './NavbarLayout2';
import i18n from '../i18n';
import { MDText } from 'i18n-react';

const navbarWidth = 280;

const useStyles = makeStyles(theme => ({
    navbar: {
        display: 'flex',
        overflow: 'hidden',
        height: 64,
        minHeight: 64,
        alignItems: 'center',
        boxShadow: theme.shadows[3],
        zIndex: 6,
    },
    navbarMobile: {
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
        width: navbarWidth,
        minWidth: navbarWidth,
        height: '100%',
        zIndex: 4,
        transition: theme.transitions.create(['width', 'min-width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter,
        }),
        boxShadow: theme.shadows[3],
    },
}));

const NavbarWrapperLayout2 = (props) => {
    const dispatch = useDispatch();
    const navbarTheme = useSelector(({ fuse }) => fuse.settings.navbarTheme);
    const navbar = useSelector(({ fuse }) => fuse.navbar);
    const isServiceWorkerUpdated = useSelector(({ nebulae }) => nebulae.serviceWorker.serviceWorkerUpdated);
    const user = useSelector(({ auth }) => auth.user);
    const classes = useStyles(props);
    const { isConnected } = useConnectionStatus();
    const T = new MDText(i18n.get((user || {}).locale));
    const [prevIsConnected, setPrevIsConnected] = useState(isConnected);

    useEffect(() => {
        if (user) {
            const userConfigs = { ...user, data: { ...user.data } };
            userConfigs.data.settings.layout.config.footer.display = isServiceWorkerUpdated;
            dispatch(authActions.setUserData(userConfigs));
        }
    }, [isServiceWorkerUpdated]);

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
        <ThemeProvider theme={navbarTheme}>
            <Hidden mdDown>
                <Paper className={classes.navbar} square={true}>
                    <NavbarLayout2 {...{ isConnected }} />
                </Paper>
            </Hidden>

            <Hidden lgUp>
                <Drawer
                    anchor="left"
                    variant="temporary"
                    open={navbar.mobileOpen}
                    classes={{
                        paper: classes.navbarMobile,
                    }}
                    onClose={() => dispatch(Actions.navbarCloseMobile())}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    <NavbarMobileLayout2 {...{ isConnected }} />
                </Drawer>
            </Hidden>
        </ThemeProvider>
    );
};

export default NavbarWrapperLayout2;
