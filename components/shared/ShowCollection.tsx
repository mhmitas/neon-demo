import { IShow } from "@/lib/types"
import React from 'react'
import ShowCard from "./ShowCard"

const ShowCollection = ({ shows }: { shows: IShow[] }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shows.map((show) => (
                <ShowCard key={show.show_id} show={show} />
            ))}
        </div>
    )
}

export default ShowCollection