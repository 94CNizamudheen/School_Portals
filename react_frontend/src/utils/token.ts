import {jwtDecode} from "jwt-decode"

interface JwtPayload {
  exp: number
  [key: string]: unknown
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    const currentTime = Math.floor(Date.now() / 1000) 
    return decoded.exp < currentTime
  } catch (error) {
    console.error("Failed to decode token:", error)
    return true 
  }
}
