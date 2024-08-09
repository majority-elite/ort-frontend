import { ComplexStyleRule, styleVariants } from '@vanilla-extract/css';
import { Breakpoint } from '@/constants/style';
import { getMediaQuery } from '@/utils/style';

const FontWeight = {
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

const textStyleInfo = {
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
  header2B: {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTypedKeysFromObject = <T extends Record<string, any>>(
  object: T,
): (keyof T)[] => Object.keys(object);

const getTextStyleFromInfo = <
  T extends (typeof textStyleInfo)[keyof typeof textStyleInfo],
>(
  info: T,
): ComplexStyleRule => ({
  fontSize: `${info.pc.fontSize / 10}rem`,
  lineHeight: `${info.pc.lineHeight / 10}rem`,
  fontWeight: info.pc.fontWeight,
  '@media': {
    [getMediaQuery([Breakpoint.MOBILE1, Breakpoint.MOBILE2])]: {
      fontSize: `${info.mobile.fontSize / 10}rem`,
      lineHeight: `${info.mobile.lineHeight / 10}rem`,
      fontWeight: info.mobile.fontWeight,
    },
  },
});

export const textStyle = styleVariants(
  getTypedKeysFromObject(textStyleInfo).reduce<{
    [key in keyof typeof textStyleInfo]: ComplexStyleRule;
  }>(
    (prev, styleName) => ({
      ...prev,
      [styleName]: getTextStyleFromInfo(textStyleInfo[styleName]),
    }),
    {} as {
      [key in keyof typeof textStyleInfo]: ComplexStyleRule;
    },
  ),
);
