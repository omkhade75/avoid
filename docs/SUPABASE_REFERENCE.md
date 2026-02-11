# 📘 Supabase Quick Reference Guide

## ✅ Your Current Setup:

### **Supabase Project:**
- **Project URL:** `https://adhpguafiuzrjtniegff.supabase.co`
- **Project ID:** `adhpguafiuzrjtniegff`
- **Status:** ✅ Configured and Ready

### **Environment Variables:**
Located in `.env.local`:
```
VITE_SUPABASE_URL=https://adhpguafiuzrjtniegff.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Database Schema:**
✅ Already created with these tables:
- `users` - User accounts
- `agents` - AI agents
- `chat_messages` - Chat history
- `call_logs` - Phone call records

---

## 🔗 Important Links:

### **Supabase Dashboard:**
https://supabase.com/dashboard/project/adhpguafiuzrjtniegff

### **Quick Access:**
- **Table Editor:** https://supabase.com/dashboard/project/adhpguafiuzrjtniegff/editor
- **SQL Editor:** https://supabase.com/dashboard/project/adhpguafiuzrjtniegff/sql
- **API Docs:** https://supabase.com/dashboard/project/adhpguafiuzrjtniegff/api
- **Logs:** https://supabase.com/dashboard/project/adhpguafiuzrjtniegff/logs/explorer

---

## 📊 View Your Data:

### **See All Agents:**
1. Go to: https://supabase.com/dashboard/project/adhpguafiuzrjtniegff/editor
2. Click on **"agents"** table
3. You'll see all agents created by all users

### **See Call Logs:**
1. Go to: https://supabase.com/dashboard/project/adhpguafiuzrjtniegff/editor
2. Click on **"call_logs"** table
3. You'll see all phone calls made

### **See Users:**
1. Go to: https://supabase.com/dashboard/project/adhpguafiuzrjtniegff/editor
2. Click on **"users"** table
3. You'll see all registered users

---

## 🔍 Useful SQL Queries:

### **Count Total Agents:**
```sql
SELECT COUNT(*) FROM agents;
```

### **Count Agents by User:**
```sql
SELECT owner_id, COUNT(*) as agent_count 
FROM agents 
GROUP BY owner_id;
```

### **Get Recent Calls:**
```sql
SELECT * FROM call_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

### **Get Agent with Most Calls:**
```sql
SELECT name, calls FROM agents 
ORDER BY calls DESC 
LIMIT 1;
```

### **Total Calls by Status:**
```sql
SELECT status, COUNT(*) as count 
FROM call_logs 
GROUP BY status;
```

---

## 🔒 Security Features:

### **Row Level Security (RLS):**
✅ Enabled on all tables

### **Policies in Place:**
- Users can only see their own agents
- Users can only see call logs for their agents
- Users can only update their own data
- Database enforces these rules automatically

---

## 📱 How Your App Uses Supabase:

### **When User Creates Agent:**
```typescript
// Saves to Supabase
await supabase.from('agents').insert([{
  id: newAgent.id,
  owner_id: user.id,
  name: "Sarah",
  role: "Professional Representative",
  system_prompt: "...",
  first_message: "Hello! My name is Sarah..."
}]);
```

### **When User Loads Agents:**
```typescript
// Loads from Supabase
const { data } = await supabase
  .from('agents')
  .select('*')
  .eq('owner_id', user.id);
```

### **When Call is Made:**
```typescript
// Saves call log
await supabase.from('call_logs').insert([{
  agent_id: agent.id,
  phone_number: "+1234567890",
  duration: 120,
  status: "completed"
}]);
```

---

## 🚨 Troubleshooting:

### **If agents don't load:**
1. Check browser console (F12)
2. Look for Supabase errors
3. Verify `.env.local` has correct keys
4. Restart dev server

### **If data doesn't save:**
1. Check browser console for errors
2. Verify database tables exist
3. Check RLS policies are correct
4. Verify user is logged in

### **If you see "Supabase not available":**
1. Check internet connection
2. Verify Supabase project is active
3. Check API keys in `.env.local`
4. App will fall back to localStorage

---

## 📊 Database Limits (Free Tier):

- **Database Size:** 500 MB
- **Bandwidth:** 5 GB/month
- **API Requests:** Unlimited
- **Row Level Security:** ✅ Included
- **Automatic Backups:** ✅ Daily

---

## 🔄 Backup & Export:

### **Export Data:**
1. Go to SQL Editor
2. Run: `SELECT * FROM agents;`
3. Click "Download as CSV"

### **Backup Database:**
1. Go to Settings → Database
2. Click "Backups"
3. Download backup file

---

## 🎯 What You DON'T Need to Do:

- ❌ No need to create tables again (already done)
- ❌ No need to set up authentication (using localStorage for now)
- ❌ No need to configure RLS (already configured)
- ❌ No need to add more API keys (already in .env.local)

---

## ✅ Everything is Ready!

Your Supabase is **fully configured** and **working**. Just:
1. Create agents in your app
2. Make calls
3. Data automatically saves to Supabase
4. View data in Supabase dashboard

**No additional Supabase setup required!** 🎉

---

## 📞 Need Help?

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **Your Dashboard:** https://supabase.com/dashboard/project/adhpguafiuzrjtniegff
