  FROM node:20 AS deps
  WORKDIR /app
  COPY package.json package-lock.json ./
  ENV HUSKY=0
  RUN npm ci
  
  FROM node:20 AS builder
  WORKDIR /app
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .
  
  RUN npx prisma generate
  
  RUN npm run build
  
  FROM node:20 AS runner
  ENV NODE_ENV=production
  WORKDIR /app
  
  COPY package.json package-lock.json ./
  ENV HUSKY=0
  RUN npm ci --omit=dev && npm cache clean --force
  
  COPY --from=builder /app/dist ./dist
  COPY --from=builder /app/prisma ./prisma
  
  COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
  
  EXPOSE 8000
  
  CMD ["sh","-c","npx prisma migrate deploy && node dist/server.js"]