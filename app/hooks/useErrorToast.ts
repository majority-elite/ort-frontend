import { create } from 'zustand';
import { type FrontendErrorResponse } from '@server';

interface ErrorToastStore {
  error: FrontendErrorResponse<unknown> | null;
  setError: (newError: FrontendErrorResponse<unknown>) => void;
  clearError: () => void;
}

const useErrorToast = create<ErrorToastStore>()((set) => ({
  error: null,
  setError: (newError) => set({ error: newError }),
  clearError: () => set({ error: null }),
}));

export default useErrorToast;
