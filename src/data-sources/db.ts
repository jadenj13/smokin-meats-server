import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Model, Document } from 'mongoose';
import { FilterQuery } from 'mongodb';
import { Context } from '../types/context';

abstract class Db<T extends Document> extends DataSource {
  abstract model: Model<T>;
  context: Context;

  constructor() {
    super();
  }

  initialize(config: DataSourceConfig<Object>) {
    this.context = config.context as Context;
  }

  async create(object: any) {
    const doc = new this.model(object);
    const res = await doc.save();
    return res;
  }

  async findById(id: string) {
    const res = await this.model.findById(id);
    return res;
  }

  async findOne(query: FilterQuery<any>) {
    const res = await this.model.findOne(query);
    return res;
  }

  async find(query: FilterQuery<any>) {
    const res = await this.model.find(query);
    return Array.isArray(res) ? res.filter(r => r) : [];
  }

  async updateById(id: string, updates: any) {
    const res = await this.model.findByIdAndUpdate(id, updates, { new: true });
    return res;
  }

  async updateOne(query: FilterQuery<any>, updates: any) {
    const res = await this.model.updateOne(query, updates, { new: true });
    return res;
  }

  async updateMany(query: FilterQuery<any>, updates: any) {
    const res = await this.model.updateMany(query, updates, { new: true });
    return Array.isArray(res) ? res.filter(r => r) : [];
  }

  async deleteById(id: string) {
    const res = await this.model.findByIdAndDelete(id);
    return res;
  }

  async aggregate(pipeline: any[]) {
    const res = await this.model.aggregate(pipeline);
    return Array.isArray(res) ? res.filter(r => r) : [];
  }
}

export default Db;
