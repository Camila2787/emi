import React from 'react';
import {Icon, ListItem, ListItemText} from '@material-ui/core';
import {FuseUtils, NavLinkAdapter} from '@fuse';
import {withRouter} from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from 'app/store/actions';
import FuseNavBadge from './../FuseNavBadge';
import {makeStyles} from '@material-ui/styles';

import { MDText } from 'i18n-react';
import i18n from "../../i18n";

import * as authActions from 'app/auth/store/actions';

const useStyles = makeStyles(theme => ({
    root: {
        minHeight          : 48,
        '&.active'         : {
            backgroundColor            : theme.palette.secondary.main,
            color                      : theme.palette.secondary.contrastText + '!important',
            pointerEvents              : 'none',
            '& .list-item-text-primary': {
                color: 'inherit'
            },
            '& .list-item-icon'        : {
                color: 'inherit'
            }
        },
        '& .list-item-icon': {},
        '& .list-item-text': {
            padding: '0 0 0 16px'
        },
        color              : theme.palette.text.primary,
        textDecoration     : 'none!important',
        '&.dense'          : {
            padding            : '8px 12px 8px 12px',
            minHeight          : 40,
            '& .list-item-text': {
                padding: '0 0 0 8px'
            }
        }
    }
}));

function FuseNavHorizontalItemLogoutUser(props)
{
    const dispatch = useDispatch();
    const classes = useStyles(props);

    const userLocale = useSelector(({ auth }) => auth.user.locale);
    let T = new MDText(i18n.get(userLocale)); 

    return (
        <ListItem
            button
            activeClassName="active"
            className={clsx(classes.item, 'list-item')}
            onClick={ev => dispatch(authActions.logoutUser())}
        >
            <Icon className="list-item-icon text-16 flex-shrink-0 mr-16" color="action">power_settings_new</Icon>
            <ListItemText className="list-item-text" primary={T.translate("FuseNavigation.exit")} classes={{primary: 'text-14 list-item-text-primary'}}/>
        </ListItem>
    );
}

const NavHorizontalItemLogoutUser = withRouter(React.memo(FuseNavHorizontalItemLogoutUser));

export default NavHorizontalItemLogoutUser;
