import { style } from '@vanilla-extract/css';
import { textStyle } from '@/styles/text.css';
import { themeVars } from '@/styles/theme.css';

export const container = style({
  width: 200,
  height: 40,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f2f2f2',
});

export const labelText = style([
  textStyle.body1R,
  {
    color: themeVars.color.primary.normal.hex,
  },
]);
