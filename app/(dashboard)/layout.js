import NavBar from "@/components/NavBar";
function layout({ children }) {
  return (
    <div className="relative flex h-screen w-full flex-col">
      <NavBar />
      <div className="w-full">{children}</div>
    </div>
  );
}

export default layout;
