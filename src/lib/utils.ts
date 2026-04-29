import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// import dayjs from "dayjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currentFormatter(amount: string | number | undefined) {
  return `₹${new Intl.NumberFormat("en-IN").format(Number(amount))}`;
}

// export function dayjsFormate(date: string, format?: string) {
//   return dayjs(date).format(format || "DD-MM-YYYY");
// }


 export interface JwtPayload {
  userId: number;
  name: string;
  email: string;
  iat: number;
  exp: number;
}

export function getUserDetailsFromToken(){
  const token = localStorage.getItem("token");
  
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const decoded = JSON.parse(atob(payload));
    return decoded as JwtPayload;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}
