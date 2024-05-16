import { ApiResponse } from 'constants/types';
import { useState, useEffect } from 'react';

const useService = <T>(get: () => Promise<T>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      try {
        const response = await get();
        setResponse(response);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [get]);

  return {
    loading,
    error,
    response,
  };
}

export default useService;