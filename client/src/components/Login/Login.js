import React, { useState } from "react";

import { loginAccount, verifyAccount } from "api/Account";
import { useNavigate } from "react-router-dom";

// Styling
import './style.scss';

const Login = () => {

  const navigate = useNavigate();

  const [isPasswordError, setIsPasswordError] = useState(false);
  const [formInfo, setFormInfo] = useState(
    {
      email: "",
      password: "",
    }
  );

  const handleInputChange = (event) => {
    event.persist();
    if (event.target.name === 'password') {
      setIsPasswordError(false);
    }
    setFormInfo(info => ({ ...info, [event.target.name]: event.target.value }));
  }

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
      const result = await loginAccount(formInfo);
      if (!result) {
        setIsPasswordError(true);
      } else {
        navigate('/dashboard');
      }
    }
  }

  return (
    <div className="login">
      <div className="login-title">
        Login
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <div>
              <label htmlFor="email">Email</label>
            </div>
            <div>
              <input type="email" name="email" value={formInfo.email} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-group password">
            <div>
              <label htmlFor="password">Password</label>
            </div>
            <div>
              <input type="password" name="password" value={formInfo.password} onChange={handleInputChange} required />
            </div>
          </div>

          {isPasswordError ? (
            <div className="password-error">
              Invalid login
            </div>
          ) : <></>}

          <input className="submit-button" type="submit" value="Login" />

        </form>
      </div>
    </div>
  );
}

export default Login;