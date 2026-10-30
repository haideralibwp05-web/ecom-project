import Navbar from "../../components/shared/navbar";
import Sidebar from "../../components/shared/sidebar";
import Dashboard from "./components/dashboard";


const DashboardPage = () => {
    return (
        <>
            <Navbar />
            <div style={{ display: "flex"}}>
                <Sidebar />
                <Dashboard />
            </div>
        </>
    )
}
export default DashboardPage;