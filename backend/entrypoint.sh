#!/bin/sh

echo "Aguardando banco..."
sleep 10

if ! grep -q "JWT_SECRET=" .env || grep -q "JWT_SECRET=$" .env; then
  echo "Gerando JWT_SECRET..."
  php artisan jwt:secret --force
else
  echo "JWT_SECRET já existe."
fi

echo "Rodando migrations..."
php artisan migrate --force

echo "Rodando seeders..."
php artisan db:seed --force

echo "Iniciando servidor..."
php artisan serve --host=0.0.0.0 --port=8000
