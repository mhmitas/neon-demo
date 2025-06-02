import Filter from "@/components/shared/Filter";
import ShowCollPagination from "@/components/shared/ShowCollPagination";
import { getMovies } from "@/lib/db/actions/movie.actions"; // Adjust path if necessary

export default async function HomePage(props: {
  searchParams?: Promise<{
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;

  const { shows, totalPages } = await getMovies({ page: currentPage, limit: 28 }); // Data fetched on the server

  return (
    <main className="min-h-screen p-8">
      {/* <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-10">Find Your Next Movie</h1> */}

      <section className="mb-10 space-y-10">
        <Filter heading="Find Your Next Show" />
        <ShowCollPagination shows={shows} page={currentPage} totalPages={totalPages} />
      </section>

      {/* You'll add your recommender features here */}
    </main>
  );
}