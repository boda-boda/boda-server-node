import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CAPABILITY } from 'src/constant';
import { Repository } from 'typeorm';
import UpsertRecipientRequest from './dto/upsert-recipient-request.dto';
import { RecipientMetaEntity } from './entity/recipient-meta.entity';
import { RecipientEntity } from './entity/recipient.entity';

@Injectable()
export class RecipientService {
  public constructor(
    @InjectRepository(RecipientEntity)
    private readonly recipientRepository: Repository<RecipientEntity>,

    @InjectRepository(RecipientMetaEntity)
    private readonly recipientMetaRepository: Repository<RecipientMetaEntity>,
  ) {}

  public getAllRecepientOfCareCenter(careCenterId: string) {
    return this.recipientRepository.find({
      relations: ['recipientMetas'],
      where: {
        careCenterId,
        isDeleted: false,
      },
    });
  }

  public checkRecipientValid(careCenterId: string, id: string) {
    return this.recipientRepository.findOne({ where: { id, careCenterId } });
  }

  public getRecipientById(careCenterId: string, id: string) {
    return this.recipientRepository.findOne({
      relations: ['recipientMetas'],
      where: {
        careCenterId,
        id,
        isDeleted: false,
      },
    });
  }

  public getRecipientByRecipientId(id: string) {
    return this.recipientRepository.findOne({
      relations: ['recipientMetas'],
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  public async createRecipient(careCenterId: string, recipientRequest: UpsertRecipientRequest) {
    const newRecipient = this.recipientRepository.create(recipientRequest);
    newRecipient.careCenterId = careCenterId;

    const targetRecipient = await this.recipientRepository.save(newRecipient);

    await this.createCapabilityMeta(recipientRequest.recipientCapabilities, targetRecipient.id);
  }

  public async updateRecipient(
    careCenterId: string,
    recipientRequest: UpsertRecipientRequest,
    id: string,
  ) {
    const targetRecipient = await this.recipientRepository.findOne({ where: { id, careCenterId } });
    const newRecipient = this.recipientRepository.merge(targetRecipient, recipientRequest);
    await this.recipientRepository.save(newRecipient);

    const capabilityMeta = recipientRequest.recipientCapabilities.map((key) => {
      return { type: CAPABILITY, key };
    });

    await this.updateRecipientMeta([...capabilityMeta], targetRecipient.id);
  }

  public async deleteRecipientById(careCenterId: string, id: string) {
    const targetRecipient = await this.recipientRepository.findOne({
      where: {
        careCenterId,
        id,
        isDeleted: false,
      },
    });

    targetRecipient.isDeleted = true;
    await this.recipientRepository.save(targetRecipient);
  }

  public async createCapabilityMeta(availabilities: string[], recipientId: string) {
    const availableMetaEntity = availabilities.map((a) =>
      this.recipientMetaRepository.create({
        type: CAPABILITY,
        key: a,
        recipientId,
      }),
    );

    await this.recipientMetaRepository.save(availableMetaEntity);
  }

  public async updateRecipientMeta(
    recipientMeta: Partial<RecipientMetaEntity>[],
    recipientId: string,
  ) {
    const metas = await this.recipientMetaRepository.find({
      where: {
        recipientId,
      },
    });

    const capabilityMeta = metas.filter((meta) => meta.type === CAPABILITY);
    const capabilityMetaRequest = recipientMeta
      .filter((meta) => meta.type === CAPABILITY)
      .map((meta) => {
        return { ...meta, recipientId };
      });

    const updatedCapabilityMeta = capabilityMetaRequest.map((meta, idx) => {
      if (capabilityMeta.length > idx) {
        return this.recipientMetaRepository.merge(capabilityMeta[idx], meta);
      }

      return this.recipientMetaRepository.create(meta);
    });

    const removedCapabilityMeta = capabilityMeta.splice(
      capabilityMetaRequest.length,
      capabilityMeta.length - capabilityMetaRequest.length,
    );

    if (removedCapabilityMeta.length)
      await this.recipientMetaRepository.remove(removedCapabilityMeta);

    await this.recipientMetaRepository.save([...updatedCapabilityMeta]);
  }
}
