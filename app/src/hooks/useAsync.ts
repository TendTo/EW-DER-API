import { useCallback, useEffect, useState } from "react";

type AsyncState = "idle" | "pending" | "success" | "error";
type AsyncResponse<T, E = string> = {
  execute: () => Promise<void>;
  status: AsyncState;
  value: T | null;
  error: E | null;
};
type AsyncResponseParams<T, A, E = string> = {
  execute: (args: A) => Promise<void>;
  status: AsyncState;
  value: T | null;
  error: E | null;
};

export const defaultAsync: AsyncResponse<null, null> = {
  status: "idle",
  error: null,
  value: null,
  execute: async () => {},
};

export function useAsync<T, E = string>(
  asyncFunction?: () => Promise<T>,
  immediate = true,
): AsyncResponse<T, E> {
  const [status, setStatus] = useState<AsyncState>("idle");
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    if (!asyncFunction) return;
    setStatus("pending");
    setValue(null);
    setError(null);
    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus("success");
    } catch (error) {
      setError(error as E);
      setStatus("error");
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  return { execute, status, value, error };
}

export function useAsyncParams<T, A, E = string>(
  asyncFunction?: (args: A) => Promise<T>,
): AsyncResponseParams<T, A, E> {
  const [status, setStatus] = useState<AsyncState>("idle");
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(
    async (args: A) => {
      if (!asyncFunction) return;
      setStatus("pending");
      setValue(null);
      setError(null);
      try {
        const response = await asyncFunction(args);
        setValue(response);
        setStatus("success");
      } catch (error) {
        setError(error as E);
        setStatus("error");
      }
    },
    [asyncFunction],
  );
  return { execute, status, value, error };
}
