// apiGateway.js
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
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

// Charger les résolveurs et le schéma GraphQL pour les magazines
const resolvers = require('./resolvers');
const typeDefs = require('./schema').default;



// Créer une instance ApolloServer avec le schéma et les résolveurs importés
const server = new ApolloServer({ typeDefs, resolvers });

// Appliquer le middleware ApolloServer à l'application Express
server.start().then(() => {
  app.use(
    cors(),
    bodyParser.json(),
    expressMiddleware(server)
  );
});
// Créer une nouvelle application Express
const app = express();
// Définir les routes pour les magazines
app.get('/magazines', (req, res) => {
  const client = new magazineProto.MagazineService('localhost:50053', grpc.credentials.createInsecure());
  client.searchMagazines({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.magazines);
    }
  });
});

app.get('/magazines/:id', (req, res) => {
  const client = new magazineProto.MagazineService('localhost:50053', grpc.credentials.createInsecure());
  const id = req.params.id;
  client.getMagazine({ magazineId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.magazine);
    }
  });
});

// Démarrer l'application Express
const port = 3001;
app.listen(port, () => {
  console.log(`API Gateway en cours d'exécution sur le port ${port}`);
});
