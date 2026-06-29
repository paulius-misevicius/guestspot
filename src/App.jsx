import MyListings from "./components/MyListings"
import Sidebar from "./components/Sidebar"
import { BrowserRouter, Routes, Route } from "react-router"

export default function App() {

  return (
    <>
      <Sidebar />
      <section className="app-content">
        <MyListings />
      </section>
    </>
  )
}