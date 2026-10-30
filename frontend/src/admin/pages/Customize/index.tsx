import Navbar from "../../components/shared/navbar";
import Sidebar from "../../components/shared/sidebar";
import Customize from "./components/customize";


const CustomizePage = () => {
    return (
        <>
            <Navbar />
            <div style={{ display: "flex"}}>
                <Sidebar />
                <Customize />
            </div>
        </>
    )
}
export default CustomizePage;