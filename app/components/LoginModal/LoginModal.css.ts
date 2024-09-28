import { style } from '@vanilla-extract/css';
import { Breakpoint } from '@/constants/style';
import { textStyle } from '@/styles/text.css';
import { themeVars } from '@/styles/theme.css';
import { getMediaQuery } from '@/utils/style';

export const background = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  position: 'fixed',
  top: '0px',
  left: '0px',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
});

export const modal = style({
  width: '384px',
  height: '492px',
  padding: '52px 24px 32px 24px',
  margin: '24px',
  backgroundColor: themeVars.color.grayscale.white.hex,
  display: 'flex',
  flexDirection: 'column',
  borderTopLeftRadius: '9999px',
  borderTopRightRadius: '9999px',
  borderBottomLeftRadius: '200px',
  borderBottomRightRadius: '200px',
  overflow: 'clip',
  '@media': {
    [getMediaQuery(Breakpoint.MOBILE1, Breakpoint.MOBILE2)]: {
      maxWidth: '384px',
      width: '100%',
      height: 'auto',
      aspectRatio: '384 / 429',
      padding:
        'min(calc((28 / 132) * (100% - 252px) + 24px), 52px) 24px 24px 24px',
    },
  },
});

export const modalContent = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100%',
});

export const logo = style({
  maxWidth: '480px',
  height: '200px',
  aspectRatio: '480 / 200',
  '@media': {
    [getMediaQuery(Breakpoint.MOBILE1, Breakpoint.MOBILE2)]: {
      width: `calc(100% + 60px + 48px)`,
      height: 'auto',
      maxWidth: 'calc(444px + 96px + 48px)',
    },
    [getMediaQuery([280, 340])]: {
      width: `calc(100% + 20px + 48px)`,
    },
  },
});

export const loginButton = style({
  width: '100%',
  height: '52px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#FEE500',
  paddingTop: '0px',
  paddingBottom: '0px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  '@media': {
    [getMediaQuery(Breakpoint.MOBILE1, Breakpoint.MOBILE2)]: {
      height: '44px',
    },
    [getMediaQuery([280, 340])]: {
      height: '40px',
    },
  },
});

export const text = style([
  textStyle.headline2B,
  {
    color: themeVars.color.grayscale.black.hex,
    width: '100%',
    textAlign: 'center',
    '@media': {
      [getMediaQuery(Breakpoint.MOBILE1, Breakpoint.MOBILE2)]: {
        maxHeight: '50px',
        overflow: 'hidden',
      },
      [getMediaQuery([280, 340])]: {
        fontSize: '16px',
        lineHeight: '20px',
      },
    },
  },
]);

export const kakaoText = style([
  textStyle.subtitle2B,
  {
    color: '#191919',
    '@media': {
      [getMediaQuery([280, 340])]: {
        paddingLeft: '12px',
      },
    },
  },
]);

export const kakaoIcon = style({
  position: 'absolute',
  left: '16px',
  width: '28px',
  height: '28px',
});
