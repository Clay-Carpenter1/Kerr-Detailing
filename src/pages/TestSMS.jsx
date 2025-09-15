import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const TestSMS = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [reminderResult, setReminderResult] = useState(null);

  const sendTestSMS = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/test-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone || undefined,
          message: message || undefined
        }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to call API', details: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testReminderSystem = async () => {
    setLoading(true);
    setReminderResult(null);
    
    try {
      const response = await fetch('/api/test-reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      const data = await response.json();
      setReminderResult(data);
    } catch (error) {
      setReminderResult({ error: 'Failed to call API', details: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">SMS Testing Dashboard</h1>
        
        {/* Test Single SMS */}
        <Card>
          <CardHeader>
            <CardTitle>Test Single SMS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number (optional - uses default if empty)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                className="w-full px-3 py-2 border border-input rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Custom Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Custom test message..."
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md"
              />
            </div>
            
            <Button 
              onClick={sendTestSMS} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Sending...' : 'Send Test SMS'}
            </Button>
            
            {result && (
              <div className={`p-4 rounded-md ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Reminder System */}
        <Card>
          <CardHeader>
            <CardTitle>Test Reminder System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will check for bookings tomorrow with text reminders enabled and send test messages.
            </p>
            
            <Button 
              onClick={testReminderSystem} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              {loading ? 'Testing...' : 'Test Reminder System'}
            </Button>
            
            {reminderResult && (
              <div className={`p-4 rounded-md ${reminderResult.successCount > 0 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                <pre className="text-sm">{JSON.stringify(reminderResult, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>1. Test Single SMS:</strong> Sends a test message to verify Twilio is working</p>
            <p><strong>2. Test Reminder System:</strong> Checks database for tomorrow's appointments and sends test reminders</p>
            <p><strong>3. Create Test Booking:</strong> Go to booking page and create an appointment for tomorrow with text reminders enabled</p>
            <p><strong>4. Check Logs:</strong> Open browser developer tools to see console logs</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestSMS;
