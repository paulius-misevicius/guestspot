import { BrowserRouter, Routes, Route } from "react-router"
import { useState } from "react"

import Layout from "./components/Layout"
import MyListings from "./pages/MyListings"
import Browse from "./pages/Browse"
import Profile from "./pages/Profile"

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MyListings />}/>
          <Route path="browse" element={<Browse />}/>
          <Route path="profile" element={<Profile />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}