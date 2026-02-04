import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { products } from '@/data/products';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [profileData, ordersData] = await Promise.all([
          api.get(`/profiles/${user.id}`),
          api.get('/orders'),
        ]);

        setProfile(profileData);

        // Map product_id to product name
        const ordersWithProducts = ordersData.map((order: any) => ({
          ...order,
          products: {
            name: products.find(p => p.id === order.product_id)?.name || 'Unknown Product'
          }
        }));

        setOrders(ordersWithProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const safeFormatDate = (dateStr: string | null, formatStr: string = 'MMMM dd, yyyy') => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? 'N/A' : format(d, formatStr);
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
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
            <h1 className="text-5xl font-serif font-bold text-center mb-4">My Profile</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 space-y-8 max-w-5xl">
          {profile && (
            <Card className="border-border/50 shadow-md overflow-hidden">
              <CardHeader className="bg-secondary/30 border-b border-border/50 pb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary border border-primary/20">
                      {profile.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-serif">{profile.full_name}</CardTitle>
                      <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border/50 shadow-sm">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Referral ID</p>
                    <p className="font-mono font-bold text-primary text-xl tracking-wide">{profile.referral_id || 'N/A'}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Address</p>
                    <p className="font-medium text-lg">{profile.address || 'Not set'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Birthday</p>
                    <p className="font-medium text-lg">
                      {safeFormatDate(profile.birthday)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Gender</p>
                    <p className="font-medium text-lg capitalize">{profile.gender || 'Not set'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Member Since</p>
                    <p className="font-medium text-lg">
                      {safeFormatDate(profile.created_at, 'MMMM yyyy')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-border/50 shadow-md">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="font-serif">Order History</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                    <Loader2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium text-muted-foreground">No orders yet</p>
                  <Button variant="link" asChild className="mt-2">
                    <a href="/products">Start Shopping</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const isCancellable = new Date().getTime() - new Date(order.created_at).getTime() < 60000;
                    return (
                      <div key={order.id} className="group flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-card hover:bg-secondary/20 border border-border/50 rounded-xl transition-all hover:shadow-sm gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">#{order.id.slice(0, 8)}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{safeFormatDate(order.created_at, 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                          <p className="font-bold text-lg group-hover:text-primary transition-colors">{order.products?.name}</p>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                          <div className="text-right">
                            <p className="font-bold text-xl text-primary">${order.total_price}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                              {order.status}
                            </span>
                          </div>

                          {isCancellable && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="shadow-sm hover:shadow-md transition-all"
                              onClick={async () => {
                                try {
                                  await api.delete(`/orders/${order.id}`);
                                  setOrders(orders.filter(o => o.id !== order.id));
                                  toast({ title: "Order Cancelled", description: "Your order has been cancelled." });
                                } catch (error: any) {
                                  toast({ title: "Error", description: error.message, variant: "destructive" });
                                }
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
