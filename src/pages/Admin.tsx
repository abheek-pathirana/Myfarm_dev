import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { products as staticProducts } from '@/data/products';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  is_active: boolean;
}

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, image_url: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      try {
        const [ordersData, usersData] = await Promise.all([
          api.get('/admin/orders'),
          api.get('/admin/profiles'),
        ]);

        const profilesMap = new Map(usersData.map((p: any) => [p.user_id, p]));
        const ordersWithProfiles = ordersData.map((order: any) => ({
          ...order,
          profile: profilesMap.get(order.user_id),
          products: {
            name: staticProducts.find(p => p.id === order.product_id)?.name || 'Unknown Product'
          }
        }));

        setOrders(ordersWithProfiles);
        setUsers(usersData);
        setProducts(staticProducts);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  const handleSaveProduct = async () => {
    toast({ title: 'Info', description: 'Product editing is disabled in static mode' });
  };

  const handleAddProduct = async () => {
    toast({ title: 'Info', description: 'Product adding is disabled in static mode' });
  };

  const handleDeleteProduct = async (id: string) => {
    toast({ title: 'Info', description: 'Product deletion is disabled in static mode' });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col relative bg-[#fffcf7]">
      <Navbar />

      {/* SUBTLE IMAGE OVERLAY & GRADIENT */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.03] grayscale"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/50" />
      </div>

      <main className="flex-grow relative z-10">
        <div className="bg-gradient-to-br from-primary/10 via-background/80 to-secondary/20 py-16 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-serif font-bold text-center mb-4">Admin Dashboard</h1>
            <p className="text-xl text-center text-muted-foreground">Manage products, users and orders</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/60 backdrop-blur-md border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">
                  ${orders.reduce((acc, order) => acc + Number(order.total_price || 0), 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-md border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-accent-foreground">
                  {orders.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">+12 since yesterday</p>
              </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-md border-secondary-foreground/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-secondary-foreground">
                  {users.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">+4 new users today</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="orders" className="w-full space-y-8">
            <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto p-1 bg-secondary/50 backdrop-blur-sm rounded-xl">
              <TabsTrigger value="orders" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Orders</TabsTrigger>
              <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Products</TabsTrigger>
              <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card className="border-border/50 shadow-sm bg-white/80 backdrop-blur-md">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Referral ID</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                              No orders yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          orders.map((order) => (
                            <TableRow key={order.id} className="hover:bg-secondary/20">
                              <TableCell className="font-mono text-xs text-muted-foreground">{order.id.slice(0, 8)}...</TableCell>
                              <TableCell className="font-medium">{order.profile?.full_name || 'Unknown'}</TableCell>
                              <TableCell className="font-mono text-xs">{order.profile?.referral_id || 'N/A'}</TableCell>
                              <TableCell>{order.products?.name || 'Unknown'}</TableCell>
                              <TableCell>{order.quantity}</TableCell>
                              <TableCell className="font-bold text-primary">${Number(order.total_price || 0).toFixed(2)}</TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {order.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {order.created_at ? format(new Date(order.created_at), 'MMM dd, HH:mm') : 'N/A'}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products">
              <Card className="border-border/50 shadow-sm bg-white/80 backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Product Catalog</CardTitle>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="shadow-sm hover:shadow-md transition-all"><Plus className="h-4 w-4 mr-2" /> Add Product</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Name</Label>
                          <Input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                        </div>
                        <div>
                          <Label>Price ($)</Label>
                          <Input type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })} />
                        </div>
                        <div>
                          <Label>Image URL</Label>
                          <Input value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} placeholder="https://..." />
                        </div>
                        <Button onClick={handleAddProduct} disabled={saving} className="w-full">
                          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Add Product
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id} className="hover:bg-secondary/20">
                            <TableCell>
                              {editingProduct?.id === product.id ? (
                                <Input value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                              ) : (
                                <div className="flex items-center gap-3">
                                  {product.image_url && (
                                    <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                                  )}
                                  <span className="font-semibold">{product.name}</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="max-w-xs text-sm text-muted-foreground">
                              {editingProduct?.id === product.id ? (
                                <Textarea value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
                              ) : (
                                <span className="line-clamp-2">{product.description}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {editingProduct?.id === product.id ? (
                                <Input type="number" step="0.01" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })} className="w-24" />
                              ) : (
                                <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {editingProduct?.id === product.id ? (
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={handleSaveProduct} disabled={saving}>
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost" onClick={() => setEditingProduct(product)}>
                                    <Pencil className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="border-border/50 shadow-sm bg-white/80 backdrop-blur-md">
                <CardHeader>
                  <CardTitle>User Directory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>GPS</TableHead>
                          <TableHead>Birthday</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>Referral</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => {
                          const safeFormatDate = (dateStr: string | null) => {
                            if (!dateStr) return 'N/A';
                            try {
                              const d = new Date(dateStr);
                              return isNaN(d.getTime()) ? 'N/A' : format(d, 'MMM dd, yyyy');
                            } catch {
                              return 'N/A';
                            }
                          };

                          return (
                            <TableRow key={user.id} className="hover:bg-secondary/20">
                              <TableCell className="font-semibold">{user.full_name}</TableCell>
                              <TableCell className="text-muted-foreground">{user.email}</TableCell>
                              <TableCell className="max-w-[200px] truncate" title={user.address}>{user.address}</TableCell>
                              <TableCell className="font-mono text-xs">{user.gps_location}</TableCell>
                              <TableCell>{safeFormatDate(user.birthday)}</TableCell>
                              <TableCell className="capitalize">{user.gender}</TableCell>
                              <TableCell>{user.referral_source}</TableCell>
                              <TableCell className="text-muted-foreground text-sm">{safeFormatDate(user.joined_at)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}