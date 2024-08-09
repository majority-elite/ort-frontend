import { createGlobalTheme } from '@vanilla-extract/css';
import { getRGBFromHex } from '@/utils/style';

const getColorVarsFromHex = (hex: string) => ({
  hex,
  rgb: getRGBFromHex(hex).join(', '),
});

export const themeVars = createGlobalTheme(':root', {
  color: {
    background: {
      general: getColorVarsFromHex('#FFFFFF'),
      article: getColorVarsFromHex('#FBFAF6'),
    },
    system: {
      caution: getColorVarsFromHex('#FF0000'),
    },
    primary: {
      lighter: getColorVarsFromHex('#FAD6BD'),
      light: getColorVarsFromHex('#F4A871'),
      normal: getColorVarsFromHex('#EF7F2E'),
      dark: getColorVarsFromHex('#DA6511'),
      darker: getColorVarsFromHex('#AB4F0D'),
    },
    grayscale: {
      white: getColorVarsFromHex('#FFFFFF'),
      gray1: getColorVarsFromHex('#F9F9F9'),
      gray2: getColorVarsFromHex('#EEEEEE'),
      gray3: getColorVarsFromHex('#E0E0E0'),
      gray4: getColorVarsFromHex('#BDBDBD'),
      gray5: getColorVarsFromHex('#9E9E9E'),
      gray6: getColorVarsFromHex('#757575'),
      gray7: getColorVarsFromHex('#616161'),
      gray8: getColorVarsFromHex('#424242'),
      gray9: getColorVarsFromHex('#212121'),
      black: getColorVarsFromHex('#1D1D1D'),
    },
  },
});
