import { Controller, Post, Get } from '@nestjs/common';
import { MongoClient } from 'mongodb';

const OLD_URI = 'mongodb+srv://karim:Karim%401913@cluster0.yrlmnqb.mongodb.net/hiring-platform';
const NEW_URI = process.env.MONGODB_URI || '';

@Controller('migrate')
export class MigrateController {
  @Get()
  async status() {
    return { status: 'Migration endpoint ready. POST to /migrate to start.' };
  }

  @Post()
  async migrate() {
    const results: any[] = [];

    try {
      const oldClient = new MongoClient(OLD_URI, { serverSelectionTimeoutMS: 10000 });
      await oldClient.connect();
      const oldDb = oldClient.db('hiring-platform');

      const newClient = new MongoClient(NEW_URI, { serverSelectionTimeoutMS: 10000 });
      await newClient.connect();
      const newDb = newClient.db('hiring-platform');

      const collections = await oldDb.listCollections().toArray();

      for (const col of collections) {
        const name = col.name;
        const docs = await oldDb.collection(name).find({}).toArray();

        if (docs.length > 0) {
          await newDb.collection(name).deleteMany({});
          await newDb.collection(name).insertMany(docs);
          results.push({ collection: name, migrated: docs.length });
        } else {
          results.push({ collection: name, migrated: 0 });
        }
      }

      await oldClient.close();
      await newClient.close();

      return { success: true, results };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}
