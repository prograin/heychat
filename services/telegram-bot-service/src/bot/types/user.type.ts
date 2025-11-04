export default interface User {
  id?: bigint | null;
  telegram_id?: bigint | null;
  token?: string | null;
  exists: boolean;
  profile?: Record<string, any> | null;
  has_session: boolean;
  partner: {
    user_id: number | null;
    telegram_id: number | null;
    chat_id: number | null;
  };
  permissions: {
    search: string[] | null;
  };
}
