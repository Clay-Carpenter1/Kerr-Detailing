-- Add missing columns to bookings table for addon, payment, and text reminder support
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS addons TEXT,
ADD COLUMN IF NOT EXISTS total_price NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS payment_method_id TEXT,
ADD COLUMN IF NOT EXISTS text_reminders BOOLEAN DEFAULT FALSE;

-- Add comments for documentation
COMMENT ON COLUMN bookings.addons IS 'JSON string containing selected addon IDs';
COMMENT ON COLUMN bookings.total_price IS 'Total price including base service and addons';
COMMENT ON COLUMN bookings.payment_status IS 'Stripe payment status (succeeded, failed, pending, etc.)';
COMMENT ON COLUMN bookings.payment_method_id IS 'Stripe payment method ID for reference';
COMMENT ON COLUMN bookings.text_reminders IS 'Whether customer opted in for text message reminders';
