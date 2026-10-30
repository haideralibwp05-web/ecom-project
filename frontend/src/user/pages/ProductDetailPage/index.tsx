import ProductDetails from "./components/productDetail";
import Ratings from "./components/rating";
import SuggestProduct from "./components/suggestProducts";
import Navbar from "../../components/shared/navbar"
import Footer from "../../components/shared/footer"
const ProductDetailPage = () => {
    return (
        <>
            <Navbar />
            <ProductDetails />
            {/* <Ratings /> */}
            <SuggestProduct />
            <Footer />
        </>
    )
}
export default ProductDetailPage;