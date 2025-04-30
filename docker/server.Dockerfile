FROM node:23.11.0-alpine3.20

WORKDIR /app
COPY . .

WORKDIR /app/apps/server
RUN npm install

WORKDIR /app/packages/db

RUN npx prisma generate
RUN npm run build

EXPOSE 8000
CMD ["node", "dist/index.js"]
