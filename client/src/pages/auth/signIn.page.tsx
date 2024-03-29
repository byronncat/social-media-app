import { useLayoutEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';
import clsx from 'clsx';
import { Form } from '@components';
import { useGlobalContext, useStorageContext } from '@contexts';
import { useAuthLayoutContext } from '@layouts';
import { loginAPI } from '@services';
import { loginField } from '../../constants';
import { AuthenticationInformation } from '@types';
import styles from '@styles/layout/auth.module.sass';

const defaultValues: AuthenticationInformation = {
  email: 'withdanh@gmail.com',
  password: '123456',
};

function LoginPage() {
  const navigate = useNavigate();
  const { className } = useAuthLayoutContext();
  const { displayToast } = useGlobalContext();
  const { setAuthenticationStorage } = useStorageContext();

  const { setTitle }: { setTitle: React.Dispatch<React.SetStateAction<string>> } =
    useOutletContext();
  useLayoutEffect(() => {
    setTitle('sign in');
  }, [setTitle]);

  const submitHandler: SubmitHandler<AuthenticationInformation> = async (data) => {
    displayToast("Waiting for server's response", 'loading');
    const response = await loginAPI(data);
    if (response.success && response.data) {
      setAuthenticationStorage({ user: response.data, isAuthenticated: true });
      navigate('/');
    }
    displayToast(response.message, response.success ? 'success' : 'error');
  };

  return (
    <>
      <Form
        fieldList={loginField}
        defaultValues={defaultValues}
        submitHandler={submitHandler}
        fieldClass={className}
        submitPlaceholder="Login"
        submitClass={clsx(styles['submit-btn'], 'btn', 'w-100 pt-2 my-2')}
      >
        <p className={clsx('text-center', 'my-1')}>--- or ---</p>
        {/* <span className={clsx('d-flex justify-content-between', 'mt-4')}> */}
        <Link to="/register" className={clsx('link d-block', 'text-center fs-6')}>
          Sign up
        </Link>
        {/* <Link to="/forgot-password" className={clsx('d-block link', 'text-center fs-6')}>
            Forgot password?
          </Link>
        </span> */}
      </Form>
    </>
  );
}

export default LoginPage;
