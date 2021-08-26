import React, { useState, useContext } from 'react';
import styles from './Login.module.scss';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as EmailValidator from 'email-validator';
import Loader from 'react-loader-spinner';
import { tokenContext } from '../../App';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState({ email: true, password: true });
  const [isLoading, setIsLoading] = useState(false);

  const { token, setToken } = useContext(tokenContext);

  const passwordValidation = (pass) => {
    if (pass.length < 7) return false; // Invalid password if not contains at list 8 chars
    if (!pass.match(/^[A-Za-z0-9]*$/)) return false; // Invalid password if contains non-English letters
    if (!pass.match(/^(?=.*[A-Z])(?=.*\d).*$/)) return false; // Invalid password if not contains at list one capital and one numeber
    return true;
  };

  const emailValidation = (e) => {
    return EmailValidator.validate(e); // validate the email
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validation.email || !validation.password) return;
    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://private-052d6-testapi4528.apiary-mock.com/authenticate',
        { email, password }
      );
      console.log(response);
      sessionStorage.setItem('token', response.data[0].token);
      setToken(response.data[0].token);
    } catch {
      window.alert('Something get wrong, try again');
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setValidation((prev) => ({ ...prev, email: emailValidation(value) }));
    setEmail(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setValidation((prev) => ({ ...prev, password: passwordValidation(value) }));
    setPassword(value);
  };

  if (token) {
    return <Redirect to="/info" />;
  }

  return (
    <div className={styles.loginForm}>
      <form onSubmit={handleSubmit}>
        <div className={styles.emailInput}>
          <label htmlFor="email" className="form-label">
            Email address:
          </label>
          <input
            required
            onChange={handleEmailChange}
            type="text"
            className={
              'form-control ' + (validation.email ? null : 'is-invalid')
            }
            id="email"
            value={email}
          />
          <div className={styles.errorMessage + ' invalid-feedback'}>
            Invalid Email.
          </div>
        </div>
        <div className={styles.passwordInput}>
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            required
            onChange={handlePasswordChange}
            type="password"
            className={
              'form-control ' + (validation.password ? null : 'is-invalid')
            }
            id="password"
            value={password}
          />
          <div className={styles.errorMessage + ' invalid-feedback'}>
            Password must contains at list 8 characters, one capital, one number
            and only english letters.
          </div>
        </div>
        <div className="d-grid">
          <button className="btn btn-primary">
            Login{' '}
            {isLoading && (
              <Loader
                color="white"
                height={20}
                width={20}
                className={styles.loader}
                type="TailSpin"
              />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
