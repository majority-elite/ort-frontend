import { globalFontFace, globalStyle } from '@vanilla-extract/css';
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
