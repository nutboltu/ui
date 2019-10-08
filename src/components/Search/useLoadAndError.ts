import { useState } from 'react';

export const useLoadAndError = (): [boolean, boolean, boolean, Function] => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const setLoadAndError = (loading: boolean, loaded: boolean, error: boolean): void => {
    setLoading(loading);
    setLoaded(loaded);
    setError(error);
  };
  return [loading, loaded, error, setLoadAndError];
};
