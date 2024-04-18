export function Footer() {
  return (
    <footer className="md:w-[500px] xl:w-full mx-auto flex justify-center xs:justify-start items-center xs:items-start text-center xs:text-left my-5 px-0 flex-col gap-2 pb-5 xl:pb-0">
      <div className="w-full grid grid-col-1 xs:grid-cols-3 [&_a]:text-[13px] hover:[&_a]:text-chinese-green">
        <div>
          <a href="#">Terms of Service</a>
        </div>
        <div className="md:text-center">
          <a href="#">Privacy Policy</a>
        </div>
        <div className="md:text-right">
          <a href="#">Protocol Disclaimer</a>
        </div>
      </div>

      <div className="w-full flex gap-2 justify-center xl:justify-start font-light text-xs text-gray-400 hover:[&>a]:text-gray-100 transition-all">
        &copy; 2023 Joint
      </div>
    </footer>
  );
}
