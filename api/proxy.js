require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
// const zappierFormCotizaURL = process.env.ZAPIER_WEBHOOK_FORMCOTIZA_URL;

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            let zapierURL = process.env.ZAPIER_WEBHOOK_DIST_ACEITE_URL;

            if(req.body.cual_medio_ === 'formCotiza'){
                zapierURL = process.env.ZAPIER_WEBHOOK_FORMCOTIZA_URL;
            }

            if (!zapierURL) {
                return res.status(500).json({ error: 'URL not found' });
            }

            console.log("Link: ", zapierURL);
            console.log('Req body', req.body);

            const zapierResponse = await fetch(zapierURL, {
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
