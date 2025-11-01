import { useState, useEffect, useCallback } from 'react';
import { errorHandler, AppError } from '@/lib/errors';

/**
 * Custom hook for handling async operations with consistent loading and error states
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = [],
  options: {
    immediate?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const { immediate = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(immediate);
  }, [immediate]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * Hook for handling async operations with retry capability
 */
export function useAsyncWithRetry<T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = [],
  options: {
    immediate?: boolean;
    retryCount?: number;
    retryDelay?: number;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const { immediate = true, retryCount = 3, retryDelay = 1000, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState<number>(0);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      setData(result);
      setAttempt(0);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      if (attempt < retryCount) {
        setAttempt((prev) => prev + 1);
        setTimeout(() => {
          execute();
        }, retryDelay * Math.pow(2, attempt)); // Exponential backoff
        return;
      }

      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setAttempt(0);
    setLoading(immediate);
  }, [immediate]);

  return {
    data,
    loading,
    error,
    attempt,
    execute,
    reset,
  };
}

/**
 * Hook for handling async operations with caching
 */
export function useAsyncWithCache<T>(
  key: string,
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = [],
  options: {
    immediate?: boolean;
    cacheTime?: number;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const { immediate = true, cacheTime = 5 * 60 * 1000, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    // Check cache first
    const cached = sessionStorage.getItem(`cache_${key}`);
    if (cached) {
      const { data: cachedData, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < cacheTime) {
        setData(cachedData);
        setLoading(false);
        return cachedData;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      setData(result);

      // Cache the result
      sessionStorage.setItem(
        `cache_${key}`,
        JSON.stringify({ data: result, timestamp: Date.now() })
      );

      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [key, ...dependencies]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  const clearCache = useCallback(() => {
    sessionStorage.removeItem(`cache_${key}`);
    setData(null);
  }, [key]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(immediate);
  }, [immediate]);

  return {
    data,
    loading,
    error,
    execute,
    clearCache,
    reset,
  };
}

/**
 * Hook for handling promise-based state (similar to React Query)
 */
export function usePromise<T>(
  promise: Promise<T> | null,
  options: {
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const { enabled = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!promise || !enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    let mounted = true;

    promise
      .then((result) => {
        if (mounted) {
          setData(result);
          onSuccess?.(result);
        }
      })
      .catch((err) => {
        if (mounted) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          onError?.(error);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [promise, enabled]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    reset,
  };
}
