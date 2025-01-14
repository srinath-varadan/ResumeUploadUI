import { ThreeDots } from "react-loader-spinner";
const Loader = (isLoading) => {
  return (
    <ThreeDots
      visible={isLoading}
      height="80"
      width="80"
      color="#4fa94d"
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperStyle={{
        zIndex: 1100,
      }}
      wrapperClass="flex justify-center"
    />
  );
};
export default Loader;
