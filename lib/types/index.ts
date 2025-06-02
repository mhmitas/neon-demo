export interface IShow {
    show_id: string;       // Primary key
    type?: string;          // e.g. Movie, TV Show
    title?: string;
    director?: string;
    cast_members?: string;  // comma separated or formatted string of cast
    country?: string;
    date_added?: string;    // date string in ISO format e.g. "2023-06-30"
    release_year?: number;
    rating?: string;
    duration?: string;
    listed_in?: string;     // categories/genres
    description?: string;
}

export type UrlQueryParams = {
    params: string
    key: string
    value: string | null
}

export type RemoveUrlQueryParams = {
    params: string
    keysToRemove: string[]
}
