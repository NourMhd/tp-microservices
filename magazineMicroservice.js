const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { Kafka } = require('kafkajs');

const magazineProtoPath = 'magazine.proto';
const magazineProtoDefinition = protoLoader.loadSync(magazineProtoPath);
const magazineProto = grpc.loadPackageDefinition(magazineProtoDefinition).magazine;

const kafka = new Kafka({ clientId: 'magazine-microservice', brokers: ['localhost:9092'] });
const producer = kafka.producer();

const magazineService = {
  createMagazine: async (call, callback) => {
    const { title, description } = call.request;
    const magazine = { id: '1', title, description };

    await producer.connect();
    await producer.send({
      topic: 'magazines_topic',
      messages: [{ value: JSON.stringify(magazine) }],
    });
    await producer.disconnect();

    callback(null, { magazine });
  },
};

const server = new grpc.Server();
server.addService(magazineProto.MagazineService.service, magazineService);
server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }
  console.log(`Server running on port ${port}`);
  server.start();
});