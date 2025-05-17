import { Controller, Post, Body } from '@nestjs/common';
import axios from 'axios';

@Controller('api')
export class ContactController {
  @Post('contact')
  async receiveContact(@Body() body: any) {
    console.log("📩 Received form data:", body);

    try {
      const response = await axios.post('http://localhost:5678/webhook/contact', body, {
        headers: {
          'x-api-key': 'ricky-secret-123',
        },
      });

      console.log("✅ Forwarded to n8n. Response:", response.data);

      return {
        success: true,
        message: 'Contact received and forwarded to automation',
        data: response.data,
      };
    } catch (err) {
      console.error("❌ Error sending to n8n:", err.message);
      if (err.response?.data) {
        console.error("n8n said:", err.response.data);
      }

      return {
        success: false,
        message: 'Failed to send to automation',
        error: err.message,
        ...(err.response?.data && { details: err.response.data }),
      };
    }
  }
}