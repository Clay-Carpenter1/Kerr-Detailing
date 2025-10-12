# Kerr Detailing - Professional Car Detailing Website

A modern, responsive web application for a mobile car detailing business built with React, Vite, and Supabase.

## 🚗 Features

### 📱 **4-Step Booking System**
- **Step 1**: Contact information and appointment scheduling
- **Step 2**: Vehicle details and specifications
- **Step 3**: Service package selection with customizable add-ons
- **Step 4**: Secure payment processing with Stripe integration

### 💳 **Payment Integration**
- Stripe payment processing with test and live modes
- Secure serverless payment functions
- Payment status tracking and confirmation

### 📧 **Communication Features**
- SMS reminder system with customer opt-in
- Text message notifications 24 hours before appointments
- Email confirmations and updates

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Professional hero sections with custom background images
- Interactive before/after photo gallery
- Customer reviews and testimonials
- Smooth animations with Framer Motion

### 📊 **Business Management**
- Customer booking history and management
- Service package customization with add-ons
- Real-time appointment availability checking
- Comprehensive booking receipt system

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **SMS**: Twilio (serverless functions)
- **Deployment**: Vercel
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)
- Twilio account (for SMS, optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Clay-Carpenter1/Kerr-Detailing.git
   cd Kerr-Detailing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Supabase
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Stripe
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

   # Twilio (for SMS reminders)
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

4. **Set up the database**
   Run the SQL migration in your Supabase dashboard:
   ```sql
   -- See database_migration.sql for complete schema
   ALTER TABLE bookings 
   ADD COLUMN IF NOT EXISTS addons TEXT,
   ADD COLUMN IF NOT EXISTS total_price NUMERIC DEFAULT 0,
   ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50),
   ADD COLUMN IF NOT EXISTS payment_method_id TEXT,
   ADD COLUMN IF NOT EXISTS text_reminders BOOLEAN DEFAULT FALSE;
   ```

5. **Add your background image**
   Place `darkened_overlay_stronger.avif` in the `public/` directory

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── ui/              # Base UI components
│   ├── BookingModal.jsx # Multi-step booking system
│   ├── PaymentModal.jsx # Stripe payment integration
│   └── ...
├── pages/               # Page components
│   ├── Home.jsx         # Homepage with hero, gallery, reviews
│   ├── Services.jsx     # Service packages and pricing
│   ├── Gallery.jsx      # Photo gallery with lightbox
│   ├── Bookings.jsx     # Customer booking management
│   └── ...
├── lib/                 # Utility functions
│   ├── supabase.js      # Database configuration
│   ├── stripe.js        # Payment configuration
│   └── bookingUtils.js  # Booking logic
├── contexts/            # React contexts
│   └── AuthContext.jsx  # Authentication state
api/                     # Serverless functions
├── send-reminder.js     # SMS reminder service
├── check-reminders.js   # Daily reminder check
└── test-sms.js         # SMS testing endpoint
```

## 🔧 Configuration

### **Supabase Setup**
1. Create a new Supabase project
2. Run the database migration from `database_migration.sql`
3. Enable Row Level Security (RLS) on tables
4. Configure authentication providers as needed

### **Stripe Setup**
1. Create a Stripe account
2. Get your publishable key from the dashboard
3. For production, set up webhooks and payment intents

### **Twilio Setup (Optional)**
1. Create a Twilio account
2. Purchase a phone number
3. Get your Account SID and Auth Token
4. Set up the serverless functions for automated reminders

## 📱 **Service Packages**

- **Premium Package** ($149) - Comprehensive detailing with protection
- **Diamond Package** ($249) - Ultimate detailing with ceramic coating

### **Available Add-ons**
- Engine Bay Cleaning (+$35)
- Headlight Restoration (+$45)
- Pet Hair Removal (+$25)
- Odor Elimination (+$40)
- Fabric Protection (+$30)
- Premium Tire Dressing (+$20)

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### **Other Platforms**
The app can be deployed to Netlify, AWS Amplify, or any static hosting service that supports serverless functions.

## 📧 **SMS Reminders**

The app includes automated SMS reminder functionality:
- Customers can opt-in during booking
- Reminders sent 24 hours before appointments
- Uses Twilio for reliable delivery
- Serverless functions handle scheduling

### **Testing SMS**
Visit `/test-sms` in development to test the SMS functionality.

## 🎨 **Customization**

### **Branding**
- Update colors in `tailwind.config.js`
- Replace `darkened_overlay_stronger.avif` with your own background
- Modify service packages and pricing in components

### **Content**
- Update business information in components
- Add your own before/after photos
- Customize service descriptions and pricing

## 📄 **License**

This project is private and proprietary to Kerr Detailing.

## 🤝 **Support**

For technical support or customization requests, please contact the development team.

---

**Built with ❤️ for Kerr Detailing**
