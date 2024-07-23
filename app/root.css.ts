import { globalFontFace, globalStyle } from '@vanilla-extract/css';
import SUITVariable from '@/assets/SUIT-Variable.woff2';

globalFontFace('SUIT-Variable', {
  src: `url(${SUITVariable}) format('woff2')`,
});

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  fontFamily: 'SUIT-Variable',
});

globalStyle('body', {
  margin: 0,
});

globalStyle('h1, h2, h3, h4, h5, h6, p', {
  margin: 0,
});
