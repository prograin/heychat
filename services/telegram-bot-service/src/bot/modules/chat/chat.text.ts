export const requests_was_sent_text = (ms: number, more: number) => {
  const seconds = Math.floor(ms / 1000);
  const moreSeconds = Math.floor(more / 1000);

  return `Request was sent ${seconds} second${seconds !== 1 ? "s" : ""} ago. Please wait ${moreSeconds} more second${
    moreSeconds !== 1 ? "s" : ""
  } before trying again.`;
};
export const user_has_active_session = `You are already in a chat with someone and cannot send or accept a request.`;
export const send_request_text = `Your request has been sent.`;
export const recieved_request = (username: string) =>
  `You have a request from /username_${username}.\n If you want to start chatting, please press the Accept button.`;

export const decline_request_reciever = "You declined the request.";
export const decline_request_requester = (reciever: string | number) => `Your request was declined by /username_${reciever}.`;

export const accept_request_reciever = "You accepted the request. Say hi to your partner 👋";
export const accept_request_requester = "Your request was accepted! Say hi to your partner 👋";

export const warning_end_chat = `Are you sure you’d like to end the chat?`;
export const end_chat_partner_text = (username: string) => `Your partner /username_${username} has left the conversation.`;
export const end_chat_user_text = `You ended the conversation with your partner.`;
export const no_partner_exists = `You currently have no active partner.`;
