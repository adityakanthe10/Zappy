# apps/docker/frontend.Dockerfile

FROM node:23.11.0-alpine3.20	



WORKDIR /app

COPY . .

WORKDIR /app/apps/frontend

RUN npm install
RUN npm run build

EXPOSE 3000

# Use Next.js built-in server
CMD ["npm", "start"]
