import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { Contact } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private resend: Resend;

  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
    private configService: ConfigService,
  ) {
    this.resend = new Resend(
      this.configService.getOrThrow<string>('RESEND_API_KEY'),
    );
  }

  async handleSubmission(dto: CreateContactDto) {
    const { website, ...contactData } = dto;

    // 1. Honeypot check (Silent fail for bots)
    if (website) {
      this.logger.warn(`Bot detected: ${dto.email}`);
      return {
        data: { status: 'success' },
        message: 'Message sent successfully',
      };
    }

    try {
      // 2. Attempt to send Email first
      const receiverEmail = this.configService.getOrThrow<string>(
        'CONTACT_RECEIVER_EMAIL',
      );

      const emailResponse = await this.resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>',
        to: [receiverEmail],
        replyTo: contactData.email,
        subject: `[Website Message] ${contactData.subject}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #b45309;">New Message Received</h2>
            <p><strong>From:</strong> ${contactData.name} (${contactData.email})</p>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
            <hr />
            <p style="white-space: pre-wrap;">${contactData.message}</p>
          </div>
        `,
      });

      // 3. Only if Resend didn't throw an error, save to Database
      if (emailResponse.error) {
        throw new Error(emailResponse.error.message);
      }

      const newContact = new this.contactModel(contactData);
      await newContact.save();

      return {
        data: { id: emailResponse.data?.id },
        message:
          'Your message has been sent successfully. We will get back to you soon!',
      };
    } catch (error) {
      this.logger.error(`Failed to process contact form: ${error.message}`);
      // The Global Exception Filter will catch this and format the error for the frontend toast
      throw new InternalServerErrorException(
        'Could not send message. Please try again later.',
      );
    }
  }
}
