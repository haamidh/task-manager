FROM node:24-slim

WORKDIR /app

# Install dependencies first so this layer is cached until package files change.
COPY package*.json ./
RUN npm ci

COPY . .

# NEXT_PUBLIC_ variables are compiled into the browser bundle, so the API URL
# has to be known at build time. It is the URL the *browser* uses to reach
# the API, not a container-to-container address.
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
