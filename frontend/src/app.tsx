import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./user/pages/Cart/components/CartContext";
import ScrollToTop from "./user/components/shared/ScrollToTop";

// USER SIDE
import HomePage from "./user/pages/HomePage";
import OnSalePage from "./user/pages/On Sale";
import NewArrivalsPage from "./user/pages/newArrival";
import ProductDetailPage from "./user/pages/ProductDetailPage";
import Category_Page from "./user/pages/categoryPage";
import CartPage from "./user/pages/Cart";
import Checkout from "./user/pages/CheckOut/Checkout";
import OrderSuccess from "./user/pages/CheckOut/OrderSuccess";
import SignIn from "./user/pages/auths/components/SignIn";
import CreateAccount from "./user/pages/auths/components/CreateAccount";
import ForgetPassword from "./user/pages/auths/components/ForgetPassword";
import ResetPassword from "./user/pages/auths/components/ResetPassword";
// USER SIDE FOOTER PAGES
import AboutUs from "./user/pages/FooterPages/AboutUs";
import ContactUs from "./user/pages/FooterPages/ContactUs";
import OurStory from "./user/pages/FooterPages/OurStory";
import Careers from "./user/pages/FooterPages/Careers";
import Men from "./user/pages/FooterPages/Men";
import Women from "./user/pages/FooterPages/Women";
import FAQs from "./user/pages/FooterPages/FAQs";
import ShippingDelivery from "./user/pages/FooterPages/ShippingDelivery";
import ReturnsExchanges from "./user/pages/FooterPages/ReturnsExchanges";
import SizeGuide from "./user/pages/FooterPages/SizeGuide";
import PrivacyPolicy from "./user/pages/FooterPages/PrivacyPolicy";
import TermsConditions from "./user/pages/FooterPages/TermsConditions";
import RefundPolicy from "./user/pages/FooterPages/RefundPolicy";
import CancellationPolicy from "./user/pages/FooterPages/CancellationPolicy";
// ADMIN PANEL
import DashboardPage from "./admin/pages/Dashboard";
import OrderPage from "./admin/pages/Orders";
import OrderDetails from "./admin/pages/Orders/components/OrderDetails";
import ProductsPage from "./admin/pages/Products";
import AddProduct from "./admin/pages/AddProduct";
import CategoriesPage from "./admin/pages/Categories";
import Create_CategoryPage from "./admin/pages/Create_Category";
import CustomerDetails from "./admin/pages/Customers/components/CustomerDetails";
import CustomersPage from "./admin/pages/Customers";
import CustomizePage from "./admin/pages/Customize";

import type { ReactNode } from "react";
import {
    getAccessToken,
    isAdminAuthenticated,
} from "./services/authSession";

function ProtectedAdminRoute({
    children,
}: {
    children: ReactNode;
}) {
    if (!isAdminAuthenticated()) {
        return <Navigate to="/signin" replace />;
    }

    return <>{children}</>;
}

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />

            <CartProvider>
                <Routes>
                    {/* AUTH */}
                    <Route path="/signin" element={<SignIn />} />

                    <Route
                        path="/create-account"
                        element={<CreateAccount />}
                    />

                    <Route
                        path="/forget-password"
                        element={<ForgetPassword />}
                    />

                    <Route
                        path="/reset-password/:uid/:token/"
                        element={<ResetPassword />}
                    />

                    {/* USER SIDE */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/on-sale" element={<OnSalePage />} />
                    <Route path="/new-arrivals" element={<NewArrivalsPage />} />

                    <Route
                        path="/checkout"
                        element={
                            getAccessToken("user") ? (
                                <Checkout />
                            ) : (
                                <Navigate
                                    to="/signin"
                                    replace
                                    state={{ from: "/checkout" }}
                                />
                            )
                        }
                    />

                    <Route
                        path="/order-success"
                        element={<OrderSuccess />}
                    />

                    <Route
                        path="/product/:id"
                        element={<ProductDetailPage />}
                    />

                    <Route
                        path="/category/:id"
                        element={<Category_Page />}
                    />

                    <Route
                        path="/CategoryPage"
                        element={<Category_Page />}
                    />

                    <Route
                        path="/CartPage"
                        element={<CartPage />}
                    />
                    {/* USER SIDE FOOTER PAGES LINKS */}
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/contact-us" element={<ContactUs />} />
                    <Route path="/our-story" element={<OurStory />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/men" element={<Men />} />
                    <Route path="/women" element={<Women />} />
                    <Route path="/faqs" element={<FAQs />} />
                    <Route path="/shipping-delivery" element={<ShippingDelivery />} />
                    <Route path="/returns-exchanges" element={<ReturnsExchanges />} />
                    <Route path="/size-guide" element={<SizeGuide />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-conditions" element={<TermsConditions />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/cancellation-policy" element={<CancellationPolicy />} />
                    {/* ADMIN PANEL */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedAdminRoute>
                                <DashboardPage />
                            </ProtectedAdminRoute>
                        }
                    />
                    <Route
                        path="/admin/orders/:orderId"
                        element={
                            <ProtectedAdminRoute>
                                <OrderDetails />
                            </ProtectedAdminRoute>
                        }
                    />
                    <Route
                        path="/admin/orders"
                        element={
                            <ProtectedAdminRoute>
                                <OrderPage />
                            </ProtectedAdminRoute>
                        }
                    />

                    <Route
                        path="/admin/products"
                        element={
                            <ProtectedAdminRoute>
                                <ProductsPage />
                            </ProtectedAdminRoute>
                        }
                    />

                    <Route
                        path="/admin/products/add"
                        element={
                            <ProtectedAdminRoute>
                                <AddProduct />
                            </ProtectedAdminRoute>
                        }
                    />

                    <Route
                        path="/admin/products/edit/:id"
                        element={
                            <ProtectedAdminRoute>
                                <AddProduct />
                            </ProtectedAdminRoute>
                        }
                    />

                    <Route
                        path="/admin/categories"
                        element={
                            <ProtectedAdminRoute>
                                <CategoriesPage />
                            </ProtectedAdminRoute>
                        }
                    />

                    <Route
                        path="/admin/categories/create"
                        element={
                            <ProtectedAdminRoute>
                                <Create_CategoryPage />
                            </ProtectedAdminRoute>
                        }
                    />

                    <Route
                        path="/admin/categories/:id"
                        element={
                            <ProtectedAdminRoute>
                                <Create_CategoryPage />
                            </ProtectedAdminRoute>
                        }
                    />
                    <Route
                        path="/admin/customers/:customerId"
                        element={
                            <ProtectedAdminRoute>
                                <CustomerDetails />
                            </ProtectedAdminRoute>
                        }
                    />
                    <Route
                        path="/admin/customers"
                        element={
                            <ProtectedAdminRoute>
                                <CustomersPage />
                            </ProtectedAdminRoute>
                        }
                    />

                    <Route
                        path="/admin/customize"
                        element={
                            <ProtectedAdminRoute>
                                <CustomizePage />
                            </ProtectedAdminRoute>
                        }
                    />

                    {/* UNKNOWN ROUTES */}
                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />
                </Routes>
            </CartProvider>
        </BrowserRouter>
    );
}

export default App;