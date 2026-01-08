import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
@UseGuards(ThrottlerGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  /**
   * POST /contact
   * Public endpoint for contact form submissions.
   * Rate limited to 3 attempts per minute to prevent spam.
   */
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    return await this.contactService.handleSubmission(createContactDto);
  }
}
