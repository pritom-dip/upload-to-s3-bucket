import { useState } from 'react';

interface UseMutationProps {
  url: string;
  method?: 'POST' | 'PUT' | 'DELETE';
}

interface StateProps {
  isLoading: boolean;
  error: string | null;
}

const useMutation = ({ url, method = 'POST' }: UseMutationProps) => {
  const [state, setState] = useState<StateProps>({
    isLoading: false,
    error: null,
  });

  const fn = async (data: any) => {
    console.log({ data });
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));
    try {
      const response = await fetch(url, {
        method,
        body: data,
      });
      const json = await response.json();
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
      return json;
    } catch (error: any) {
      setState({ isLoading: false, error: error.message });
    }
  };

  return { state, mutate: fn };
};

export default useMutation;
