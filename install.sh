#!/bin/bash
# Run this command to install the project
echo "Instalando dependencias do backend..."
cd backend
composer install
php artisan key:generate
php artisan jwt:secret
php artisan migrate
php artisan storage:link
php artisan db:seed
cd ..
echo "Instalando dependencias do frontend..."
cd frontend
npm install
cd ..
echo "Instalação bem sucedida."