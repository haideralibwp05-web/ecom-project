import Navbar from "../../components/shared/navbar";
import Sidebar from "../../components/shared/sidebar";
import AddProduct from "./components/addProduct"


const ProductsPage = () => {
    return (
        <>
            <Navbar />
            <div style={{ display: "flex"}}>
                <Sidebar />
                <AddProduct />
            </div>
        </>
    )
}
export default ProductsPage;