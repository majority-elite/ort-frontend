/**
 * Media Query String을 얻는 함수
 * * 주어진 breakpoint 중 최소와 최대만 뽑는 것으로, 중간에 비어 있는 구간이 없음을 유의
 * (ex) [10, 12], [15, 18]이 주어질 경우, 13px-14px 구간이 비어야 하지만, 결과 string은 10px-18px 전부를 포함
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
