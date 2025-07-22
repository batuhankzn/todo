
## Kurulum

1. **Projeyi klonla:**
    ```bash
    git clone <repo-link>
    cd <proje-dizini>
    ```

2. **Bağımlılıkları yükle:**
    ```bash
    npm install
    ```

3. **.env dosyasını oluştur ve doldur:**
    ```
    MONGO_URI=mongodb://localhost:3000/todoapp
    JWT_SECRET=çokgizlibirsecret
    NODE_ENV=development
    ```

4. **Sunucuyu başlat:**
    ```bash
    npm start
    ```
    veya geliştirme için:
    ```bash
    npx nodemon app.js
    ```

## API Endpointleri

### Auth

- **POST /register**  
  Kullanıcı kaydı  
  ```json
  {
    "name": "Kullanıcı Adı",
    "email": "mail@example.com",
    "password": "parola"
  }
  ```

- **POST /login**  
  Giriş ve JWT token al  
  ```json
  {
    "email": "mail@example.com",
    "password": "parola"
  }
  ```
  Başarılı girişte:
  ```json
  {
    "message": "Giriş başarılı",
    "token": "JWT_TOKEN",
    "user": {
      "id": "...",
      "name": "...",
      "email": "..."
    }
  }
  ```

### Todo

Tüm todo endpointlerinde JWT token gereklidir.  
Token’ı `Authorization: Bearer <token>` header’ı ile veya cookie ile gönderebilirsin.

- **GET /get**  
  Kullanıcının tüm todo’larını getirir.

- **GET /get/:id**  
  Belirli bir todo’yu getirir (sadece sahibi erişebilir).

- **POST /create**  
  Yeni todo ekler.  
  ```json
  {
    "name": "Alışveriş",
    "description": "Süt ve ekmek al",
    "completed": false
  }
  ```

- **PATCH /update/:id**  
  Todo günceller (sadece sahibi).

- **DELETE /delete/:id**  
  Todo siler (sadece sahibi).

## Katkı ve Lisans

- Katkıda bulunmak için pull request gönderebilirsin.
- [MIT Lisansı](LICENSE)

---

Herhangi bir sorunda veya katkı yapmak istersen iletişime geçebilirsin!