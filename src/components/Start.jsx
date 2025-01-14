import styles from "../style";
import { robot } from "../assets";
import GetStarted from "./GetStarted";
import SearchBar from "./SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";

const Start = () => {
  const history = useNavigate();
  const navigateToSearchPage = (q) => {
    if (!q || q === "") {
      q = "*";
    }
    history("/search?q=" + q);
  };
  return (
    <SearchBar
      postSearchHandler={navigateToSearchPage}
      width={"h-[700px]"}
    ></SearchBar>
  );
};

export default Start;
