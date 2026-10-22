const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection URI from Environment variable
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo-service:27017/day8db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a simple schema for visitor tracking
const visitorSchema = new mongoose.Schema({ count: Number, updatedAt: { type: Date, default: Date.now } });
const Visitor = mongoose.model('Visitor', visitorSchema);

app.use(express.urlencoded({ extended: true }));

// User-Friendly HTML Dashboard UI
app.get('/', async (req, res) => {
  let visits = 1;
  try {
    let doc = await Visitor.findOne();
    if (!doc) {
      doc = new Visitor({ count: 1 });
      await doc.save();
    } else {
      doc.count += 1;
      await doc.save();
    }
    visits = doc.count;
  } catch (e) {
    console.log('Database offline, running in stateless mode');
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CloudPulse Dashboard - Day 8</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .card { background: #1e293b; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); text-align: center; max-width: 500px; width: 100%; border: 1px solid #334155; }
            h1 { color: #38bdf8; margin-bottom: 10px; }
            p { color: #94a3b8; font-size: 1.1rem; }
            .badge { display: inline-block; background: #0284c7; color: white; padding: 6px 14px; border-radius: 20px; font-weight: bold; margin-top: 20px; }
            .footer { margin-top: 30px; font-size: 0.85rem; color: #64748b; }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>🚀 CloudPulse Dashboard</h1>
            <p>Welcome to your advanced <b>Day 8 Kubernetes App</b> running on Azure AKS!</p>
            <div class="badge">Page Views Counter: ${visits}</div>
            <div class="footer">Managed with Helm & GitHub Actions CI/CD</div>
        </div>
    </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`CloudPulse server running on port ${PORT}`);
});
