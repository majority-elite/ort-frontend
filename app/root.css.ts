import { globalFontFace, globalStyle, style } from '@vanilla-extract/css';
import { textStyle } from './styles/text.css';
import { themeVars } from './styles/theme.css';
import { rgba } from './utils/style';
import SUITVariable from '@/assets/SUIT-Variable.woff2';

globalFontFace('SUIT-Variable', {
  src: `url(${SUITVariable}) format('woff2')`,
  /** @link https://stackoverflow.com/questions/77467442/font-weight-too-bold-on-mobile */
  fontWeight: '100 900',
});

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  fontFamily: 'SUIT-Variable',
});

globalStyle('html', {
  fontSize: '62.5%',
});

globalStyle('body', {
  margin: 0,
});

globalStyle('h1, h2, h3, h4, h5, h6, p', {
  margin: 0,
});

globalStyle(
  `input[type="text"],
input[type="password"],
input[type="submit"],
input[type="search"],
input[type="tel"],
input[type="email"],
html input[type="button"],
input[type="reset"]`,
  {
    appearance: 'none',
    MozAppearance: 'none',
    WebkitAppearance: 'none',
    borderRadius: 0,
    WebkitBorderRadius: 0,
    MozBorderRadius: 0,
    outline: 0,
  },
);

export const loadingToast = style({
  position: 'fixed',
  bottom: '32px',
  left: '50%',
  transform: 'translate(-50%, 0)',
  backgroundColor: '#121212',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingRight: '12px',
  gap: '10px',
  width: '180px',
  height: '50px',
});

export const loadingLottie = style({
  width: '43px',
  height: '43px',
});

export const loadingToastText = style([
  textStyle.subtitle2SB,
  { color: themeVars.color.grayscale.white.hex },
]);

export const errorToastWrap = style({
  position: 'fixed',
  bottom: '32px',
  left: '50%',
  transform: 'translate(-50%, 0)',
  padding: '0 24px',
  width: '100%',
  maxWidth: '648px',
});

export const errorToast = style({
  backgroundColor: rgba(themeVars.color.system.caution.rgb, 0.7),
  borderRadius: '12px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '12px 24px',
});

export const errorToastText = style([
  textStyle.subtitle2SB,
  {
    color: themeVars.color.grayscale.white.hex,
    textAlign: 'center',
    wordBreak: 'keep-all',
  },
]);
