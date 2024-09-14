import { createContext } from 'react';
import { type ClientEnv } from '@server';

export const EnvContext = createContext<ClientEnv | null>(null);
