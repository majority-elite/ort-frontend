import { style, styleVariants } from '@vanilla-extract/css';
import { Breakpoint } from '@/constants/style';
import { themeVars } from '@/styles/theme.css';
import { getMediaQuery, rgba } from '@/utils/style';

export const buttonBase = style({
  cursor: 'pointer',
  ':disabled': {
    cursor: 'not-allowed',
  },
});

export const buttonStyleByVariant = styleVariants({
  primary: {
    backgroundColor: themeVars.color.primary.normal.hex,
    color: themeVars.color.grayscale.white.hex,
    border: 0,
    ':hover': {
      backgroundColor: themeVars.color.primary.dark.hex,
    },
    ':active': {
      backgroundColor: themeVars.color.primary.darker.hex,
    },
    ':disabled': {
      backgroundColor: themeVars.color.grayscale.gray2.hex,
      color: themeVars.color.grayscale.gray4.hex,
    },
  },
  secondary: {
    color: themeVars.color.primary.normal.hex,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: themeVars.color.primary.normal.hex,
    backgroundColor: 'transparent',
    ':hover': {
      backgroundColor: rgba(themeVars.color.primary.normal.rgb, 0.1),
    },
    ':active': {
      backgroundColor: rgba(themeVars.color.primary.normal.rgb, 0.2),
    },
    ':disabled': {
      backgroundColor: 'transparent',
      borderColor: themeVars.color.grayscale.gray3.hex,
      color: themeVars.color.grayscale.gray4.hex,
    },
  },
});

export const buttonStyleBySize = styleVariants({
  small: {
    padding: '6px 12px',
    borderRadius: '12px',
    '@media': {
      [getMediaQuery([Breakpoint.MOBILE1, Breakpoint.MOBILE2])]: {
        padding: '6px 12px',
        borderRadius: '10px',
      },
    },
  },
  medium: {
    padding: '12px 28px',
    borderRadius: '12px',
    '@media': {
      [getMediaQuery([Breakpoint.MOBILE1, Breakpoint.MOBILE2])]: {
        padding: '10px 24px',
        borderRadius: '10px',
      },
    },
  },
  large: {
    padding: '12px 32px',
    borderRadius: '12px',
    '@media': {
      [getMediaQuery([Breakpoint.MOBILE1, Breakpoint.MOBILE2])]: {
        padding: '12px 32px',
        borderRadius: '12px',
      },
    },
  },
});
