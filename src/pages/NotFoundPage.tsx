import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="h-dvh flex">
      <div className="h-full w-1/2 bg-[#0000FF25] absolute -z-10 right-0" />
      <div className="h-full w-1/2 bg-[#FF000025] absolute -z-10 left-0" />

      <div className="w-full h-full flex flex-col justify-center items-center">
        <h1 className="text-9xl font-bold text-[#FF0000]">۴۰۴</h1>
        <p className="font-semibold text-[#0000FF] text-xl">
          صفحه مورد نظر وجود ندارد!
        </p>
        <Link
          to={"/"}
          className="text-white text-xl bg-[#0000FF] py-2 px-8 mt-8 rounded-xl"
        >
          خانه
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
