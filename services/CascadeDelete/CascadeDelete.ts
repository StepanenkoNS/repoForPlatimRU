import { TextHelper } from '/opt/TextHelpers/textHelper';
import { SQSEvent } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import ksuid from 'ksuid';
//@ts-ignore
import { EPaymentTarget, IDigitalStorePaymentInDB, IMeetingPaymentInDB, IPaidPostPaymentInDB, IRequestToConfirmPayment, ISubscriptionPaymentInDB } from '/opt/PaymentTypes';

import { PaymentOptionsManager } from '/opt/PaymentOptionsManager';

import { MessageSender } from '/opt/MessageSender';

import { ETelegramSendMethod } from '/opt/TelegramTypes';

import { ISubscribeUserToSubscriptionPlan } from '/opt/UserSubscriptionTypes';
//@ts-ignore
import { MasterManager } from '/opt/MasterManager';
import { SQSHelper } from '/opt/SQS/SQSHelper';
import { MessagingBotSubscriptionManager } from '/opt/MessagingBotSubscriptionManager';
import { DigitalStoreManager } from '/opt/DigitalStoreManager';
import { CalendarMeetingsConfiguratior } from '/opt/CalendarMeetingsConfiguratior';
import { ContentConfigurator } from '/opt/ContentConfigurator';

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log(event);
    for (const record of event.Records) {
        try {
            console.log('record', record);
        } catch (error) {
            console.log('Error in processing SQS consumer: ${record.body}', error);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
