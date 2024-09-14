import { useContext } from 'react';
import { EnvContext } from '@/contexts/EnvContext';
import { type ClientEnv, clientEnvSchema } from '@server';

/**
 * 클라이언트용 환경 변수를 얻는 hook
 * @example
 * ```
 * const env = useEnv();
 * console.log(env.KAKAO_CLIENT_ID);
 * ```
 */
const useEnv = (): ClientEnv => {
  const envFromContext = useContext(EnvContext);

  const env = clientEnvSchema.parse(envFromContext);

  return env;
};

export default useEnv;
