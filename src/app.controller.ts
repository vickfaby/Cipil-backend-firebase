import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { FirebaseService } from './firebase/firebase.service';
import * as admin from 'firebase-admin';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('ws-messages')
  async addWsMessage(@Body() body: { text?: string }) {
    const text = body?.text?.trim();
    if (!text) {
      throw new BadRequestException('El campo text es requerido');
    }

    const docRef = await this.firebaseService.firestore
      .collection('ws-messages')
      .add({
        text,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return { id: docRef.id, text };
  }
}
