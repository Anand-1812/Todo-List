import { useContext } from "react";
import AuthContext from "Context/Context";
import BeforeLogin from "./Navbar/BeforeLogin";
import AfterLogin from "./Navbar/AfterLogin";

const Navbar = () => {
  const user = useContext(AuthContext);

  return user ? <AfterLogin user={user} /> : <BeforeLogin />;
};

export default Navbar;
