import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Checkout() {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/checkout');
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await api.get(`/profiles/${user.id}`);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error loading profile',
          description: 'Please try again',
          variant: 'destructive',
        });
      }
    };

    fetchProfile();
  }, [user, items, navigate, toast]);

  const handlePlaceOrder = async () => {
    if (!user) return;

    setLoading(true);

    try {
      // Create orders for each item
      const orderPromises = items.map((item) =>
        api.post('/orders', {
          product_id: item.id,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
        })
      );

      const responses = await Promise.all(orderPromises);
      const orderIds = responses.map((r: any) => r.orderId).join(', ');

      toast({
        title: 'Order placed successfully!',
        description: `Order IDs: ${orderIds}. We will deliver your order soon. Payment will be collected upon delivery.`,
      });

      clearCart();
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error placing order',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };



  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-serif font-bold text-center mb-4">Checkout</h1>
            <p className="text-xl text-center text-muted-foreground">
              Review your order and delivery details
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold">{profile.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-semibold">{profile.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">GPS Location</p>
                    <p className="font-semibold">{profile.gps_location}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <p className="text-sm text-center">
                      Payment will be collected in person upon delivery
                    </p>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}