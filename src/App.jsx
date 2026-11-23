import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import PcBuilder from './pages/PcBuilder';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Profile from './pages/Profile';
import InfoPage from './pages/InfoPage';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminStaff from './pages/admin/AdminStaff';

const ProfileRoute = () => {
  const { user } = useAuth();
  return <Profile key={user?.id || 'guest'} />;
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <WishlistProvider>
                <Router>
                  <div className="app-layout">
                    <div className="scanlines"></div>
                    <Header />
                    <Navbar />
                    <main className="main-content">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/produtos" element={<Catalog />} />
                        <Route path="/produtos/:id" element={<ProductDetails />} />
                        <Route path="/carrinho" element={<Cart />} />
                        <Route path="/favoritos" element={<Wishlist />} />
                        <Route path="/monte-seu-pc" element={<PcBuilder />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/registro" element={<Register />} />
                        <Route path="/sobre" element={<About />} />
                        <Route path="/perfil" element={<ProfileRoute />} />
                        
                        {/* Info & Document Pages */}
                        <Route path="/termos" element={<InfoPage docType="termos" />} />
                        <Route path="/privacidade" element={<InfoPage docType="privacidade" />} />
                        <Route path="/carreiras" element={<InfoPage docType="carreiras" />} />
                        <Route path="/imprensa" element={<InfoPage docType="imprensa" />} />
                        <Route path="/afiliados" element={<InfoPage docType="afiliados" />} />
                        <Route path="/faq" element={<InfoPage docType="faq" />} />
                        <Route path="/envio" element={<InfoPage docType="envio" />} />
                        <Route path="/devolucoes" element={<InfoPage docType="devolucoes" />} />
                        <Route path="/garantia" element={<InfoPage docType="garantia" />} />
                        
                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminLayout />}>
                          <Route index element={<Dashboard />} />
                          <Route path="produtos" element={<AdminProducts />} />
                          <Route path="pedidos" element={<AdminOrders />} />
                          <Route path="clientes" element={<AdminCustomers />} />
                          <Route path="equipe" element={<AdminStaff />} />
                        </Route>
                        
                        {/* Catch-all Route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </Router>
              </WishlistProvider>
            </CartProvider>
     </ToastProvider>
    </AuthProvider>
   </LanguageProvider>
  </ThemeProvider>
  );
}

export default App;
