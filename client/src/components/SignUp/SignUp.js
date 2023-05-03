import React, { useState } from "react";

// Styling
import './style.scss';
import { registerAccount } from "api/Account";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isAccountExists, setIsAccountExists] = useState(false);
  const [formInfo, setFormInfo] = useState(
    {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    }
  );

  const handleInputChange = (event) => {
    event.persist();

    if (event.target.name === 'email') {
      setIsAccountExists(false);
    }

    if (event.target.name === 'password' || event.target.name === 'passwordConfirmation') {
      setIsPasswordError(false);
    }

    setFormInfo(info => ({ ...info, [event.target.name]: event.target.value }));
  }

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();

      if (formInfo.password !== formInfo.passwordConfirmation) {
        setIsPasswordError(true);
        return;
      }

      const result = await registerAccount(formInfo);
      if (!result) {
        setIsAccountExists(true);
      } else {
        navigate('/');
      }
    }
  }

  return (
    <div className="sign-up">
      <div className="register-title">
        Register a web chess account
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div>
              <label htmlFor="firstName">First Name</label>
            </div>
            <div>
              <input type="text" name="firstName" value={formInfo.firstName} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-group">
            <div>
              <label htmlFor="lastName">Last Name</label>
            </div>
            <div>
              <input type="text" name="lastName" value={formInfo.lastName} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-group">
            <div>
              <label htmlFor="email">Email</label>
            </div>
            <div>
              <input type="email" name="email" value={formInfo.email} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-group">
            <div>
              <label htmlFor="password">Password</label>
            </div>
            <div>
              <input type="password" name="password" value={formInfo.password} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-group">
            <div>
              <label htmlFor="passwordConfirmation">Confirm Password</label>
            </div>
            <div>
              <input type="password" name="passwordConfirmation" value={formInfo.passwordConfirmation} onChange={handleInputChange} required />
            </div>

            {isPasswordError ? (
              <div className="password-error">
                Passwords are not the same
              </div>
            ) : <></>}

            {isAccountExists ? (
              <div className="password-error">
                Email already exists
              </div>
            ) : <></>}
          </div>

          <input className="submit-button" type="submit" value="Submit" />

        </form>
      </div>
    </div>
  );
}

export default SignUp;