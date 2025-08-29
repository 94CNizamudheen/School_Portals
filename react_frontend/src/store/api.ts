
import API from "../axios.config";



export const fetchUser = async (id: string) => {
  const response = await API.get(`/auth/${id}`)
  console.log("fetch user Response", response)
  return response.data
}

