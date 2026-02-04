import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-3xl font-serif font-bold mb-4">Your Cart is Empty</h2>
            <p className="text-muted-foreground mb-8">Add some fresh vegetables to get started!</p>
            <Button size="lg" asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-serif font-bold text-center mb-4">Shopping Cart</h1>
            <p className="text-xl text-center text-muted-foreground">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {item.image_url && (
                        <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                        <p className="text-lg font-bold text-primary mb-4">
                          LKR {item.price.toFixed(2)} each
                        </p>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          LKR {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-secondary/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-2xl font-serif font-bold">Total</span>
                  <span className="text-3xl font-bold text-primary">
                    LKR {totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button size="lg" className="w-full" onClick={handleCheckout}>
                  {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}