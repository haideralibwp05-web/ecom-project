import Navbar from "../../components/shared/navbar";
import Sidebar from "../../components/shared/sidebar";
import Categories from "./components/categories"


const CategoriesPage = () => {
    return (
        <>
            <Navbar />
            <div style={{ display: "flex"}}>
                <Sidebar />
                <Categories />
            </div>
        </>
    )
}
export default CategoriesPage;