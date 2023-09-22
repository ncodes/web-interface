export function Footer() {
  return (
    <footer className="flex my-5 px-0 flex-col gap-2 pb-5 xl:pb-0">
      <div className="flex gap-2 justify-center xl:justify-start font-light text-[14px] text-gray-400 hover:[&>a]:text-gray-100 transition-all">
        <span>
          <a href="#">Terms of Service</a>
        </span>
        <span>
          <a href="#">Privacy Policy</a>
        </span>
        <span>
          <a href="#">Protocol Disclaimer</a>
        </span>
      </div>
      <div className="flex gap-2 justify-center xl:justify-start font-light text-xs text-gray-400 hover:[&>a]:text-gray-100 transition-all">
        &copy; 2023 Joint Labs
      </div>
    </footer>
  );
}
