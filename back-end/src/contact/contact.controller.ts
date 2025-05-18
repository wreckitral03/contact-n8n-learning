import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('api')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('contact')
  async receive(@Body() body: CreateContactDto, @Req() req: Request) {
    console.log('📥 Received in controller:', body); // DEBUG LOG

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';

    const saved = await this.contactService.createContact({
      ...body,
      ip: Array.isArray(ip) ? ip[0] : ip,
      userAgent,
    });

    return {
      success: true,
      message: 'Saved to database',
      data: saved,
    };
  }
}