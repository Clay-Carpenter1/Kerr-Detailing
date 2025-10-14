import { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle, CreditCard, ArrowLeft, Lock } from 'lucide-react';
import stripePromise from '../lib/stripe';

// Payment Form Component
const PaymentForm = ({ bookingData, onSuccess, onError, onBack, loading, setLoading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    const card = elements.getElement(CardElement);

    try {
      // Create payment intent on backend first
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: bookingData.totalPrice,
          metadata: {
            booking_service: bookingData.serviceName,
            customer_name: bookingData.name,
            customer_email: bookingData.email,
            booking_date: bookingData.date,
            booking_time: bookingData.time,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Payment setup failed: ${response.status}`);
      }

      const { clientSecret, paymentIntentId } = await response.json();

      if (!clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      // Confirm payment with Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone,
          },
        }
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      console.log('Payment succeeded:', paymentIntent);
      
      // Real payment successful - this will trigger webhooks!
      onSuccess({
        paymentMethodId: paymentIntent.payment_method,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
      });

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center space-x-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Booking Summary */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Booking Summary</h3>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Service:</span>
            <span className="font-medium">{bookingData.serviceName}</span>
          </div>
          {bookingData.addons && bookingData.addons.length > 0 && (
            <div className="flex justify-between">
              <span>Add-ons:</span>
              <span className="font-medium">{bookingData.addons.length} selected</span>
            </div>
          )}
          <div className="flex justify-between text-base font-semibold text-foreground pt-2 border-t">
            <span>Total:</span>
            <span>${bookingData.totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <CreditCard className="h-4 w-4 inline mr-2" />
          Payment Details
        </label>
        <div className="border border-input rounded-md p-3 bg-background">
          <CardElement options={cardElementOptions} />
        </div>
        <p className="text-xs text-muted-foreground mt-2 flex items-center">
          <Lock className="h-3 w-3 mr-1" />
          Your payment information is secure and encrypted
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
        <p className="text-sm text-green-700 dark:text-green-300">
          <CheckCircle className="h-4 w-4 inline mr-2" />
          This is a secure payment powered by Stripe
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onBack} disabled={loading} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || loading} 
          className="flex-1"
        >
          {loading ? 'Processing...' : `Pay $${bookingData.totalPrice}`}
        </Button>
      </div>
    </form>
  );
};

// Main Payment Modal Component
const PaymentModal = ({ isOpen, onClose, onBack, onSuccess, bookingData }) => {
  const [loading, setLoading] = useState(false);

  const handleSuccess = (paymentResult) => {
    onSuccess(paymentResult);
  };

  const handleError = (error) => {
    console.error('Payment error:', error);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle>Payment - Step 5 of 5</DialogTitle>
          <DialogDescription>
            Complete your booking by providing payment information.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
          <Elements stripe={stripePromise}>
            <PaymentForm
              bookingData={bookingData}
              onSuccess={handleSuccess}
              onError={handleError}
              onBack={onBack}
              loading={loading}
              setLoading={setLoading}
            />
          </Elements>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
