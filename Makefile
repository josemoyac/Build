.PHONY: dev-up dev-down lint test seed openapi build

PNPM=pnpm

setup:
$(PNPM) install

dev-up:
docker-compose up --build

dev-down:
docker-compose down -v

lint:
$(PNPM) lint

test:
docker-compose run --rm api pnpm test && docker-compose run --rm web pnpm test

seed:
docker-compose run --rm api pnpm prisma db seed

openapi:
cd apps/api && pnpm generate:openapi

build:
$(PNPM) build
