import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import i18n from "../i18n";
import { MDText } from 'i18n-react';
import AppContext from 'app/AppContext';
import CloseIcon from '@material-ui/icons/Close';
import * as Actions from '../../../store/actions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  buttonClose: {
    lineHeight: 'normal',
    background: '#f44336',
    color: 'white',
    fontWeight: 'bold',
    padding: '7px',
    '&:hover': {
      color: '#f44336',
      background: 'white'
    },
    '& svg': {
      fontSize: "20px",
    }
  },
  alignRigth: {
    flex: "none",
    marginLeft: "auto",
    marginRight: 0
  }
}));

function FooterLayout1(props) {
  const dispatch = useDispatch();
  const footerTheme = useSelector(({ fuse }) => fuse.settings.footerTheme);
  const classes = useStyles();
  const user = useSelector(({ auth }) => auth.user);
  const serviceWorkerRegistration = useSelector(({ nebulae }) => nebulae.serviceWorker.serviceWorkerRegistration);
  let T = new MDText(i18n.get(user.locale));
  const appContext = useContext(AppContext);

  const updateServiceWorker = () => {
    const registrationWaiting = serviceWorkerRegistration.waiting;
    if (registrationWaiting) {
      registrationWaiting.postMessage({ type: 'SKIP_WAITING' });

      registrationWaiting.addEventListener('statechange', e => {
        if (e.target.state === 'activated') {
          window.location.reload();
        }
      });
    }else {
      window.location.reload();
    }
  };
  const closeUpdateFooter = () => {
    dispatch(Actions.setServiceWorkerHideUpdate());
  };




  return (
    <ThemeProvider theme={footerTheme}>
      <AppBar id="fuse-footer" className="relative z-10" color="default">
        <Toolbar className="px-16 py-0 flex items-center">
          <Typography className="mr-10">
            {T.translate("Layout.updateVersion")}
          </Typography>
          <div className={`${classes.alignRigth}`}>
            <Button color="secondary" onClick={updateServiceWorker} variant="contained">{T.translate("Layout.update")}</Button>
            <IconButton className={`ml-10 ${classes.buttonClose}`} aria-label="delete" onClick={closeUpdateFooter}>
              <CloseIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default FooterLayout1;
