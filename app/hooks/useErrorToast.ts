import { create } from 'zustand';
import type { JsonValue, FrontendErrorResponse } from '@/types/api';

interface ErrorToastStore {
  error: FrontendErrorResponse<JsonValue> | null;
  setError: (newError: FrontendErrorResponse<JsonValue>) => void;
  clearError: () => void;
}

const useErrorToast = create<ErrorToastStore>()((set) => ({
  error: null,
  setError: (newError) => set({ error: newError }),
  clearError: () => set({ error: null }),
}));

export default useErrorToast;
