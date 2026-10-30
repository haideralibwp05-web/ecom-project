import Navbar from "../../components/shared/navbar";
import Sidebar from "../../components/shared/sidebar";
import Products from "./components/products"


const ProductsPage = () => {
    return (
        <>
            <Navbar />
            <div style={{ display: "flex"}}>
                <Sidebar />
                <Products />
            </div>
        </>
    )
}
export default ProductsPage;