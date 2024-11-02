import { type PropsWithChildren, createContext, useContext } from "react";
import { useStorageState } from "./secure";

const AuthContext = createContext<{
  signIn: (data: string) => void;
  signOut: () => void;
  session?: string | null;
  loading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  loading: false
});

export const useSession = () => {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
};

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [[loading, session], setSession] = useStorageState("session");

  return (
    <AuthContext.Provider
      value={{
        signIn: (data) => {
          setSession(data);
        },
        signOut: () => {
          setSession(null);
        },
        session,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
