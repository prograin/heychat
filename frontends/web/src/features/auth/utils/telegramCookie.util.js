export const clearTelegramCookies = () => {
  const cookies = ["stel_acid", "stel_ssid", "stel_token"];

  cookies.forEach((name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.telegram.org`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.oauth.telegram.org`;
  });
};
