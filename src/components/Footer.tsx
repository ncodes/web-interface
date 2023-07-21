export function Footer() {
  return (
    <footer className="flex my-5 px-0 flex-col gap-2 ">
      <div className="font-light text-[14px] text-gray-400 hover:[&>a]:text-gray-100 transition-all">
        <a href="#">Terms of Service</a> - <a href="#">Privacy Policy</a> -{" "}
        <a href="#">Protocol Disclaimer</a>
      </div>
      <div className="font-light text-xs text-gray-400 hover:[&>a]:text-gray-100 transition-all">
        &copy; 2023 Joint Labs
      </div>
    </footer>
  );
}
