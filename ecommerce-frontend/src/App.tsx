import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "./components/admin/Loader";
import Header from "./components/Header";

const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const Cart = lazy(() => import("./pages/Cart"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Login = lazy(() => import("./pages/Login"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));

// Admin Dashboard
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Products = lazy(() => import("./pages//admin/Products"));
const Transactions = lazy(() => import("./pages/admin/Transactions"));
const Customers = lazy(() => import("./pages/admin/Customers"));
const NewProduct = lazy(() => import("./pages/admin/management/NewProduct"));
const ProductManagement = lazy(() => import("./pages/admin/management/ProductManagement"));
const TransactionManagement = lazy(() => import("./pages/admin/management/TransactionManagement"));
const BarCharts = lazy(() => import("./pages/admin/charts/BarCharts"));
const PieCharts = lazy(() => import("./pages/admin/charts/PieCharts"));
const LineCharts = lazy(() => import("./pages/admin/charts/LineCharts"));
const Stopwatch = lazy(() => import("./pages/admin/apps/Stopwatch"));
const Coupon = lazy(() => import("./pages/admin/apps/Coupon"));
const Toss = lazy(() => import("./pages/admin/apps/Toss"));

function App() {

  return (
    <Router>
      <Header />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />

          {/* Not Logged In Route */}
          <Route path="/login" element={<Login />} />

          {/* Logged In user routes */}
          <Route>
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Route>

          {/* Admin Dashboard Routes */}
          {/* <Route element={<ProtectedRoute isAuthenticated={true} adminRoute={true} isAdmin={true} />} /> */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/transactions" element={<Transactions />} />
          <Route path="/admin/customers" element={<Customers />} />
          {/* Charts */}
          <Route path="/admin/chart/bar" element={<BarCharts />} />
          <Route path="/admin/chart/pie" element={<PieCharts />} />
          <Route path="/admin/chart/line" element={<LineCharts />} />
          {/* Apps */}
          <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
          <Route path="/admin/app/coupon" element={<Coupon />} />
          <Route path="/admin/app/toss" element={<Toss />} />
          {/* Management */}
          <Route path="/admin/products/new" element={<NewProduct />} />
          <Route path="/admin/products/:id" element={<ProductManagement />} />
          <Route path="/admin/transactions/:id" element={<TransactionManagement />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App;