type ReturnType = {
  id: string;
  role: string;
  authorizationId: string;
  iat: number;
  exp: number;
};

const hasBuffer = typeof Buffer === "undefined";
const decoded = (str: string): string =>
  hasBuffer ? atob(str) : Buffer.from(str, "base64").toString("binary");

export const parseJwt = (token: string): ReturnType => {
  try {
    const splited = token.split(".")[1] ?? "";
    return JSON.parse(decoded(splited));
  } catch {
    return { id: "", role: "", authorizationId: "", iat: 0, exp: 0 };
  }
};
