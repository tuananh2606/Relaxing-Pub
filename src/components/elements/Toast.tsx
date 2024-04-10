import { ToastContainer, ToastContainerProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cn } from '~/lib/utils';

interface IToast extends ToastContainerProps {
  className?: string;
}

export const Toast = ({ className, ...props }: IToast) => {
  return <ToastContainer className={cn(className)} {...props} />;
};
