import * as mongoose from "mongoose";
import config from "../config";
mongoose.set("strictQuery", true);

const dbConfig = config.database;

let mongooseConnection: typeof mongoose;

export async function connect() {
  const port = dbConfig.port ? `:${dbConfig.port}` : "";
  const dbUri = `mongodb://${dbConfig.host}/${dbConfig.database}${port}`;

  if (!mongooseConnection) {
    mongooseConnection = await mongoose.connect(dbUri, {
      user: dbConfig.username,
      pass: dbConfig.password,
    });
  }

  if (
    mongooseConnection.connection &&
    mongooseConnection.connection.readyState === mongoose.STATES.disconnected &&
    mongooseConnection.connect
  ) {
    await mongooseConnection.connect?.(dbUri, {
      user: dbConfig.username,
      pass: dbConfig.password,
    });
  } else {
    mongooseConnection = await mongoose.connect(dbUri, {
      user: dbConfig.username,
      pass: dbConfig.password,
    });
  }
}

export async function disconnect() {
  await mongooseConnection.disconnect?.();
}

export async function getConnection() {
  return mongooseConnection;
}
