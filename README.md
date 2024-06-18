# hamsterpunk-bot

```bash
bun dev
# or
bun serve
```

## Docker images

```bash
# Test build
docker build .. -f Dockerfile -t test

# Test run
docker run --rm -i --env-file .env -p 8040:8040 -t test
```
