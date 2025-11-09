import { InlineButton, InlineCallback } from "src/bot/buttons/inline.button";
import { KeyboardName } from "src/bot/buttons/keyboard.button";

export const ma_send_request_in = (userId: string) => {
  return [
    [
      {
        text: InlineButton.in_accept_request_b.text,
        callback_data: InlineButton.in_accept_request_b.callback_data.replace("{userId}", userId),
      },
      {
        text: InlineButton.in_decline_request_b.text,
        callback_data: InlineButton.in_decline_request_b.callback_data.replace("{userId}", userId),
      },
    ],
  ];
};

export const ma_accept_request_ke = [[{ text: KeyboardName.ke_end_chat_n }, { text: KeyboardName.ke_partner_profile_n }]];

export const ma_warning_end_chat_in = (userId: string) => [
  [
    {
      text: InlineButton.in_end_chat_b.text,
      callback_data: InlineButton.in_end_chat_b.callback_data.replace("{userId}", userId),
    },
    InlineButton.in_cancel_b,
  ],
];
