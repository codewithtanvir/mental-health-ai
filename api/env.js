/**
 * Vercel API endpoint to serve environment variables
 * This endpoint provides frontend access to environment variables
 */

export default function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Set CORS headers for your domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        // Prepare environment variables for frontend
        const envVars = {
            GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
            SUPABASE_URL: process.env.SUPABASE_URL || 'https://brecotrpmeiwktcffdws.supabase.co',
            SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZWNvdHJwbWVpd2t0Y2ZmZHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NzM1MzcsImV4cCI6MjA3MDQ0OTUzN30.eixsq-rJ5JGDihhA1DVKPaXnycFnNRoUvER0HMnlnqI',
            NODE_ENV: process.env.NODE_ENV || 'production',
            ENABLE_CHAT: process.env.ENABLE_CHAT === 'true' || true,
            ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === 'true' || false,
            ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@mentalhealth-ai.bd',
            SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'support@mentalhealth-ai.bd'
        };

        // Log for debugging (remove in production)
        console.log('Environment variables requested from:', req.headers.referer || 'unknown');
        console.log('GEMINI_API_KEY available:', !!envVars.GEMINI_API_KEY);

        // Return environment variables
        res.status(200).json(envVars);
    } catch (error) {
        console.error('Error serving environment variables:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Failed to load environment variables'
        });
    }
}
