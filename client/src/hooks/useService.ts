import { useState, useEffect } from 'react';

const useService = <T>(get: () => Promise<T>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      try {
        const data = await get();
        setData(data);
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
    data,
  };
}

export default useService;