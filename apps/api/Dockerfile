FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml* ../../pnpm-workspace.yaml ./
RUN npm install -g pnpm
COPY ../../ ./
RUN pnpm install --frozen-lockfile
WORKDIR /app/apps/api
RUN pnpm build
CMD ["node", "dist/main.js"]
