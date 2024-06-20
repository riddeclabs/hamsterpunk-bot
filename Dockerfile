FROM oven/bun:1-alpine
WORKDIR /app

COPY bun.lockb package.json ./
RUN bun install --production --frozen-lockfile

COPY . .

CMD ["bun", "serve"]
