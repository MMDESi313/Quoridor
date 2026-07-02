import { Link } from "react-router-dom";

function Menu() {
  return (
    <section className="h-full flex flex-col">
      <div className="w-full h-full flex flex-col items-center justify-center gap-10">
        <span className="text-8xl font-bold">
          <span className="text-[#ff0000]">راه</span>{" "}
          <span className="text-[#0000ff]">بـــــــــــــند</span>
        </span>
        <div className="w-1/2 flex">
          <Link
            to={"/game"}
            className="w-1/2 bg-[#0000ff] p-4 rounded-r-full flex justify-center text-white font-bold"
          >
            بازی دو نفره (روی یک دستگاه)
          </Link>
          <button
            disabled
            className="w-1/2 bg-[#979797] p-4 rounded-l-full flex justify-center text-white font-bold cursor-not-allowed"
          >
            بازی با ربات
          </button>
        </div>
      </div>
    </section>
  );
}

export default Menu;
