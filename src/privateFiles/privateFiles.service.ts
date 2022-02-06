import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import PrivateFile from './privateFile.entity';

@Injectable()
export class PrivateFilesService {
  constructor(
    @InjectRepository(PrivateFile)
    private privateFilesRepository: Repository<PrivateFile>,
    private readonly configService: ConfigService,
  ) {}

  async uploadPrivateFile(dataBuffer: Buffer, ownerId: number, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    const newFile = this.privateFilesRepository.create({
      key: uploadResult.Key,
      owner: {
        id: ownerId,
      },
    });
    await this.privateFilesRepository.save(newFile);
    return newFile;
  }

  public async getPrivateFile(fileId: number) {
    const s3 = new S3();

    const fileInfo = await this.privateFilesRepository.findOne({ id: fileId }, { relations: ['owner'] });
    if (fileInfo) {
      const stream = await s3
        .getObject({
          Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
          Key: fileInfo.key,
        })
        .createReadStream();
      return {
        stream,
        info: fileInfo,
      };
    }
    throw new NotFoundException();
  }

  /**
   * TODO! Cannot find file.
   * @param key 
   */
  public async deletePrivateFile(key: string) {
    const s3 = new S3();

    const params = {
      Bucket: 'nestjs-indie-series-private-bucket',
      Key: '1aa52370-f3ff-48d8-86f8-e8780335d6d7-20190826_161356',
    };
    try {
      await s3.headObject(params).promise();
      console.log('File Found in S3');
      try {
        await s3.deleteObject(params).promise();
        console.log('file deleted Successfully');
      } catch (err) {
        console.log('ERROR in file Deleting : ' + JSON.stringify(err));
      }
    } catch (err) {
      console.log('File not Found ERROR : ' + err.code);
    }
  }

  public async generatePresignedUrl(key: string) {
    const s3 = new S3();

    return s3.getSignedUrlPromise('getObject', {
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: key,
    });
  }
}
