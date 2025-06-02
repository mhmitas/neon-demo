"use server"

import { IShow } from "@/lib/types";
import { sql } from "../db";
import fs from "fs";

// Interface for the paginated movies result
interface PaginatedMoviesResult {
    shows: IShow[];
    totalPages: number;
    currentPage: number;
    limit: number;
}

/**
 * Fetches movies with pagination and optional filters.
 *
 * @param page The current page number (1-indexed).
 * @param limit The number of items per page.
 * @param genre Optional: Filter by genre (e.g., 'Action', 'Drama'). Case-insensitive partial match.
 * @param type Optional: Filter by type ('Movie' or 'TV Show').
 * @returns An object containing the paginated movies, total count, current page, and limit.
 */
export async function getMovies({
    page = 1,
    limit = 10,
    genre,
    type
}: {
    page: number;
    limit: number;
    genre?: string;
    type?: string;
}): Promise<PaginatedMoviesResult> {
    if (page < 1) page = 1;
    if (limit < 1) limit = 1;

    const offset = (page - 1) * limit;

    // --- Dynamic WHERE Clauses Construction ---
    let whereClauses: string[] = [];
    let queryParams: any[] = [];
    let paramIndex = 1;

    if (genre) {
        whereClauses.push(`listed_in ILIKE $${paramIndex++}`);
        queryParams.push(`%${genre}%`);
    }

    if (type) {
        whereClauses.push(`type ILIKE $${paramIndex++}`);
        queryParams.push(`%${type}%`);
    }

    let whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    try {
        // 1. Fetch the paginated movies
        const showsQuery = `
            SELECT show_id, title, description, director, release_year, rating, type, listed_in
            FROM netflix_shows
            ${whereSql}
            ORDER BY release_year DESC, title ASC
            OFFSET $${paramIndex++}
            LIMIT $${paramIndex++};
        `;

        console.log(whereSql, queryParams)

        // Add the offset and limit parameters after any filter parameters
        const shows = await sql(showsQuery, [...queryParams, offset, limit]);

        // 2. Fetch the total count of movies (with the SAME filters)
        const countQuery = `
            SELECT COUNT(*) FROM netflix_shows
            ${whereSql}
        `;

        // Only pass filter parameters (not offset/limit) to the count query
        const totalCountResult = await sql(countQuery, queryParams);
        const totalPages = Math.ceil(parseInt(totalCountResult[0].count, 10) / limit);

        return {
            shows,
            totalPages,
            currentPage: page,
            limit,
        };
    } catch (error) {
        console.error('Failed to fetch paginated movies:', error);
        throw new Error('Could not retrieve paginated movies.');
    }
}

// Get a single movie by ID (equivalent of db.collection.findOne({ _id: ... }))
export async function getMovieById(id: string): Promise<any | null> {
    const query = `
    SELECT *
    FROM netflix_shows
    WHERE show_id = $1;
  `;
    const result = await sql(query, [id]);
    return result.length > 0 ? result[0] : null; // Return the first row or null if not found
}

// lib/db.ts (add these functions)

// Recommender: Get movies by the same director
export async function getMoviesByDirector(directorName: string, currentShowId?: string): Promise<any[]> {
    let query = `
    SELECT show_id, title, description, director, release_year, rating, type, listed_in, duration
    FROM netflix_shows
    WHERE director = $1
  `;
    const params = [directorName];
    if (currentShowId) {
        query += ` AND show_id != $2`; // Exclude the current movie
        params.push(currentShowId);
    }
    query += ` LIMIT 10;`; // Limit recommendations
    return sql(query, params);
}

// Recommender: Get movies with similar genres (using LIKE or array operators if 'listed_in' was an array)
export async function getMoviesByGenre(genre: string, currentShowId?: string): Promise<any[]> {
    // Use ILIKE for case-insensitive partial match on the 'listed_in' column
    let query = `
    SELECT show_id, title, description, director, release_year, rating, type, listed_in, duration
    FROM netflix_shows
    WHERE listed_in ILIKE $1
  `;
    const params = [`%${genre}%`]; // Wrap genre in % for partial match
    if (currentShowId) {
        query += ` AND show_id != $2`;
        params.push(currentShowId);
    }
    query += ` LIMIT 10;`;
    return sql(query, params);
}

// Recommender: Get top N movies by average rating (if you add a 'ratings' table and aggregate)
// For now, let's do top by release year as a "popularity" proxy
export async function getTopRatedMovies(limit: number = 10): Promise<any[]> {
    return sql(`
    SELECT show_id, title, description, director, release_year, rating, type, listed_in
    FROM netflix_shows
    WHERE rating IS NOT NULL AND rating != '' -- Filter out empty ratings
    ORDER BY release_year DESC -- A simple proxy for "popularity" or recency
    LIMIT $1;
  `, [limit]);
}


// export async function getUniqueCategories(): Promise<string[]> {
//     const query = `
//     SELECT DISTINCT type
//     FROM netflix_shows
//     `;
//     // Assuming 'sql' is your function to execute queries against Neon DB
//     const result = await sql(query);
//     console.log(result)

//     fs.writeFile('demo-data.json', JSON.stringify(result), (err) => {
//         if (err) {
//             console.error('Error writing to file:', err);
//         } else {
//             console.log('File written successfully');
//         }
//     })

//     return result.map((row: any) => row.category); // Extracting the category values
// }

// getUniqueCategories()