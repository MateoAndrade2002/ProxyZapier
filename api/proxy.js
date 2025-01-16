require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const zappierFormCotizaURL = process.env.ZAPIER_WEBHOOK_FORMCOTIZA_URL;

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            if (!zappierFormCotizaURL) {
                return res.status(500).json({ error: 'URL not found' });
            }

            const zapierResponse = await fetch(zappierFormCotizaURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body),
            });

            if (!zapierResponse.ok) {
                const errorText = await zapierResponse.text();
                throw new Error(`Error al enviar los datos a zapier: ${errorText}`);
            }

            const responseData = await zapierResponse.json();
            console.log(responseData);
            res.status(200).json({
                message: 'Datos procesados con éxito',
                // access_token,
                // instance_url,
                request_data: req.body
            });
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            res.status(500).json({ error: 'Error al procesar la solicitud' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
};
