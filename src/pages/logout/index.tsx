// ** React Imports
import {useEffect} from "react";

// ** Import Next router
import {useRouter} from "next/router";

// ** Import authHook
import { useAuth } from "src/hooks/useAuth";

const LogoutPage = () => {

  const router = useRouter();
  const { logout } = useAuth();
  useEffect(() => {
    logout();
    router.push("/login");
  } , []);

  return null;
}

LogoutPage.acl = {
  action: "read",
  subject: "acl-page",
};

export default LogoutPage;
