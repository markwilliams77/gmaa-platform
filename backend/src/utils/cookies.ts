export const parseCookies = (cookieHeader?: string): Record<string, string> => {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce<Record<string, string>>((acc, entry) => {
    const trimmed = entry.trim();
    if (!trimmed) {
      return acc;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      acc[trimmed] = "";
      return acc;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    try {
      acc[key] = decodeURIComponent(value);
    } catch {
      acc[key] = value;
    }
    return acc;
  }, {});
};

export const getCookieValue = (cookieHeader: string | undefined, key: string) => {
  return parseCookies(cookieHeader)[key] ?? null;
};

export const setAuthCookies = (res: any, accessToken: string, csrfToken: string) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("gmaa_access_token", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("gmaa_csrf_token", csrfToken, {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookies = (res: any) => {
  res.clearCookie("gmaa_access_token", { path: "/" });
  res.clearCookie("gmaa_csrf_token", { path: "/" });
};
