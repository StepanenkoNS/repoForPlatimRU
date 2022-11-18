
import { GenericEnqueueAsyncSendMessage } from '../../Types/Telegram/EnqueueSendMessageTypes';
import { S3Helper } from '../S3/S3Utils';

export async function UploadTelegramAttachmentsToS3(msg: GenericEnqueueAsyncSendMessage){
    let uploadedMessage = msg;
    if (('messageAttachment' in uploadedMessage ) && (uploadedMessage.messageAttachment)) {
        const uploadedFileURL = await S3Helper.UploadFileToS3(
            uploadedMessage.botId, 
            uploadedMessage.sender, 
            uploadedMessage.messageAttachment );
        const presignedUrl = await S3Helper.GeneratePresignedURL(process.env.s3BotsBucket!,uploadedFileURL.Key,3650);
        if (uploadedMessage.text.trim() !=='' ) {
            uploadedMessage.text = "<a href='"+presignedUrl+"'> </a>"+ uploadedMessage.text;
        } else {
            uploadedMessage.text = "<a href='"+presignedUrl+"'>_</a>"+ uploadedMessage.text;           
        }
    }

    if (('photo' in uploadedMessage ) && (uploadedMessage.photo)) {
        const uploadedFileURL = await S3Helper.UploadFileToS3(
            uploadedMessage.botId, 
            uploadedMessage.sender, 
            uploadedMessage.photo );
        const presignedUrl = await S3Helper.GeneratePresignedURL(process.env.s3BotsBucket!,uploadedFileURL.Key,3650);
        uploadedMessage.photo = presignedUrl;
    }    

    if (('audio' in uploadedMessage ) && (uploadedMessage.audio)) {
        const uploadedFileURL = await S3Helper.UploadFileToS3(
            uploadedMessage.botId, 
            uploadedMessage.sender, 
            uploadedMessage.audio );
        const presignedUrl = await S3Helper.GeneratePresignedURL(process.env.s3BotsBucket!,uploadedFileURL.Key,3650);
        uploadedMessage.audio = presignedUrl;
    }   
    
    if (('document' in uploadedMessage ) && (uploadedMessage.document)) {
        const uploadedFileURL = await S3Helper.UploadFileToS3(
            uploadedMessage.botId, 
            uploadedMessage.sender, 
            uploadedMessage.document );
        const presignedUrl = await S3Helper.GeneratePresignedURL(process.env.s3BotsBucket!,uploadedFileURL.Key,3650);
        uploadedMessage.document = presignedUrl;
    }   

    if (('video' in uploadedMessage ) && (uploadedMessage.video)) {
        const uploadedFileURL = await S3Helper.UploadFileToS3(
            uploadedMessage.botId, 
            uploadedMessage.sender, 
            uploadedMessage.video );
        const presignedUrl = await S3Helper.GeneratePresignedURL(process.env.s3BotsBucket!,uploadedFileURL.Key,3650);
        uploadedMessage.video = presignedUrl;
    }   
   
    if (('voice' in uploadedMessage ) && (uploadedMessage.voice)) {
        const uploadedFileURL = await S3Helper.UploadFileToS3(
            uploadedMessage.botId, 
            uploadedMessage.sender, 
            uploadedMessage.voice );
        const presignedUrl = await S3Helper.GeneratePresignedURL(process.env.s3BotsBucket!,uploadedFileURL.Key,3650);
        uploadedMessage.voice = presignedUrl;
    }  
    

    if (('video_note' in uploadedMessage ) && (uploadedMessage.video_note)) {
        const uploadedFileURL = await S3Helper.UploadFileToS3(
            uploadedMessage.botId, 
            uploadedMessage.sender, 
            uploadedMessage.video_note );
        const presignedUrl = await S3Helper.GeneratePresignedURL(process.env.s3BotsBucket!,uploadedFileURL.Key,3650);
        uploadedMessage.video_note = presignedUrl;
    }      

    
    return uploadedMessage;
}