import Navbar from "../../components/shared/navbar";
import Sidebar from "../../components/shared/sidebar";
import Orders from "./components/orders"


const OrderPage = () => {
    return (
        <>
            <Navbar />
            <div style={{ display: "flex"}}>
                <Sidebar />
                <Orders />
            </div>
        </>
    )
}
export default OrderPage;