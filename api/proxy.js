import 'dotenv/config';
import axios from 'axios';

export default async function handler(req, res){
    if(req.method !== 'POST'){
        return res.status(405).json({ error: 'Method not allowd' });
    }
    const zappierFormCotizaURL = process.env.ZAPIER_WEBHOOK_FORMCOTIZA_URL;
    
    if(!zappierFormCotizaURL){
        return res.status(500).json({ error: 'URL not found' });
    }
    
    try{
        console.log('Data received:', req.body);
        const response = await axios.post(zappierFormCotizaURL, req.body, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error sending data:', error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            error: 'Error sending data',
            details: error.response?.data || error.message,
        });
    }
}
