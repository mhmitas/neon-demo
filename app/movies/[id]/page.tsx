import { getMovieById, getMoviesByDirector, getMoviesByGenre } from "@/lib/db/actions/movie.actions";
import { IShow } from "@/lib/types";

export default async function MoviePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const movie = await getMovieById(params.id);

    if (!movie) {
        return <main className="min-h-screen p-8 text-center text-red-500">Movie not found.</main>;
    }

    // Fetch recommendations
    const recommendedByDirector = movie.director
        ? await getMoviesByDirector(movie.director, movie.show_id)
        : [];

    // Assuming 'listed_in' contains comma-separated genres, pick the first one for simplicity
    const genres = movie.listed_in ? movie.listed_in.split(',').map((g: string) => g.trim()) : [];
    const primaryGenre = genres.length > 0 ? genres[0] : null;
    const recommendedByGenre = primaryGenre
        ? await getMoviesByGenre(primaryGenre, movie.show_id)
        : [];

    return (
        <main className="min-h-screen max-w-3xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-center mb-10">{movie.title} ({movie.release_year})</h1>
            <p className="mb-4 italic text-muted-foreground">{movie.description}</p>

            <table className="mb-8 h-max">
                <tbody className="text-muted-foreground">
                    <MetadataRow data={movie.type || 'N/A'} label="Type" />
                    <MetadataRow data={movie.listed_in || 'N/A'} label="Genre" />
                    <MetadataRow data={movie.release_year || 'N/A'} label="Released" />
                    <MetadataRow data={movie.rating || 'N/A'} label="Rated" />
                    <MetadataRow data={movie.cast_members || 'N/A'} label="Cast" />
                    <MetadataRow data={movie.country || 'N/A'} label="Country" />
                    <MetadataRow data={movie.director || 'N/A'} label="Director" />
                </tbody>
            </table>

            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-4">More by {movie.director || 'this director'}</h2>

                <CardGrid shows={recommendedByDirector} fallback="No more movies by this director found" />
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Similar {primaryGenre ? `${primaryGenre} ` : ''}Titles</h2>
                <CardGrid shows={recommendedByGenre} fallback="No similar titles found" />
            </section>
        </main>
    );
}


function CardGrid({ shows, fallback }: { shows: IShow[], fallback: string }) {

    if (shows.length > 0) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shows.map((show: IShow) => (
                    <div key={show.show_id} className="border p-4 rounded shadow-sm bg-card">
                        <h3 className="text-lg font-medium">{show.title}</h3>
                        <p className="text-sm text-muted-foreground">{show.type} • {show.release_year} • {show.type === 'TV Show' ? show.duration : show.duration + "m"}</p>
                    </div>
                ))}
            </div>
        )
    } else {
        return (
            <p className="text-muted-foreground">{fallback ? fallback : 'Not found.'}</p >
        )
    }
}

function MetadataRow({ data, label }: { data: string, label: string }) {
    return (
        <tr>
            <td className="font-semibold py-1 pl-0 pr-4 flex items-start">{label}</td>
            <td className="p-1 pr-0">{String(data)}</td>
        </tr>
    )

}