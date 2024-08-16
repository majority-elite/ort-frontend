/**
 * Media Query String을 얻는 함수
 *
 * - `Breakpoint` 객체와 함께 사용할 것을 권장
 *
 * - 주어진 breakpoint 중 최소와 최대만 뽑는 것으로, 중간에 비어 있는 구간이 없음을 유의
 * >- (ex) [10, 12], [15, 18]이 주어질 경우, 13px-14px 구간이 비어야 하지만, 결과 string은 10px-18px 전부를 포함
 *
 * - 이론상 가장 작은 breakpoint와 가장 큰 breakpoint만 포함해도 작동하지만,
 * 해당 스타일이 어떤 화면에 각각 적용되는지를 한 번에 파악하기 어려워 human error가 발생하기 쉬우므로
 * 모든 breakpoint를 명시하기를 권장
 * >- (ex)
 * ```
 * getMediaQuery([Breakpoint.MOBILE2, Breakpoint.TABLET2]) // (X) As-is
 * getMediaQuery([Breakpoint.MOBILE2, Breakpoint.MOBILE1, Breakpoint.TABLET2]) // (O) To-be
 * ```
 *
 * @param breakpoints [breakpoint 시작, breakpoint 끝] 타입의 모음
 * @returns Media Query String
 * @example
 * ```
 * const mediaQueryString = getMediaQuery([Breakpoint.MOBILE1, Breakpoint.MOBILE2]);
 * ```
 */
export const getMediaQuery = (
  breakpoints: readonly (readonly [number, number])[],
) => {
  const { minimum, maximum } = breakpoints.reduce(
    (prev, cur) => ({
      minimum: Math.min(prev.minimum, cur[0], cur[1]),
      maximum: Math.max(prev.maximum, cur[0], cur[1]),
    }),
    { minimum: Infinity, maximum: 0 },
  );
  return `screen and (min-width: ${minimum}px)${isFinite(maximum) ? `and (max-width: ${maximum}px)` : ''}`;
};

export const getRGBFromHex = (hex: string) => {
  const hexToConvert = hex.replace('#', '');
  const aRgbHex = hexToConvert.match(/.{1,2}/g);

  if (aRgbHex === null) {
    return { r: 0, g: 0, b: 0 };
  }

  return {
    r: parseInt(aRgbHex[0], 16),
    g: parseInt(aRgbHex[1], 16),
    b: parseInt(aRgbHex[2], 16),
  };
};

export const rgba = (cssVar: string, alpha: number) =>
  `rgba(${cssVar}, ${alpha})`;
