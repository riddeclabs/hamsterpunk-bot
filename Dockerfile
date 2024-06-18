FROM oven/bun:1-alpine
WORKDIR /app

COPY bun.lockb package.json ./
COPY crash-bot ./crash-bot

WORKDIR /app/crash-bot
RUN bun install --production --frozen-lockfile

CMD ["bun", "serve"]