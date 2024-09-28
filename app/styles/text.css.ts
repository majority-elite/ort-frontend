import { type ComplexStyleRule, styleVariants } from '@vanilla-extract/css';
import { Breakpoint, textStyleInfo } from '@/constants/style';
import { getMediaQuery } from '@/utils/style';

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
    [getMediaQuery(Breakpoint.MOBILE1, Breakpoint.MOBILE2)]: {
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
