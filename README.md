# NestJS Fastify Boilerplate

Questo progetto è un boilerplate per applicazioni **NestJS** che utilizzano microservizi gestiti tramite protocollo **TCP**, il server HTTP **Fastify**, **Swagger** per la documentazione delle API, **Prisma ORM** per la gestione del database e **@nestjs/config** per la gestione centralizzata delle configurazioni tramite variabili di ambiente.

## Caratteristiche Principali

- **Microservizi TCP**: Comunicazione tra microservizi utilizzando il protocollo TCP.
- **Fastify**: Utilizzo di **Fastify** come server HTTP per migliorare le prestazioni rispetto al server Express.
- **Swagger**: Documentazione delle API tramite Swagger UI con generazione automatica dei tipi TypeScript tramite Swagger CLI.
- **Prisma ORM**: Gestione delle entità e delle operazioni CRUD tramite Prisma ORM, con migrazioni automatiche.
- **@nestjs/config**: Gestione delle configurazioni centralizzata con supporto per variabili di ambiente tramite file `.env`.

## Prerequisiti

Prima di iniziare, assicurati di avere installato:

- [Node.js](https://nodejs.org/) v14 o superiore
- [Docker](https://www.docker.com/) (opzionale, per utilizzare i container)
- Un database PostgreSQL compatibile con **Prisma**

## Installazione

1. **Fai il fork del repository**:

   - Vai al repository su GitHub e fai clic su "Fork" per creare una tua copia del progetto.

2. **Clona il repository forkato**:
   ```bash
   git clone https://github.com/tuo-utente/nome-repository.git
   cd nome-repository
   ```
3. Installa le dipendenze:
   ```bash
   yarn install
   ```
4. Configura l’ambiente:

- Crea un file .env nella root del progetto copiando il modello:
  ```bash
  cp .env.example .env.local
  cp .env.example .env.development
  cp .env.example .env.preprod
  cp .env.example .env.production
  ```

5. Esegui il pull del database:
   ```bash
   yarn prisma:pull:dev
   ```
6. Esegui la generazione dei tipi per prisma client:
   ```bash
   yarn prisma:generate:dev
   ```
7. Avvia l’applicazione:
   ```bash
   yarn start:dev or yarn start:debug
   ```

## Struttura del Progetto

Il boilerplate è organizzato in modo modulare per supportare la crescita del progetto. Ecco i principali componenti:

- **src/app.module.ts:** Modulo principale che importa e configura tutti gli altri moduli (es. microservizi, moduli di database).
- **src/prisma/:** Modulo per l’integrazione di Prisma ORM.
- **src/repositories/:** Implementazione del Repository Pattern utilizzando Prisma ORM per l'accesso ai dati.

### Repository Pattern con Classe Astratta

Il progetto utilizza una classe astratta per implementare il Repository Pattern. Questa classe astratta fornisce un'architettura di base per i repository, consentendo di centralizzare la logica di accesso ai dati e migliorare la manutenibilità del codice.

### Classe Astratta: BaseRepository

La classe astratta BaseRepository include metodi generici per operazioni CRUD comuni. I repository specifici delle entità possono estendere questa classe per implementare operazioni personalizzate.
