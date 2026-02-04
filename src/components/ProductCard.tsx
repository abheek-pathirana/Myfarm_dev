import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext'; // Import the Auth system
import { ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast'; // Assuming your friend used this for alerts

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

export const ProductCard = ({ id, name, description, price, image_url }: ProductCardProps) => {
  const { addItem } = useCart();
  const { user } = useAuth(); // Get the current user
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    // STEP 1: Check if user is logged in
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please log in to your account to add items to your cart.",
        variant: "destructive",
      });
      navigate('/auth'); // Redirects to login page
      return;
    }

    // STEP 2: If logged in, add the item
    addItem({ id, name, price, image_url });

    // STEP 3: Take them to the shopping cart immediately
    navigate('/cart');
  };

  return (
    <Card className="overflow-hidden border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group bg-card">
      <Link to={`/products/${id}`}>
        <div className="aspect-[4/3] overflow-hidden bg-muted cursor-pointer relative">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/30">
              No image
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-serif group-hover:text-primary transition-colors">{name}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm">{description}</CardDescription>
        </CardHeader>
      </Link>
      <CardContent className="pb-2">
        <p className="text-2xl font-bold text-primary">Rs. {price.toLocaleString()}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          onClick={handleAddToCart}
          className="w-full font-semibold shadow-sm hover:shadow-md transition-all bg-primary hover:bg-primary/90"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};