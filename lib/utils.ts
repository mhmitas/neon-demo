import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { RemoveUrlQueryParams, UrlQueryParams } from "./types";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(minutes: number) {
  if (minutes <= 0) return '0m';

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes === 0) {
    return `${hours}h`;
  } else if (hours === 0 && remainingMinutes > 0) {
    return `${remainingMinutes}m`;
  } else {
    return `${hours}h ${remainingMinutes}m`;
  }
}


export function formUrlQuery({ params, key, value }: UrlQueryParams) {

  // console.log(
  //   "🚀 ~ file: utils.ts:40 ~ formUrlQuery ~ params:",
  //   { params, key, value }
  // )

  const currentUrl = qs.parse(params)

  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

export function removeKeysFromQuery({ params, keysToRemove }: RemoveUrlQueryParams) {

  // console.log(
  //   "🚀 ~ file: utils.ts:40 ~ removeKeysFromQuery ~ params:",
  //   { params, keysToRemove }
  // )

  const currentUrl = qs.parse(params)

  keysToRemove.forEach(key => {
    delete currentUrl[key]
  })

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}