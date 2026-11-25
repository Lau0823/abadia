import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

interface UploadResult {
  secure_url: string;
}

@Injectable()
export class SettingsService {
  private static readonly PRIVATE_SETTING_KEYS = new Set([
    'google_access_token',
    'google_refresh_token',
  ]);
  private static readonly ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'mov', 'm4v'];
  private static readonly ALLOWED_IMAGE_EXTENSIONS = [
    'jpg',
    'jpeg',
    'png',
    'webp',
    'gif',
    'avif',
  ];
  private static readonly KNOWN_VIDEO_EXTENSIONS = [
    ...SettingsService.ALLOWED_VIDEO_EXTENSIONS,
    'webm',
    'ogg',
  ];

  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadFile(key: string, file: Express.Multer.File) {
    const extension =
      (file.originalname || '').split('.').pop()?.toLowerCase() || '';
    const isVideo =
      file.mimetype.includes('video') ||
      SettingsService.KNOWN_VIDEO_EXTENSIONS.includes(extension);
    const isImage = file.mimetype.includes('image');

    // El front ya valida antes de enviar; esto evita que un cliente directo guarde
    // un formato que el banner no puede reproducir.
    if (
      isVideo &&
      !SettingsService.ALLOWED_VIDEO_EXTENSIONS.includes(extension)
    ) {
      throw new UnprocessableEntityException(
        'Formato de video no admitido. Usa MP4, MOV o M4V para el banner.',
      );
    }
    if (
      !isVideo &&
      !isImage &&
      !SettingsService.ALLOWED_IMAGE_EXTENSIONS.includes(extension)
    ) {
      throw new UnprocessableEntityException(
        'Formato de archivo no admitido. Usa una imagen JPG, PNG, WEBP, GIF o AVIF, o un video MP4, MOV o M4V.',
      );
    }

    const uploadResult = (
      isVideo
        ? await this.cloudinaryService.uploadVideo(file)
        : await this.cloudinaryService.uploadImage(file)
    ) as UploadResult;
    return await this.upsert(
      key,
      uploadResult.secure_url,
      `Archivo para ${key}`,
    );
  }

  async findAll() {
    const settings = await this.settingRepository.find();
    return settings.filter((setting) => !this.isPrivateKey(setting.key));
  }

  async findOne(key: string) {
    this.assertPublicKey(key);
    const setting = await this.settingRepository.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key ${key} not found`);
    }
    return setting;
  }

  async findPrivateOne(key: string) {
    if (!this.isPrivateKey(key)) {
      throw new BadRequestException('This key is not private');
    }

    const setting = await this.settingRepository.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key ${key} not found`);
    }
    return setting;
  }

  async upsert(key: string, value: string, description?: string) {
    this.assertPublicKey(key);
    let setting = await this.settingRepository.findOne({ where: { key } });
    if (setting) {
      setting.value = value;
      if (description) setting.description = description;
      return await this.settingRepository.save(setting);
    } else {
      setting = this.settingRepository.create({ key, value, description });
      return await this.settingRepository.save(setting);
    }
  }

  async upsertPrivate(key: string, value: string, description?: string) {
    if (!this.isPrivateKey(key)) {
      throw new BadRequestException('This key is not private');
    }

    let setting = await this.settingRepository.findOne({ where: { key } });
    if (setting) {
      setting.value = value;
      if (description) setting.description = description;
      return await this.settingRepository.save(setting);
    }

    setting = this.settingRepository.create({ key, value, description });
    return await this.settingRepository.save(setting);
  }

  // Permite actualizar múltiples a la vez
  async upsertMany(
    settings: { key: string; value: string; description?: string }[],
  ) {
    settings.forEach((setting) => this.assertPublicKey(setting.key));

    const results: Setting[] = [];
    for (const s of settings) {
      results.push(await this.upsert(s.key, s.value, s.description));
    }
    return results;
  }

  private isPrivateKey(key: string) {
    const normalizedKey = key.trim().toLowerCase();
    return (
      SettingsService.PRIVATE_SETTING_KEYS.has(normalizedKey) ||
      /(^|[_-])(token|secret|password|credential|api[_-]?key|private[_-]?key)([_-]|$)/.test(
        normalizedKey,
      )
    );
  }

  private assertPublicKey(key: string) {
    if (this.isPrivateKey(key)) {
      throw new BadRequestException(
        'Credentials must be configured on the server',
      );
    }
  }
}
