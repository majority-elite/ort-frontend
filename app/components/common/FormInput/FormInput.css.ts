import { style } from '@vanilla-extract/css';
import { Breakpoint } from '@/constants/style';
import { textStyle } from '@/styles/text.css';
import { themeVars } from '@/styles/theme.css';
import { getMediaQuery } from '@/utils/style';

export const textInputContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0 12px',
  gap: '10px',
  borderRadius: '8px',
  backgroundColor: themeVars.color.background.article.hex,
  borderColor: 'transparent',
  borderStyle: 'solid',
  borderWidth: '1px',
  height: '33px',
  '@media': {
    [getMediaQuery([Breakpoint.MOBILE2, Breakpoint.MOBILE1])]: {
      gap: '6px',
      height: '31px',
    },
  },
});

export const blank = style({
  color: themeVars.color.grayscale.gray5.hex,
});

export const textInputIcon = style({
  width: '16px',
  height: '16px',
  '@media': {
    [getMediaQuery([Breakpoint.MOBILE2, Breakpoint.MOBILE1])]: {
      width: '12px',
      height: '12px',
    },
  },
});

export const textInput = style([
  textStyle.body1R,
  {
    flex: 1,
    color: themeVars.color.grayscale.black.hex,
    border: 0,
    backgroundColor: 'transparent',
    '::placeholder': {
      color: themeVars.color.grayscale.gray5.hex,
    },
  },
]);

export const imageInputContainer = style({
  width: '100px',
  height: '100px',
  borderRadius: '50px',
  backgroundColor: themeVars.color.background.article.hex,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  appearance: 'none',
  padding: 0,
  border: 0,
  cursor: 'pointer',
  overflow: 'hidden',
  '@media': {
    [getMediaQuery([Breakpoint.MOBILE2, Breakpoint.MOBILE1])]: {
      width: '80px',
      height: '80px',
      borderRadius: '40px',
    },
  },
});

export const imageInput = style({
  display: 'none',
  position: 'absolute',
});

export const imageInputPreview = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const error = style({
  borderColor: themeVars.color.system.caution.hex,
  borderStyle: 'solid',
  borderWidth: '1px',
});
