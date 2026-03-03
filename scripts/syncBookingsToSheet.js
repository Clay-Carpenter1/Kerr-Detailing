import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Minimal .env loader (avoids any issues with dotenv on Windows)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

try {
  const envRaw = fs.readFileSync(envPath, 'utf8');
  envRaw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) return;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    // Strip surrounding quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] ??= value;
  });
} catch (e) {
  // If .env is missing, we'll fail later with a clear message
}

// Supabase client (server-side, uses service role key)
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase env vars. Please set VITE_SUPABASE_URL/SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Google Sheets auth (service account via JSON key file)
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

if (!spreadsheetId) {
  console.error('Missing GOOGLE_SHEETS_SPREADSHEET_ID env var.');
  process.exit(1);
}

// Path to the downloaded JSON key file (at project root)
const keyFile = path.resolve(__dirname, '../affable-curve-456100-n2-19a5613c538c.json');

const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Range covering your header row + data columns A-J
const SHEET_RANGE = 'Bookings!A1:J';   // if your tab is named "Bookings"

async function syncBookingsToSheet() {
  console.log('Starting bookings → Google Sheet sync...');

  // Fetch bookings from Supabase; adjust columns if your schema differs
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, booking_date, booking_time, name, car_make, car_model, service, total_price, status, message')
    .order('booking_date', { ascending: true })
    .order('booking_time', { ascending: true });

  if (error) {
    console.error('Supabase error:', error);
    process.exit(1);
  }

  const safeBookings = bookings || [];

  // Build rows matching your headers:
  // Booking ID | Date | Time | Customer | Make | Model | Service | Price | Status | Additional Notes
  const values = [
    ['Booking ID', 'Date', 'Time', 'Customer', 'Make', 'Model', 'Service', 'Price', 'Status', 'Additional Notes'],
    ...safeBookings.map((b) => [
      b.id ?? '',
      b.booking_date ?? '',
      b.booking_time ?? '',
      b.name ?? '',
      b.car_make ?? '',
      b.car_model ?? '',
      b.service ?? '',
      b.total_price ?? '',
      b.status ?? '',
      b.message ?? ''
    ])
  ];

  try {
    // Clear existing data in the range (including old headers)
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: SHEET_RANGE
    });

    // Write new headers + data
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: SHEET_RANGE,
      valueInputOption: 'RAW',
      requestBody: {
        values
      }
    });

    console.log(`Synced ${safeBookings.length} bookings to Google Sheet.`);
  } catch (err) {
    console.error('Google Sheets error:', err);
    process.exit(1);
  }
}

syncBookingsToSheet().catch((err) => {
  console.error('Unexpected error during sync:', err);
  process.exit(1);
});

