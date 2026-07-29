const { MongoClient } = require('mongodb');

const OLD_URI = 'mongodb+srv://karim:Karim%401913@cluster0.yrlmnqb.mongodb.net/hiring-platform';
const NEW_URI = 'mongodb+srv://karim_db:Karim5080@cluster0.j1evltq.mongodb.net/hiring-platform?appName=Cluster0';

async function migrate() {
  console.log('Connecting to OLD database...');
  const oldClient = new MongoClient(OLD_URI);
  await oldClient.connect();
  const oldDb = oldClient.db('hiring-platform');

  console.log('Connecting to NEW database...');
  const newClient = new MongoClient(NEW_URI);
  await newClient.connect();
  const newDb = newClient.db('hiring-platform');

  const collections = await oldDb.listCollections().toArray();
  console.log(`Found ${collections.length} collections: ${collections.map(c => c.name).join(', ')}`);

  for (const col of collections) {
    const name = col.name;
    console.log(`\nMigrating collection: ${name}`);

    const docs = await oldDb.collection(name).find({}).toArray();
    console.log(`  Found ${docs.length} documents`);

    if (docs.length > 0) {
      await newDb.collection(name).deleteMany({});
      await newDb.collection(name).insertMany(docs);
      console.log(`  ✅ Migrated ${docs.length} documents to new DB`);
    } else {
      console.log(`  ⚠️ Collection is empty, skipping`);
    }
  }

  await oldClient.close();
  await newClient.close();
  console.log('\n✅ Migration completed successfully!');
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
