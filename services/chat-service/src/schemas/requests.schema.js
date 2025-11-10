import joi from "joi";
import { CHAT_REQUEST_STATUS } from "../../../../shared/constants/status.js";

export const createOrUpdateRequestsSchema = joi.object({
  sender_user_id: joi.number().optional(),
  reciever_user_id: joi.number().required(),
  status: joi.string().valid(...CHAT_REQUEST_STATUS),
});
