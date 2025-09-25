FROM node:latest

# Possibly examine what actually needs to be copied here
COPY . /src
WORKDIR /src

RUN npm install

# Create a startup script that waits for DB and runs migrations
RUN echo '#!/bin/bash\n\
echo "Waiting for database to be ready..."\n\
npx prisma migrate deploy\n\
npx prisma generate\n\
echo "Database migrations completed"\n\
npm run dev' > /src/start.sh

RUN chmod +x /src/start.sh

EXPOSE 3000

ENTRYPOINT ["/src/start.sh"]