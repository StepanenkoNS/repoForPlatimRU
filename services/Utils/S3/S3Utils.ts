import { S3 } from "aws-sdk";
import axios from "axios";
import { v4 } from "uuid";

export class S3Helper {

    public static async GeneratePresignedURL(bucketName: string, objectKey: string, numberOfDays: number = 1) {
        const region = process.env.region;

        try {
            const s3Client = new S3({region: region});
            const signedUrlExpireSeconds = 60 * 60 * 24 * numberOfDays;

            const url = s3Client.getSignedUrl('getObject', {
                Bucket: bucketName,
                Key: objectKey,
                Expires: signedUrlExpireSeconds
            });
            console.log(url);
            return url;            
        } catch(error){
            console.log(error);
            throw (error);
        }
    }

    public static async UploadFileToS3(botId: string, sender:string, url:string) {
        try{
            const {data, headers} = await axios.get(url, {responseType: 'stream'});
            const fileName = url.substring(url.lastIndexOf('/')+1);
            const link = headers['content-type'];
            const s3bucket = new S3({});
            const date = new Date().getFullYear().toString()+'-'
            + ( new Date().getMonth()<10 ? '0'+ (new Date().getMonth().toString()) : (new Date().getMonth().toString())
                ) + '-'
            + ( new Date().getDay()<10 ? '0'+ (new Date().getDay().toString()) : (new Date().getDay().toString())
                ) ;              
            const objectParams:S3.PutObjectRequest = {
                Bucket: process.env.s3BotsBucket!,
                Key: botId +'/'+sender+'/'+date+'/'+v4()+'/'+fileName, 
                Body: data,
                ContentType: headers['content-type'],
            };
            const uploadResult = await s3bucket.upload(objectParams).promise();
            console.log(`File uploaded successfully. ${uploadResult}`);
            return uploadResult;

        } catch(err){
            console.log("ERROR --->" + err);
            throw(err);
        }    
    }
}