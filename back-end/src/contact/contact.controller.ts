type CreateContactWithMeta = CreateContactDto & { ip?: string; userAgent?: string };
import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { Get } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { toZonedTime, format } from 'date-fns-tz';

@Controller('api')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('contact')
  async receive(@Body() body: CreateContactDto, @Req() req: Request) {
    console.log('📥 Received in controller:', body); // DEBUG LOG

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';

    const payload: CreateContactWithMeta = {
      ...body,
      ip: Array.isArray(ip) ? ip[0] : ip,
      userAgent,
    };
    const saved = await this.contactService.createContact(payload);

    // Convert createdAt to Asia/Jakarta time
    const utcDate = new Date(saved.createdAt);
    const zonedCreatedAt = toZonedTime(utcDate, 'Asia/Jakarta');
    const formattedCreatedAt = format(zonedCreatedAt, 'yyyy-MM-dd HH:mm:ssXXX', {
      timeZone: 'Asia/Jakarta',
    });

    return {
      success: true,
      message: 'Saved to database',
      data: {
        ...saved,
        createdAt: formattedCreatedAt,
      },
    };
  }

  @Get('contact/summary')
async summary() {
  const summary = await this.contactService.getSummary();
  return {
    success: true,
    message: 'Summary fetched',
    data: summary,
  };
}

}