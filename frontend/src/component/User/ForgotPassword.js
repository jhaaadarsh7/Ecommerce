import React, { useEffect, useState } from "react";
import {useDispatch, useSelector } from "react-redux";
import { clearErrors, forgotpassword } from "../../actions/userAction";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import "./ForgotPassword.css";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { useAlert } from "react-alert";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, message, loading } = useSelector(
    (state) => state.forgotpassword
  );

  const [email, setEmail] = useState("");

  const forgotpasswordSubmi = (e) => {
    e.preventDefault();

    const myFrom = new FormData();

    myFrom.set("email", email);
    dispatch(forgotpassword(myFrom));
  };
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (message) {
      alert.success(message);
    }
  }, [dispatch, error, alert, message]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Forgot Password" />
          <div className="forgotPasswordContainer">
            <div className="forgotPasswordBox">
              <h2 className="forgotPasswordHeading">Forgot Password</h2>
              <form
                className="forgotPasswordForm"
                onSubmit={forgotpasswordSubmi}
              >
                <div className="forgotPasswordEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  value="Send"
                  className="forgotPasswordBtn"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ForgotPassword;
