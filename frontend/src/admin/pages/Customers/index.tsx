import Navbar from "../../components/shared/navbar";
import Sidebar from "../../components/shared/sidebar";
import Customers from "./components/customers"


const CustomersPage = () => {
    return (
        <>
            <Navbar />
            <div style={{ display: "flex"}}>
                <Sidebar />
                <Customers />
            </div>
        </>
    )
}
export default CustomersPage;