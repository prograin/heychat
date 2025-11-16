export const REDIS_CHANNELS = {
  user: {
    button: {
      any: {
        clicked: "user:button:clicked",
        double_clicked: "user:button:double-clicked",
      },
    },
  },
  users: {
    presence: {
      updated: "users:presence:updated",
    },
  },
};

export const REDIS_STREAMS = {
  user: {
    name: "user",
    profile: { name: "user:profile" },
  },
};

export const REDIS_EVENTS = {
  user: {
    added: "USER_ADDED",
    deleted: "USER_DELETED",
    profile: {
      updated: "USER_PROFILE_UPDATED",
    },
  },
};

export const KEYS = {
  users: {
    presence: {
      last_active: `users:last_active`,
    },
  },
};

export const PREFIX_KEY = {
  chats: {
    requests: {
      key: (sender, reciever) => `chats:requests:${sender}_to_${reciever}`,
    },
    sessions: {
      has_active: {
        key: (userId) => `chats:sessions:has-active:${userId}`,
      },
    },
  },
  relations: {
    blocks: {
      key: (blocker, blocked) => `relations:blocks:${blocker}:${blocked}`,
    },
    contacts: {
      key: (user, contact) => `relations:contacts:${user}:${contact}`,
    },
  },
  profile: {
    username: {
      key: (value) => `profile:username:${value}`,
    },
  },
  user: {
    data: (value) => `user:${value}`,
    chats: {
      requests: {
        key: (value) => `user:chats:requests:${value}`,
      },
    },
    relations: {
      blocks: {
        key: (value) => `user:realtions:blocks:${value}`,
      },
    },
    profile: {
      data: (value) => `user:profile:${value}`,
    },
    token: {
      key: (value) => `user:token:${value}`,
    },
    telegram: {
      token: {
        key: (value) => `user:telegram:token:${value}`,
      },
      profile: {
        edit: {
          key: (value) => `user:telegram:profile:edit:${value}`,
        },
      },
      search: {
        key: (value1, value2) => `user:telegram:search:${value1}:${value2}`,
      },
    },
  },
  map: {
    telegram: {
      user: { key: (value) => `map:telegram:user:${value}` },
    },
    user: {
      telegram: {
        key: (value) => `map:user:telegram:${value}`,
      },
    },
  },
};
