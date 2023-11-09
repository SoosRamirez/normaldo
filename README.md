# AuthBack

Авторизация пользователей

## Функциональность

### Регистрация
```
POST http://127.0.0.1:3000/auth/signup
body {
    "username": "admin",
    "password": "adminadmin"
}
```
### Авторизация
```
POST http://127.0.0.1:3000/auth/login
body {
    "username": "admin",
    "password": "adminadmin"
}
```
### Проверка
```
GET http://127.0.0.1:3000/auth/users
headers {
    "authorization": token, возвращенный при авторизации
}
```
