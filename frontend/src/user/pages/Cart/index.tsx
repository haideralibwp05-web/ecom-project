import Cartsection from "./components/cartSide";
import OrderSummary from "./components/orderSummary";
import Navbar from "../../components/shared/navbar"
import Footer from "../../components/shared/footer"
const CartPage = () => {
    return (
        <>
            <Navbar />
            <div className="CartPage">
                <Cartsection />
                <OrderSummary />
            </div>
            <Footer />
        </>
    )
}
export default CartPage;