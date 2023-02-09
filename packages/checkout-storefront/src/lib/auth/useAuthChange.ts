import { AuthState, AUTH_STATE_KEY, STORAGE_EVENT_KEY } from "./localStorage";

interface UseAuthChangeProps {
  onAuthSuccess: () => void;
  onAuthError: () => void;
}

export const useAuthChange = ({ onAuthSuccess, onAuthError }: UseAuthChangeProps) => {
  const handleAuthChange = (state: AuthState) => {
    if (state === "success") {
      onAuthSuccess();
    } else if (state === "fail") {
      onAuthError();
    }
  };

  const handleStorageChange = (event: StorageEvent | CustomEvent) => {
    const isCustomAuthEvent = event?.type === STORAGE_EVENT_KEY;

    const isStorageAuthEvent =
      event?.type === "storage" && (event as StorageEvent)?.key === AUTH_STATE_KEY;

    if (!isCustomAuthEvent && !isStorageAuthEvent) {
      return;
    }

    if (isCustomAuthEvent) {
      const {
        detail: { state },
      } = event as CustomEvent;

      handleAuthChange(state as AuthState);
      return;
    }

    const { newValue } = event as StorageEvent;
    handleAuthChange(newValue as AuthState);
  };

  // for current window
  window.addEventListener(STORAGE_EVENT_KEY, handleStorageChange as EventListener);
  //  for other windows
  window.addEventListener("storage", handleStorageChange);
};