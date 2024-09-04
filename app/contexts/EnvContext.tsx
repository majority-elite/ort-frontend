import { createContext } from 'react';
import { type ClientEnv } from '@server/constants/env';

export const EnvContext = createContext<ClientEnv | null>(null);
