import { IShow } from "@/lib/types"
import Link from "next/link"
import React from 'react'

const ShowCard = ({ show }: { show: IShow }) => {
    return (
        <Link href={`/movies/${show.show_id}`} key={show.show_id}>
            <div className="border p-4 rounded-lg shadow-md h-full hover:scale-105 transition-all bg-card space-y-2">
                <h3 className="text-lg font-medium line-clamp-2">{show.title} ({show.release_year})</h3>
                <p className="text-sm line-clamp-2 text-muted-foreground">{show.type} | {show.listed_in}</p>
                <p className="text-muted-foreground text-sm line-clamp-3">{show.description}</p>
                {show.director && <p className="text-xs text-muted-foreground">Director: {show.director}</p>}
            </div>
        </Link>
    )
}

export default ShowCard