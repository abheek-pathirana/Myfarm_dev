import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { products, Product } from '@/data/products';
import { Loader2, ShoppingCart, ArrowLeft, Pencil, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: 0, image_url: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      const data = products.find(p => p.id === id);

      if (!data) {
        navigate('/products');
        return;
      }

      setProduct(data);
      setEditForm({
        name: data.name,
        description: data.description,
        price: data.price,
        image_url: data.image_url || '',
      });
      setLoading(false);
    };

    fetchProduct();
  }, [id, navigate]);

  const handleSave = async () => {
    toast({ title: 'Info', description: 'Product editing is disabled in static mode' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate('/products')} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>

            <Card>
              <CardContent className="p-6 space-y-6">
                {editing ? (
                  <>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input
                        value={editForm.image_url}
                        onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setEditing(false)}>
                        <X className="h-4 w-4 mr-2" /> Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <h1 className="text-3xl font-serif font-bold">{product.name}</h1>
                      {isAdmin && (
                        <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      )}
                    </div>
                    <p className="text-muted-foreground text-lg">{product.description}</p>
                    <p className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</p>
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        addItem({ id: product.id, name: product.name, price: product.price, image_url: product.image_url || undefined });
                        toast({ title: 'Added to cart', description: `${product.name} has been added to your cart` });
                      }}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
