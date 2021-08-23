import { useHistory } from 'react-router-dom';

export const useRouter: any = () => {
  const history = useHistory();
  return history;
};
