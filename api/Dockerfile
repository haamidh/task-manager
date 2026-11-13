FROM node:24-slim

WORKDIR /app

# Install dependencies first so this layer is cached until package files change.
COPY package*.json ./
RUN npm ci

COPY . .

# The SQLite file lives in /data, which docker-compose mounts as a volume
# so tasks survive container restarts.
ENV DATABASE_URL="file:/data/tasks.db"
ENV PORT=3001

RUN npx prisma generate && npm run build

EXPOSE 3001

# Apply any pending migrations, then start the API.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
