import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProductPage from "@/pages/ProductPage";
import CategoryPage from "@/pages/CategoryPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import AuthPage from "@/pages/AuthPage";
import ProfilePage from "@/pages/ProfilePage";
import OrdersPage from "@/pages/OrdersPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/hooks/use-auth";
import { CategoryProvider } from "./hooks/use-categories";
import PaymentPage from "./pages/PaymentPage";
import SearchPage from "@/pages/SearchPage";
import { SearchProvider } from "./context/SearchContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products/:id" component={ProductPage} />
      <Route path="/categories/:category" component={CategoryPage} />
      <Route path="/subcategories/:category" component={CategoryPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/orders" component={OrdersPage} />
      <Route path="/order/:orderId" component={PaymentPage} />
      <Route path="/order-success" component={OrderSuccessPage} />
      <Route path="/search" component={SearchPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isCheckout = location.startsWith("/checkout");
  const isAuthPage = location.startsWith("/auth");
  const isOrderSuccess = location.startsWith("/order-success");
  const hideHeaderFooter = isCheckout || isAuthPage || isOrderSuccess;

  return (
    <SearchProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CategoryProvider>
            <div className="flex flex-col min-h-screen">
              {!hideHeaderFooter && <Header />}
              <main className="flex-grow">
                <Router />
              </main>
              {!hideHeaderFooter && <Footer />}
            </div>
            <Toaster />
          </CategoryProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SearchProvider>
  );
}

export default App;
