export const Breakpoint = {
  PC2: [1504, Infinity],
  PC1: [1140, 1503],
  TABLET2: [832, 1139],
  TABLET1: [728, 831],
  MOBILE2: [580, 727],
  MOBILE1: [0, 579],
} as const;

export const FontWeight = {
  HEAVY: 900,
  EXTRA_BOLD: 800,
  BOLD: 700,
  SEMI_BOLD: 600,
  MEDIUM: 500,
  REGULAR: 400,
  LIGHT: 300,
  EXTRA_LIGHT: 200,
  THIN: 100,
} as const;

interface TextStyleInfo {
  [styleName: string]: {
    [device in 'pc' | 'mobile']: {
      /** px 단위 */
      fontSize: number;
      /** px 단위 */
      lineHeight: number;
      fontWeight: number;
    };
  };
}

export const textStyleInfo = {
  headline1B: {
    pc: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: FontWeight.BOLD,
    },
    mobile: {
      fontSize: 26,
      lineHeight: 32,
      fontWeight: FontWeight.BOLD,
    },
  },
  headline2B: {
    pc: {
      fontSize: 24,
      lineHeight: 30,
      fontWeight: FontWeight.BOLD,
    },
    mobile: {
      fontSize: 20,
      lineHeight: 25,
      fontWeight: FontWeight.BOLD,
    },
  },
  subtitle1B: {
    pc: {
      fontSize: 20,
      lineHeight: 25,
      fontWeight: FontWeight.BOLD,
    },
    mobile: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: FontWeight.BOLD,
    },
  },
  subtitle2B: {
    pc: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: FontWeight.BOLD,
    },
    mobile: {
      fontSize: 14,
      lineHeight: 17,
      fontWeight: FontWeight.BOLD,
    },
  },
  subtitle2SB: {
    pc: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: FontWeight.SEMI_BOLD,
    },
    mobile: {
      fontSize: 14,
      lineHeight: 17,
      fontWeight: FontWeight.SEMI_BOLD,
    },
  },
  body1SB: {
    pc: {
      fontSize: 14,
      lineHeight: 17,
      fontWeight: FontWeight.SEMI_BOLD,
    },
    mobile: {
      fontSize: 12,
      lineHeight: 15,
      fontWeight: FontWeight.SEMI_BOLD,
    },
  },
  body1R: {
    pc: {
      fontSize: 14,
      lineHeight: 17,
      fontWeight: FontWeight.REGULAR,
    },
    mobile: {
      fontSize: 12,
      lineHeight: 15,
      fontWeight: FontWeight.REGULAR,
    },
  },
  body2SB: {
    pc: {
      fontSize: 12,
      lineHeight: 15,
      fontWeight: FontWeight.SEMI_BOLD,
    },
    mobile: {
      fontSize: 10,
      lineHeight: 12,
      fontWeight: FontWeight.SEMI_BOLD,
    },
  },
  body2R: {
    pc: {
      fontSize: 12,
      lineHeight: 15,
      fontWeight: FontWeight.REGULAR,
    },
    mobile: {
      fontSize: 10,
      lineHeight: 12,
      fontWeight: FontWeight.REGULAR,
    },
  },
} as const satisfies TextStyleInfo;
