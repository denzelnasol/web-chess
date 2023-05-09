import React, { useState } from "react";

// Emailing
import emailjs from "emailjs-com";
import { serviceId, templateId, publicKey } from "emailkey";

// Components
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Button from "components/Button/Button";

// Styling
import './style.scss';

const InviteDialog = ({ ...props }) => {

  const [email, setEmail] = useState('');

  const sendEmail = async (event) => {
    event.preventDefault();
    await emailjs.sendForm(serviceId, templateId, event.target, publicKey);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }
  return (
    <div className="invite-dialog">
      <Dialog open={props.isInviteDialogOpen} onClose={props.updateInviteDialog}>
        <DialogTitle>Modal Dialog Title</DialogTitle>
        <DialogContent>
          <form onSubmit={sendEmail}>
            <label>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                name="email"
              />
            </label>

          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.updateInviteDialog}
            noLink={true}
          >
            Cancel
          </Button>

          <Button
            onClick={sendEmail}
            noLink={true}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InviteDialog;