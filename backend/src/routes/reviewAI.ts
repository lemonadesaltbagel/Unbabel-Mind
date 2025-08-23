import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import https from 'https';

const router = Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }
    
    const openaiToken = process.env.OPENAI_API_KEY;
    if (!openaiToken) {
      res.status(400).json({ error: 'OpenAI API key not configured' });
      return;
    }
    
    const postData = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000
    });
    
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const request = https.request(options, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          res.json({
            generated_text: jsonData.choices[0]?.message?.content || 'No response from AI'
          });
        } catch (error) {
          res.status(500).json({ error: 'Invalid response from OpenAI' });
        }
      });
    });
    
    request.on('error', (error) => {
      console.error('Request error:', error);
      res.status(500).json({ error: 'Request failed' });
    });
    
    request.write(postData);
    request.end();
  } catch (error) {
    console.error('Review AI error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
