import Logo from "../../components/logo";
export default function layout({ children }) {
  return (
    <div className="flex justify-center h-screen w-full flex-col m-auto items-center">
      <Logo />
      <div className="mt-7"> {children}</div>
    </div>
  );
}
