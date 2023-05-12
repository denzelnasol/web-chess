import React, { useState } from "react";

// API
import { sendEmail } from "api/Email";

// Components
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Button from "components/Button/Button";

// Styling
import './style.scss';

const InviteDialog = ({ ...props }) => {

  const [email, setEmail] = useState('');

  const onSubmit = async (event) => {
    // event.preventDefault();
    console.log('submitted!', email, props.gameId)
    await sendEmail(email, props.gameId);
    props.updateInviteDialog();
  }
  console.log('email: ', email)
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }
  return (
    <div className="invite-dialog">
      <Dialog open={props.isInviteDialogOpen} onClose={props.updateInviteDialog}>
        <DialogTitle>Invite a friend</DialogTitle>
        <DialogContent>
          <form>
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
            onClick={onSubmit}
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