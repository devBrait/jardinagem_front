import { CssBaseline } from "@mui/material"
import Footer from "./components/footer/Footer"
import CorpoCentral from "./components/header/CorpoCentral"
import Header from "./components/header/Header"
import Navbar from "./components/navBar/Navbar"
import BotoesProcesso from "./components/processo/BotoesProcesso"

export default function App() {
  return (
    <>
    <CssBaseline>
      <div>
        <div className="m-0 flex flex-col min-h-screen">
          <div className="flex align-items-center py-4 justify-content-between p-2">
            <Navbar/>
          </div>
          <Header/>
          <CorpoCentral/>
          <BotoesProcesso/>
          <Footer/>
        </div>
      </div>
      </CssBaseline>
    </>
  )
}
