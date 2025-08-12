import React from 'react';
import {Icon, ListItem, ListItemText} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {withRouter} from 'react-router-dom';
import clsx from 'clsx';
import { useDispatch, useSelector} from 'react-redux';
import { MDText } from 'i18n-react';
import i18n from "../../i18n";

import * as authActions from 'app/auth/store/actions';

const useStyles = makeStyles(theme => ({
    item: {
        height                     : 40,
        width                      : 'calc(100% - 16px)',
        borderRadius               : '0 20px 20px 0',
        paddingRight               : 12,
        '&.active'                 : {
            backgroundColor            : theme.palette.secondary.main,
            color                      : theme.palette.secondary.contrastText + '!important',
            //pointerEvents              : 'none',
            transition                 : 'border-radius .15s cubic-bezier(0.4,0.0,0.2,1)',
            '& .list-item-text-primary': {
                color: 'inherit'
            },
            '& .list-item-icon'        : {
                color: 'inherit'
            }
        },
        '&.square, &.active.square': {
            width       : '100%',
            borderRadius: '0'
        },
        '& .list-item-icon'        : {},
        '& .list-item-text'        : {},
        color                      : theme.palette.text.primary,
        cursor                     : 'pointer',
        textDecoration             : 'none!important'
    }
}));

function FuseNavVerticalItemLogoutUser(props)
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

const NavVerticalItemLogoutUser = withRouter(React.memo(FuseNavVerticalItemLogoutUser));

export default NavVerticalItemLogoutUser;
