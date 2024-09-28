import { style } from '@vanilla-extract/css';
import { Breakpoint, textStyleInfo } from '@/constants/style';
import { textStyle } from '@/styles/text.css';
import { themeVars } from '@/styles/theme.css';
import { getMediaQuery } from '@/utils/style';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const titleArea = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '4px',
});

export const optionalText = style([
  textStyle.body2SB,
  {
    color: themeVars.color.grayscale.gray5.hex,
  },
]);

export const inputArea = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const caption = style([
  textStyle.body2R,
  {
    display: 'block',
    minHeight: `${textStyleInfo.body2R.pc.lineHeight}px`,
    '@media': {
      [getMediaQuery([Breakpoint.MOBILE2, Breakpoint.MOBILE1])]: {
        minHeight: `${textStyleInfo.body2R.mobile.lineHeight}px`,
      },
    },
  },
]);

export const errorText = style({
  color: themeVars.color.system.caution.hex,
});
