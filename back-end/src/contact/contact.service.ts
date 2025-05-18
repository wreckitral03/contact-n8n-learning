import { toZonedTime, format } from 'date-fns-tz';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async createContact(data: CreateContactDto & { ip?: string; userAgent?: string }) {
    console.log('📦 Received in service:', data); // DEBUG LOG

    const saved = await this.prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
        ip: data.ip,
        userAgent: data.userAgent,
      },
    });

    const zonedCreatedAt = toZonedTime(saved.createdAt, 'Asia/Jakarta');
    const formattedCreatedAt = format(zonedCreatedAt, 'yyyy-MM-dd HH:mm:ssXXX', {
      timeZone: 'Asia/Jakarta',
    });

    return {
      ...saved,
      createdAt: formattedCreatedAt,
    };
  }

async getSummary() {
  const count = await this.prisma.contact.count();
  return { totalContacts: count };
}


}