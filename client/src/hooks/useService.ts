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
        // console.log(response)
        setResponse(response);
      } catch (err) {
        // console.log(err)
        setError(err as Error);
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