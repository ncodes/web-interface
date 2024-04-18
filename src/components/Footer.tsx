export function Footer() {
  return (
    <footer className="flex my-5 px-0 flex-col gap-2 pb-5 xl:pb-0">
      <div className="grid grid-cols-3 [&_a]:text-[13px] hover:[&_a]:text-chinese-green">
        <div>
          <a href="#">Terms of Service</a>
        </div>
        <div className="text-center">
          <a href="#">Privacy Policy</a>
        </div>
        <div className="text-right">
          <a href="#">Protocol Disclaimer</a>
        </div>
      </div>

      <div className="flex gap-2 justify-center xl:justify-start font-light text-xs text-gray-400 hover:[&>a]:text-gray-100 transition-all">
        &copy; 2023 Joint Labs
      </div>
    </footer>
  );
}
