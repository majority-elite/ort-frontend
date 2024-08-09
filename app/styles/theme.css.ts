import { createGlobalTheme } from '@vanilla-extract/css';

export const themeVars = createGlobalTheme(':root', {
  color: {
    background: {
      general: '#FFFFFF',
      article: '#FBFAF6',
    },
    system: {
      caution: '#FF0000',
    },
    primary: {
      lighter: '#FAD6BD',
      light: '#F4A871',
      normal: '#EF7F2E',
      dark: '#DA6511',
      darker: '#AB4F0D',
    },
    grayscale: {
      white: '#FFFFFF',
      gray1: '#F9F9F9',
      gray2: '#EEEEEE',
      gray3: '#E0E0E0',
      gray4: '#BDBDBD',
      gray5: '#9E9E9E',
      gray6: '#757575',
      gray7: '#616161',
      gray8: '#424242',
      gray9: '#212121',
      black: '#1D1D1D',
    },
  },
});
