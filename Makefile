# Makefile

.PHONY: start stop restart logs

start:
	@echo "Starting dev environment..."
	docker-compose up --build

stop:
	@echo "Stopping dev environment..."
	docker-compose down

restart: stop start

logs:
	docker-compose logs -f
