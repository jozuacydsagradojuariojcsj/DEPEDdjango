import React from "react";

const ForgotPasswordDialog = ({
  isOpen,
  onClose,
  setForgotPassword,
  forgotPassword,
  onSubmit,
}) => {
  return (
    <dialog className="modal" open={isOpen}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Forgot Password</h3>
        <p className="py-4">
          Enter your email so that we can send a link to reset your password
        </p>

        <input
          className="border border-black rounded-md w-full h-10 p-2"
          placeholder="Email"
          onChange={setForgotPassword}
          value={forgotPassword}
        />
        <button className="btn btn-outline mt-2" onClick={onSubmit}>
          Send
        </button>
        <button className="btn btn-outline mt-2 ml-2" onClick={onClose}>
          Cancel
        </button>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default ForgotPasswordDialog;
