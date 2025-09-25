FROM node:latest

# Possibly examine what actually needs to be copied here
COPY . /src
WORKDIR /src

RUN npm install
RUN npx prisma generate

EXPOSE 3000

ENTRYPOINT ["npm", "run", "dev"]