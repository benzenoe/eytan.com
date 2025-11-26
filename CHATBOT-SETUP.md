# Tidio Chatbot Setup Instructions

Your website is now ready for the Tidio AI chatbot! Follow these steps to activate it.

## Step 1: Create Your Tidio Account

1. Go to [https://www.tidio.com](https://www.tidio.com)
2. Click "Sign Up Free"
3. Create your account with your email (eytan@benzeno.com recommended)
4. Choose the Free plan (includes AI features and up to 50 conversations/month)

## Step 2: Get Your Tidio Installation Code

1. After signing up, you'll be taken to your Tidio dashboard
2. Go to **Settings** → **Channels** → **Live Chat**
3. Click on **"Installation"** or **"Install Tidio"**
4. You'll see a code that looks like this:
   ```html
   <script src="//code.tidio.co/abc123xyz456.js" async></script>
   ```
5. Copy the code that comes after `//code.tidio.co/` and before `.js`
   - Example: If your code is `abc123xyz456.js`, copy only `abc123xyz456`

## Step 3: Update Your Website

1. Open each HTML file in your website:
   - index.html
   - resume.html
   - blog.html
   - blog-post.html
   - contact.html
2. Find this line near the bottom:
   ```html
   <script src="//code.tidio.co/YOUR_TIDIO_KEY.js" async></script>
   ```
3. Replace `YOUR_TIDIO_KEY` with your actual Tidio key
   - Example: Change to `<script src="//code.tidio.co/abc123xyz456.js" async></script>`

## Step 4: Configure AI Chatbot

1. In your Tidio dashboard, go to **AI Chatbots** (or **Lyro AI**)
2. Enable the AI chatbot
3. Customize the welcome message, e.g.:
   ```
   Hi! I'm Eytan's AI assistant. I can help answer questions about real estate,
   AI & marketing consulting, e-commerce, or coaching services. I can also help
   you schedule a meeting with Eytan. How can I help you today?
   ```

## Step 5: Add Knowledge Base

1. In Tidio, go to **AI Chatbots** → **Knowledge Base**
2. Add information about your services:
   - Real Estate: SoldHere.com (Florida), SoldHere.pt (Portugal)
   - AI & Marketing: Bogen.ai consulting services
   - E-commerce expertise (20+ years experience)
   - Coaching & Mastermind: Reignation.com
3. You can also connect your website URL so Tidio learns from your content

## Step 6: Integrate Calendly for Appointments

### Option A: Add Calendly as a Quick Reply
1. Go to **Chatbots** → **Triggers & Actions**
2. Create a new trigger when user mentions: "appointment", "meeting", "schedule", "book"
3. Add an action with this message:
   ```
   I'd be happy to help you schedule a meeting with Eytan!

   Please use this link to book a convenient time:
   https://calendly.com/benzenoe/meeting-with-eytan

   You can choose from available time slots that work best for you.
   ```

### Option B: Add Calendly Button
1. Go to **Settings** → **Appearance** → **Conversation Starter**
2. Add a button that says "Schedule a Meeting"
3. Set the button URL to: `https://calendly.com/benzenoe/meeting-with-eytan`

### Option C: Train AI to Offer Calendly
1. In **AI Chatbots** settings, add this to your AI's instructions:
   ```
   When someone wants to schedule a meeting or appointment, provide this link:
   https://calendly.com/benzenoe/meeting-with-eytan
   ```

## Step 7: Customize Appearance

1. Go to **Settings** → **Appearance**
2. Customize colors to match your website:
   - Primary color: `#667eea` (matches your site's purple)
   - You can also upload your profile photo as the chatbot avatar
3. Set the chat bubble position (bottom right recommended)

## Step 8: Test Your Chatbot

1. Save all changes and commit them to GitHub
2. Wait for GitHub Pages to update (2-5 minutes)
3. Visit your website: https://benzenoe.github.io/eytan.com/
4. You should see the Tidio chat widget in the bottom right corner
5. Test it by:
   - Asking a question about your services
   - Requesting to schedule a meeting
   - Checking if the Calendly link appears

## Step 9: Mobile App (Optional)

1. Download the Tidio app on your phone (iOS/Android)
2. Log in to receive notifications when visitors message you
3. Respond to messages on the go

## Upgrading (Optional)

The free plan is great for getting started, but you can upgrade for:
- More conversations per month
- Advanced AI features
- Visitor tracking and analytics
- Remove "Powered by Tidio" branding
- Priority support

## Support

If you need help:
- Tidio Support: [https://help.tidio.com](https://help.tidio.com)
- Tidio University (tutorials): [https://www.tidio.com/academy/](https://www.tidio.com/academy/)

---

**Note**: After updating the HTML files with your Tidio key, make sure to commit and push the changes to GitHub for them to take effect on your live website.
