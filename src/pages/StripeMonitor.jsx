import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CreditCard, DollarSign, Users, TrendingUp, RefreshCw } from 'lucide-react';

const StripeMonitor = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalVolume: 0,
    totalTransactions: 0,
    successRate: 0,
    avgAmount: 0
  });
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration (replace with real Stripe API calls)
  const mockPayments = [
    {
      id: 'pi_test_123',
      amount: 14900, // $149.00 in cents
      status: 'succeeded',
      customer: 'Clay Carpenter',
      email: 'candocarp@gmail.com',
      service: 'Premium Package',
      created: new Date().toISOString(),
      payment_method: 'pm_test_456'
    }
  ];

  const fetchStripeData = async () => {
    setLoading(true);
    try {
      // In production, this would call your Stripe API
      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPayments(mockPayments);
      setStats({
        totalVolume: 149.00,
        totalTransactions: 1,
        successRate: 100,
        avgAmount: 149.00
      });
    } catch (error) {
      console.error('Error fetching Stripe data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStripeData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">Stripe Payment Monitor</h1>
              <p className="text-muted-foreground">Real-time payment tracking and analytics</p>
            </div>
            <Button onClick={fetchStripeData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalVolume}</div>
              <p className="text-xs text-muted-foreground">Test mode</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">Completed bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.successRate}%</div>
              <p className="text-xs text-muted-foreground">Payment success</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Amount</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.avgAmount}</div>
              <p className="text-xs text-muted-foreground">Per booking</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest payment transactions from your booking system</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading payments...</span>
              </div>
            ) : payments.length > 0 ? (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        payment.status === 'succeeded' ? 'bg-green-500' : 
                        payment.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium">{payment.customer}</p>
                        <p className="text-sm text-muted-foreground">{payment.email}</p>
                        <p className="text-xs text-muted-foreground">{payment.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(payment.created)}</p>
                      <p className="text-xs text-muted-foreground">ID: {payment.id.substring(0, 12)}...</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No payments found</p>
                <p className="text-sm">Complete a test booking to see payment data</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
            <CardDescription>How to enable real-time Stripe monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Enable Real Payment Processing</h4>
              <p className="text-sm text-muted-foreground">
                Deploy your site to Vercel with the serverless payment function to see actual Stripe transactions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Add Stripe Webhooks (Optional)</h4>
              <p className="text-sm text-muted-foreground">
                Set up webhooks in Stripe dashboard to get real-time payment notifications.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Environment Variables</h4>
              <p className="text-sm text-muted-foreground">
                Add STRIPE_SECRET_KEY to your Vercel environment variables for live monitoring.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StripeMonitor;
