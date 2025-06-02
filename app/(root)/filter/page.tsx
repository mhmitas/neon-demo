import Filter from '@/components/shared/Filter'
import ShowCollPagination from "@/components/shared/ShowCollPagination"
import { getMovies } from "@/lib/db/actions/movie.actions"
import React from 'react'

const FilterPage = async (props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        genre?: string;
        type?: string;
    }>;
}) => {

    const searchParams = await props.searchParams;
    // const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const genre = searchParams?.genre?.split("+")?.join(", ")
    const type = searchParams?.type

    const results = await getMovies({
        page: currentPage,
        limit: 28,
        type: type === "movie" ? "movie" : "tv show",
        genre
    })

    return (
        <section className='scroll-smooth space-y-10 my-container'>
            <div className='page-top-margin'>
                <Filter />
            </div>
            <ShowCollPagination
                shows={results?.shows}
                page={currentPage}
                totalPages={results?.totalPages}
            />
        </section>
    )
}

export default FilterPage;


export const metadata = {
    title: "Filter Movies & Series | Movies MH24",
    description: "Browse and filter movies and series by genre, type, and more on Movies MH24.",
};