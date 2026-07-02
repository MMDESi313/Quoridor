import { Link } from "react-router-dom";

function Menu() {
  return (
    <section className="h-full flex flex-col">
      <div className="w-full h-full flex flex-col items-center justify-center gap-10">
        <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold">
          <span className="text-[#ff0000]">راه</span>{" "}
          <span className="text-[#0000ff]">بـــــــــــــند</span>
        </span>
        <div className="w-10/12 sm:w-9/12 md:w-7/12 lg:w-1/2 flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Link
            to={"/game"}
            className="w-full sm:w-1/2 bg-[#0000ff] p-4 rounded-full sm:rounded-none sm:rounded-r-full flex justify-center text-white font-bold text-center text-sm md:text-[1rem]"
          >
            بازی دو نفره (روی یک دستگاه)
          </Link>
          <button
            disabled
            className="w-full sm:w-1/2 bg-[#979797] p-4 rounded-full sm:rounded-none sm:rounded-l-full flex justify-center text-white font-bold cursor-not-allowed text-center text-sm md:text-[1rem]"
          >
            بازی با ربات
          </button>
        </div>
      </div>
    </section>
  );
}

export default Menu;
