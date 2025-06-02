import React from 'react'
import PaginationComponent from "./Pagination"
import ShowCollection from "./ShowCollection"
import { IShow } from "@/lib/types"

const ShowCollPagination = ({ shows, page, totalPages }: { shows: IShow[], page: number, totalPages: number }) => {
    return (
        <div className="space-y-10">
            <PaginationComponent page={page} totalPages={totalPages} />
            <ShowCollection shows={shows} />
            <PaginationComponent page={page} totalPages={totalPages} />
        </div>
    )
}

export default ShowCollPagination