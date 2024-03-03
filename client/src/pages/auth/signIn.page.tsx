import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';
import axios, { AxiosResponse } from 'axios';
import clsx from 'clsx';
import { AuthenticationInformation, Credentials, FormFieldProps } from '@types';
import { useAuth, Form, ToastMessage } from '@components';
import { API } from '@types';
import styles from '@sass/authLayout.module.sass';
import { useAuthLayoutContext } from '@layouts';
import { useState } from 'react';

const defaultValues: AuthenticationInformation = {
  username: '',
  password: '123456',
};

const fieldList: FormFieldProps[] = [
  {
    name: 'username',
    type: 'text',
    placeholder: 'Username',
    validation: {
      required: 'Username is required',
      minLength: {
        value: 3,
        message: 'Username must be at least 3 characters',
      },
    },
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Password',
    validation: {
      required: 'Password is required',
      minLength: {
        value: 6,
        message: 'Password must be at least 6 characters',
      },
    },
  },
];

function LoginPage() {
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { setAuthenticationStorage } = useAuth();
  const { className } = useAuthLayoutContext();

  const { setTitle }: { setTitle: React.Dispatch<React.SetStateAction<string>> } =
    useOutletContext();
  setTitle('sign in');

  const submitHandler: SubmitHandler<AuthenticationInformation> = async (data) => {
    axios
      .post('/api/auth/login', data)
      .then((res: AxiosResponse) => {
        const response: API = res.data;
        setAuthenticationStorage({ user: response.data as Credentials, isAuthenticated: true });
        navigate('/');
      })
      .catch((err) => {
        if (err.response) {
          setMessage(err.response.data.message);
          setShow(true);
        }
      });
  };

  return (
    <>
      {message && (
        <ToastMessage
          header="Message"
          message={message}
          className="m-4"
          show={show}
          setShow={setShow}
        />
      )}
      <Form
        fieldList={fieldList}
        defaultValues={defaultValues}
        submitHandler={submitHandler}
        fieldClass={className.formField}
        submitPlaceholder="Login"
        submitClass={clsx(styles['submit-btn'], 'btn', 'w-100 pt-2 my-2')}
      >
        <p className={clsx('text-center', 'my-1')}>--- or ---</p>
        <span className={clsx('d-flex justify-content-between', 'mt-4')}>
          <Link
            to="/register"
            className={clsx('link d-block', 'fs-6 text-reset text-decoration-none text-center')}
          >
            Sign up
          </Link>
          <Link
            to="/forgot-password"
            className={clsx('d-block link', 'fs-6 text-reset text-decoration-none text-center')}
          >
            Forgot password?
          </Link>
        </span>
      </Form>
    </>
  );
}

export default LoginPage;
