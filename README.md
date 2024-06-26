### How to run:

    yarn install
    copy .env.example to .env
    yarn start:dev (development)
    yarn start (production)

### Techstack:

-   ExpressJS
-   Typescript
-   Cache: Redis
-   Queue: BullMQ
-   Authentication: JWT
-   Database: TypeORM
-   Dependency Injection: TypeDI

### Project structures:

    - src/
      - configs/
        - index.ts
      - database/
        - connection.ts
        - procs.ts
      - queues/
      - modules/
        - users/
    	    - entities/
    	    - dtos/
    	    - user.controller.ts
    	    - user.middleware.ts
    	    - user.service.ts
    	    - user.route.ts
      - ultils/
      - app.ts
      - main.ts
    - node_modules/
    - package.json
    - tsconfig.json
    - .env

-   **base/**: Contains classes and interfaces used across the entire system.
-   **configs/**: Contains configuration files related to environment variables.
-   **database/**: Contains setup for database connection.
-   **queues/**: Contains setup for queues and workers.
-   **utils/**: Contains utility files (Cache, S3, Logger, etc.)
-   **modules/**:
    -   **\*.dto.ts**: DTO (Data object transfer) defines how the data will be sent over the network.
    -   **\*.entity.ts**: Define object map with table in database.
    -   **\*.service.ts**: Handling business logic.
    -   **\*.middleware.ts**
    -   **\*.controller.ts**: Handling incoming request and return response to client.
    -   **\*.route.ts**: Define how an application’s endpoints (URIs) respond to client requests
-   **app.ts**: Initializes necessary services for the application.
-   **main.ts**: The main file of the application, where the server is started.
