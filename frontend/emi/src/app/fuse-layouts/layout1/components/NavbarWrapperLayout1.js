import React, { useState, useEffect, useContext } from 'react';
import { Drawer, Hidden, Icon } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import clsx from 'clsx';
import * as Actions from 'app/store/actions';
import NavbarLayout1 from './NavbarLayout1';
import { useDispatch, useSelector } from 'react-redux';

import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import { isWithinInterval } from 'date-fns';

import { useLazyQuery } from "@apollo/react-hooks";
import * as authActions from 'app/auth/store/actions';
import { OrganizationMngOrganizationListing } from "../../shared-components/gql/Organization";
import { OrganizationMngCompany } from "../../shared-components/gql/Company";
import AppContext from 'app/AppContext';

const navbarWidth = 280;

const useStyles = makeStyles(theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        zIndex: 4,
        [theme.breakpoints.up('lg')]: {
            width: navbarWidth,
            minWidth: navbarWidth
        }
    },
    wrapperFolded: {
        [theme.breakpoints.up('lg')]: {
            width: 64,
            minWidth: 64
        }
    },
    navbar: {
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
        flex: '1 1 auto',
        width: navbarWidth,
        minWidth: navbarWidth,
        height: '100%',
        zIndex: 4,
        transition: theme.transitions.create(['width', 'min-width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter
        }),
        boxShadow: theme.shadows[3],
        ["@media print"]: {
            display: 'none',
        },
    },
    left: {
        left: 0
    },
    right: {
        right: 0
    },
    folded: {
        position: 'absolute',
        width: 64,
        minWidth: 64,
        top: 0,
        bottom: 0
    },
    foldedAndOpened: {
        width: navbarWidth,
        minWidth: navbarWidth
    },
    navbarContent: {
        flex: '1 1 auto',
    },
    foldedAndClosed: {
        '& $navbarContent': {
            '& .logo-icon': {
                width: 32,
                height: 32
            },
            '& .logo-text': {
                opacity: 0
            },
            '& .react-badge': {
                opacity: 0
            },
            '& .list-item-text, & .arrow-icon, & .item-badge': {
                opacity: 0
            },
            '& .list-subheader .list-subheader-text': {
                opacity: 0
            },
            '& .list-subheader:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                minWidth: 16,
                borderTop: '2px solid',
                opacity: .2
            },
            '& .collapse-children': {
                display: 'none'
            },
            '& .user': {
                '& .username, & .email': {
                    opacity: 0
                },
                '& button': {
                    display: 'none'
                },
                '& .avatar': {
                    width: 40,
                    height: 40,
                    top: 32,
                    padding: 0
                }
            },
            '& .list-item.active': {
                marginLeft: 12,
                width: 40,
                padding: 12,
                borderRadius: 20,
                '&.square': {
                    borderRadius: 0,
                    marginLeft: 0,
                    paddingLeft: 24,
                    width: '100%'
                }
            }
        }
    },
    menuMovil: {
        position: 'absolute',
        top: '0',
        left: '0',
        background: theme.palette.primary.dark,
        color: 'white',
        ['@media(max-width: 599px)']: {
            top: 'auto',
            bottom: '0',
            borderRadius: '0 50px 50px 0',
            padding: '0px 5px 0 2px !important',
            margin: '0',
            width: 'auto !important',
            background: 'rgb(45 50 62 / 67%)',
            '& .material-icons': {
                fontSize: '1.8rem',
            },
            '&:hover': {
                background: theme.palette.primary.dark,
            }
        },
        ["@media print"]: {
            display: 'none',
        },
    }
}));

