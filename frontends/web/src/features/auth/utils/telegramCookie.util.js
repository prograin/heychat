export function clearTelegramCookies() {
  const cookieDomains = ["telegram.org", "oauth.telegram.org"];
  cookieDomains.forEach((domain) => {
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.${domain};path=/`;
    });
  });
}
