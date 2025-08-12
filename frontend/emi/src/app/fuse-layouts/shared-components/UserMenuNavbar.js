import React, { useState, useEffect } from 'react';
import { Avatar, Button, Icon, ListItemIcon, ListItemText, Popover, MenuItem, Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import * as authActions from 'app/auth/store/actions';
import { Link } from 'react-router-dom';
import { MDText } from 'i18n-react';
import i18n from "./i18n";
import { useLazyQuery } from "@apollo/react-hooks";
import { OrganizationMngOrganizationListing } from "./gql/Organization";
import { OrganizationMngCompany } from "./gql/Company";


const useStyles = makeStyles(theme => ({
    listing: {
        transition: theme.transitions.create('opacity', {
            duration: theme.transitions.duration.shortest,
            easing: theme.transitions.easing.easeInOut
        })
    },
}));

function UserMenuNavbar(props) {

    const dispatch = useDispatch();
    const {user, selectedOrganization, setSelectedOrganization, organizationListing, setOrganizationLogo} = props
    const [userMenu, setUserMenu] = useState(null);
    const classes = useStyles();

    let T = new MDText(i18n.get(user.locale));

    const userMenuClick = event => {
        setUserMenu(event.currentTarget);
    };

    const userMenuClose = () => {
        setUserMenu(null);
    };

    function handleOrganizationSelection(org) {
        setSelectedOrganization(org);
        dispatch(authActions.setSelectedOrganization(org));
        userMenuClose();
        window.localStorage.setItem("organizationId", org.id);
    }

    function handleImageError(evt) {
        dispatch(authActions.setUserData({ ...user, data: { ...user.data, organizationLogo: undefined } }));
        setOrganizationLogo(undefined);
    }

    return (
        <React.Fragment>
            {!user.role || user.role.length === 0 ? (
                <Typography color="inherit" className="text-11 capitalize">
                    {selectedOrganization.name}
                </Typography>
            ) : (
                    <Button onClick={userMenuClick} className={`${classes.listing} text-13 opacity-50 whitespace-no-wrap`}>
                        <div className="flex flex-col ml-12 items-start">
                            <Typography color="inherit" className="text-11 capitalize">
                                {selectedOrganization.name}
                            </Typography>
                        </div>
                        <Icon className="text-16 ml-12 flex" variant="action">keyboard_arrow_down</Icon>
                    </Button>
                )
            }

            {!user.role || user.role.length === 0 ? <></> : (
                <Popover
                    open={Boolean(userMenu)}
                    anchorEl={userMenu}
                    onClose={userMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                    classes={{
                        paper: "py-8"
                    }}
                >
                    <React.Fragment>
                        {
                            organizationListing.filter(organization => organization && organization.active).map(org =>
                                <MenuItem key={org.id} onClick={() => handleOrganizationSelection(org)}>
                                    <ListItemIcon className="min-w-40">
                                        <Icon>{org.id === selectedOrganization.id ? "check" : "chevron_right"}</Icon>
                                    </ListItemIcon>
                                    <ListItemText className="pl-0" primary={org.name} />
                                </MenuItem>
                            )
                        }
                    </React.Fragment>
                </Popover>)
            }
        </React.Fragment>
    );
}

export default UserMenuNavbar;
