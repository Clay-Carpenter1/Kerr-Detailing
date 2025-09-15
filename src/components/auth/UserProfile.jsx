import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { User, Mail, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserProfile = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Manage your account and view your information.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
            <User className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold text-foreground">
                {user.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-sm text-muted-foreground flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                {user.email}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Member since {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleSignOut}
              disabled={loading}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {loading ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile; 