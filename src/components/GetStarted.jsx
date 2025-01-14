import styles from "../style";
import { arrowUp } from "../assets";
import { useNavigate } from "react-router-dom";
const GetStarted = () => {
  const history = useNavigate();

  return (
    <div
      className={`${styles.flexCenter} w-[140px] h-[50px] rounded-full bg-blue-gradient p-[2px] cursor-pointer`}
    >
      <div
        className={`${styles.flexCenter} flex-col bg-primary w-[100%] h-[100%] rounded-full`}
        onClick={() => history("/upload")}
      >
        <div className={`${styles.flexStart} flex-row`}>
          <p className="font-poppins font-medium text-[18px] leading-[23.4px]">
            <span className="text-gradient">Get Started</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
