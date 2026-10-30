import Navbar from "../../components/shared/navbar";
import Sidebar from "../../components/shared/sidebar";
import Create_Category from "./components/createCategory"


const Create_CategoryPage = () => {
    return (
        <>
            <Navbar />
            <div style={{ display: "flex"}}>
                <Sidebar />
                <Create_Category />
            </div>
        </>
    )
}
export default Create_CategoryPage;