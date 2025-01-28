# NestJS Fastify Boilerplate

Questo progetto è un boilerplate per applicazioni **NestJS** che utilizzano microservizi gestiti tramite protocollo **TCP**, il server HTTP **Fastify**, **Swagger** per la documentazione delle API, **Prisma ORM** per la gestione del database e **@nestjs/config** per la gestione centralizzata delle configurazioni tramite variabili di ambiente.

## Caratteristiche Principali

- **Microservizi TCP**: Comunicazione tra microservizi utilizzando il protocollo TCP.
- **Fastify**: Utilizzo di **Fastify** come server HTTP per migliorare le prestazioni rispetto al server Express.
- **Swagger**: Documentazione delle API tramite Swagger UI con generazione automatica dei tipi TypeScript tramite Swagger CLI.
- **Prisma ORM**: Gestione delle entità e delle operazioni CRUD tramite Prisma ORM, con migrazioni automatiche.
- **@nestjs/config**: Gestione delle configurazioni centralizzata con supporto per variabili di ambiente tramite file `.env`.

## ⚠️ Attenzione sull'uso dei file `.env`

Quando si utilizzano file `.env` con estensioni specifiche per diversi ambienti (es. `.env.development`, `.env.preprod`, `.env.production`), **i file con suffisso `.docker` devono essere sempre prioritari** nel caricamento, poiché sono destinati agli ambienti containerizzati (es. Docker).

### Linea guida:

- Se esiste un file `.env.NOME_ENVIRONMENT.docker`, questo deve essere sempre **caricato prima** degli altri file `.env`.
- Ad esempio:
  - In un ambiente Docker, se esistono sia `.env.local` che `.env.local.docker`, il file `.env.local.docker` deve essere prioritario.

Per garantire questa priorità, assicurati di configurare il modulo `ConfigModule` in NestJS come segue:

```typescript
ConfigModule.forRoot({
  envFilePath: [
    '.env.local.docker', // File prioritario
    '.env.local',
    '.env.development',
    '.env.preprod',
    '.env.production',
  ],
  isGlobal: true,
});
```

Inoltre, quando avvii il container Docker, verifica che NODE_ENV sia impostato correttamente per selezionare il file .env giusto.

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
  cp .env.example.docker .env.docker.local
  cp .env.example .env.development
  cp .env.example .env.preprod
  cp .env.example .env.production
  ```

5. Esegui il pull del database:
   ```bash
   yarn prisma:local:pull
   ```
6. Esegui la generazione dei tipi per prisma client:
   ```bash
   yarn prisma:local:generate
   ```
7. Avvia l’applicazione:
   ```bash
   yarn start:local or yarn start:local:watch
   ```

## Struttura del Progetto

Il boilerplate è organizzato in modo modulare per supportare la crescita del progetto. Ecco i principali componenti:

- **src/app.module.ts:** Modulo principale che importa e configura tutti gli altri moduli (es. microservizi, moduli di database).
- **src/database/:** Modulo per l’integrazione di Prisma ORM.
- **src/database/base.abstract.repository.ts** Implementazione del Repository Pattern utilizzando Prisma ORM per l'accesso ai dati.

### Repository Pattern con Classe Astratta

Il progetto utilizza una classe astratta per implementare il Repository Pattern. Questa classe astratta fornisce un'architettura di base per i repository, consentendo di centralizzare la logica di accesso ai dati e migliorare la manutenibilità del codice.

### Classe Astratta: BaseRepository

La classe astratta BaseRepository include metodi generici per operazioni CRUD comuni. I repository specifici delle entità possono estendere questa classe per implementare operazioni personalizzate.

### Documentazione API con Swagger

Il progetto integra Swagger (OpenAPI 3.0) per la documentazione automatica delle API, con configurazioni avanzate che includono:

- Generazione automatica della documentazione dai decoratori NestJS
- Supporto per la validazione degli schemi di richiesta/risposta
- Generazione di tipi TypeScript dallo schema OpenAPI

#### Configurazione Base

La documentazione viene generata automaticamente usando i decoratori @nestjs/swagger nei controller:

```ts
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
```

### Accesso alla Documentazione

La UI interattiva di Swagger è disponibile all'endpoint:

```bash
http://localhost:3000/api
```

### Generazione Tipi TypeScript da altri microservizi

1. Aprire il file generatorTypeFormSwagger.sh e inserire l'url di swagger nell array

```bash
SWAGGER_URLS=(
    "http://localhost:3002/swagger/json"
)
```

2. lanciare questo comando

```bash
bash ./generatorTypeFormSwagger.sh
```

3. verrà creata la folder api dove all'interno troverai una folder con il nome del microservizio

### Best Practices

1. Decoratori Espliciti: Usa sempre @ApiProperty() nei DTO
2. Descrizioni Dettagliate: Fornisce esempi e descrizioni nei decoratori
3. Sicurezza: Proteggi l'endpoint /api in produzione
4. Validazione: Abilita la trasformazione automatica dei DTO

````ts
// Esempio DTO con validazione
export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address'
  })
  @IsEmail()
  email: string;
}```
````
