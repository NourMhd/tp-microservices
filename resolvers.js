// resolvers.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger le fichier proto pour les magazines
const magazineProtoPath = 'magazine.proto';
const magazineProtoDefinition = protoLoader.loadSync(magazineProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const magazineProto = grpc.loadPackageDefinition(magazineProtoDefinition).magazine;

// Définir les résolveurs pour les requêtes GraphQL
const resolvers = {
  Query: {
    magazine: (_, { id }) => {
      // Effectuer un appel gRPC au microservice de magazines
      const client = new magazineProto.MagazineService('localhost:50053', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getMagazine({ magazineId: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.magazine);
          }
        });
      });
    },
    magazines: () => {
      // Effectuer un appel gRPC au microservice de magazines
      const client = new magazineProto.MagazineService('localhost:50053', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.searchMagazines({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.magazines);
          }
        });
      });
    },
  },
};

module.exports = resolvers;