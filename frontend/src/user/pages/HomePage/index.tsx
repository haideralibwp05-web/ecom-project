import Home from "./components/HomePage"
import "../../../style.css";
import Navbar from "../../components/shared/navbar"
import Footer from "../../components/shared/footer"
const HomePage = () => {

    return (
        <div>
            <Navbar className="customNavbar"/>
            <Home />
            <Footer />
        </div>
    )
}
export default HomePage;



