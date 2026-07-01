import { BrowserRouter, Routes, Route } from "react-router"
import { useState, createContext } from "react"

import Layout from "./components/Layout"

import { artistListingsData } from "./data"

import MyListings from "./pages/MyListings"
import Browse from "./pages/Browse"
import Profile from "./pages/Profile"

export const ListingsContext = createContext()

export default function App() {

  const [allListings, setAllListings] = useState([...artistListingsData])
  console.log(allListings)

  return (
    <ListingsContext.Provider value={{allListings, setAllListings}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MyListings />}/>
            <Route path="browse" element={<Browse />}/>
            <Route path="profile" element={<Profile />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </ListingsContext.Provider>
  )
}