function NavbarWrapperLayout1(props) {

    const dispatch = useDispatch();
    const appContext = useContext(AppContext);
    const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
    const navbarTheme = useSelector(({ fuse }) => fuse.settings.navbarTheme);
    const navbar = useSelector(({ fuse }) => fuse.navbar);
    const isServiceWorkerUpdated = useSelector(({ nebulae }) => nebulae.serviceWorker.serviceWorkerUpdated);
    const user = useSelector(({ auth }) => auth.user);
    const classes = useStyles();

    const folded = config.navbar.folded;
    const foldedAndClosed = folded && !navbar.foldedOpen;
    const foldedAndOpened = folded && navbar.foldedOpen;

    //#region 
    const [organizationLogo, setOrganizationLogo] = useState(undefined)
    const [organizationListing, setOrganizationListing] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState({ id: "", name: "---" });

    const organizationListingQuery = OrganizationMngOrganizationListing({});
    const [refreshOrganizationListing, { loading: loadingOrganizationListing, data: organizationListingData, error: organizationListingError }] = useLazyQuery(organizationListingQuery.query,
        { variables: { filterInput: { organizationId: "" } }, fetchPolicy: OrganizationMngOrganizationListing.fetchPolicy });

    const gqlOrganizationMngCompany = OrganizationMngCompany({});
    const [queryCompany, companyResult] = useLazyQuery(gqlOrganizationMngCompany.query,
        { fetchPolicy: gqlOrganizationMngCompany.fetchPolicy })

    useEffect(() => {
        if (organizationListingData && organizationListingData.OrganizationMngOrganizationListing) {
            const orgs = organizationListingData.OrganizationMngOrganizationListing.listing;
            if (orgs.length > 0) {
                const lastSelectedOrganizationId = window.localStorage.getItem("organizationId");
                let org = lastSelectedOrganizationId ? orgs.find(o => o.id === lastSelectedOrganizationId) : orgs[0];
                org = org || orgs[0];
                setSelectedOrganization(org);
                dispatch(authActions.setSelectedOrganization(org));
            }
            setOrganizationListing(organizationListingData.OrganizationMngOrganizationListing.listing);
        } else if (organizationListingError) {
            if (selectedOrganization.id === "") {
                setSelectedOrganization({ id: "", name: "ERROR" });
            }
            setOrganizationListing([]);
        }
    }, [organizationListingData, organizationListingError]);

    useEffect(() => {
        if(selectedOrganization && selectedOrganization.id){
            const userConfigs = { ...user, data: { ...user.data, organizationLogo: selectedOrganization.logoUrl } };
            userConfigs.data.settings.layout.config.footer.display = isServiceWorkerUpdated;
            dispatch(authActions.setUserData(userConfigs));
        }
    }, [isServiceWorkerUpdated]);

    useEffect(() => {
        if (selectedOrganization && selectedOrganization.id) {
            const userConfigs = { ...user, data: { ...user.data, organizationLogo: selectedOrganization.logoUrl } }
            userConfigs.data.settings.layout.config.footer.display = isServiceWorkerUpdated;
            dispatch(authActions.setUserData(userConfigs));
            setOrganizationLogo(selectedOrganization.logoUrl);
            if (user.data.companyId) {
                queryCompany({ variables: { id: user.data.companyId, organizationId: selectedOrganization.id } })
            }
        }
    }, [selectedOrganization])

    useEffect(() => {
        if (companyResult.data) {
            dispatch(authActions.setUserData({ ...user, data: { ...user.data, companyLogo: companyResult.data.OrganizationMngCompany.logoUrl, organizationLogo: selectedOrganization.logoUrl } }));
        }
    }, [companyResult])

    useEffect(() => {
        if (user && user.data && !user.selectedOrganization) {
            if (user.data.organizationId) {
                const selOrg = { id: user.data.organizationId, name: user.data.organizationId, active: true };
                setSelectedOrganization(selOrg);
                dispatch(authActions.setSelectedOrganization(selOrg));
                refreshOrganizationListing({ variables: { filterInput: { organizationId: user.data.organizationId } } });
            } else {
                refreshOrganizationListing({ variables: { sortInput: { field: 'name', asc: true } } });
            }
        }
    }, [user])

    //#endregion

    return (
        <ThemeProvider theme={navbarTheme}>
            <div id="fuse-navbar"
                className={
                    clsx(
                        classes.wrapper,
                        folded && classes.wrapperFolded
                    )}
            >
                <Hidden mdDown>
                    <div
                        className={
                            clsx(
                                classes.navbar,
                                classes[config.navbar.position],
                                folded && classes.folded,
                                foldedAndOpened && classes.foldedAndOpened,
                                foldedAndClosed && classes.foldedAndClosed
                            )
                        }
                        onMouseEnter={() => foldedAndClosed && dispatch(Actions.navbarOpenFolded())}
                        onMouseLeave={() => foldedAndOpened && dispatch(Actions.navbarCloseFolded())}
                        style={{ backgroundColor: navbarTheme.palette.background.default }}
                    >
                        <NavbarLayout1 className={classes.navbarContent} {...{ user, selectedOrganization, setSelectedOrganization, organizationListing, setOrganizationLogo }} />
                    </div>
                </Hidden>

                <Hidden lgUp>
                    {/* <NavbarMobileToggleButton className={`${classes.menuMovil} w-40 h-40 p-0`}>
                        <Icon>menu</Icon>
                    </NavbarMobileToggleButton> */}
                    <Drawer
                        anchor={config.navbar.position}
                        variant="temporary"
                        open={navbar.mobileOpen}
                        classes={{
                            paper: classes.navbar
                        }}
                        onClose={() => dispatch(Actions.navbarCloseMobile())}
                        ModalProps={{
                            keepMounted: true // Better open performance on mobile.
                        }}
                    >
                        <NavbarLayout1 className={classes.navbarContent} {...{ user, selectedOrganization, setSelectedOrganization, organizationListing, setOrganizationLogo }} />
                    </Drawer>
                </Hidden>
            </div>
        </ThemeProvider>
    );
}

export default NavbarWrapperLayout1;
