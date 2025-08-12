# Enterprise Management Interface

EMI shell based on REACT 16.  9

Work in progress!!!

## Running on local environment

```bash
cd frontend/emi/
yarn install
npm start
```

## Change Logos

### WebPAge ICO
Replace the favicon.ico file at public/favicon.ico

### Splash + Nav Logos using SVG
Put the .svg logo at public/assets/images  
Inside the .env file replace the values for the keys REACT_APP_SHELL_SPLASH_LOGO and REACT_APP_SHELL_SIDE_NAV_LOGO with the same .svg path
### Splash + Nav Logos using PNG
at public/assets/images add logos for the following size:
- 32x32
- 192x192

Inside the .env file replace the values for the keys:
- REACT_APP_SHELL_SPLASH_LOGO with the 128x128 logo
- REACT_APP_SHELL_SIDE_NAV_LOGO with the 32x32 logo

### SideNav text
Inside the .env file replace the value for the key REACT_APP_SHELL_SIDE_NAV_TEXT with desired text

## References

i18n => https://github.com/alexdrel/i18n-react#readme
Environment Variables => https://create-react-app.dev/docs/adding-custom-environment-variables/