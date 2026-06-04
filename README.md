# Jira Bulk Planner — Chrome Extension

Jira issue'larını Excel veya CSV dosyasından toplu olarak güncelleyen Chrome Extension.

## Özellikler

- CSV ve XLSX dosya desteği
- Toplu Assignee, Story Points ve Planned Week Day güncelleme
- Dry Run modu — Jira'ya dokunmadan önizleme
- Validasyon raporu — geçerli/geçersiz satır özeti
- Execution raporu — güncellendi/başarısız özeti
- Jira Server / Data Center desteği (Personal Access Token)

---

## Kurulum (Ekip için)

### Gereksinimler
- Google Chrome tarayıcı

### Adımlar

1. En son `jira-bulk-planner-vX.X.X.zip` dosyasını indir
2. Zip'i bir klasöre çıkart
3. Chrome'da adres çubuğuna `chrome://extensions` yaz ve Enter'a bas
4. Sağ üst köşede **Developer mode** toggle'ını aç
5. **Load unpacked** butonuna tıkla
6. Zip'ten çıkarttığın klasörü seç
7. Extension listesinde **Jira Bulk Planner** görünür
8. Araç çubuğundaki puzzle ikonundan (🧩) extension'ı sabitle

---

## İlk Kurulum — Jira Ayarları

Extension'ı ilk açtığında Ayarlar sayfası gelir:

| Alan | Açıklama | Örnek |
|------|----------|-------|
| Jira Base URL | Jira sunucunuzun adresi | `https://jira.logo.com.tr` |
| Email | Jira hesabınızın emaili (opsiyonel) | `ad.soyad@logo.com.tr` |
| API Token / PAT | Personal Access Token | `NjY...` |

### Personal Access Token nasıl alınır?

1. Jira'ya giriş yap
2. Sağ üst köşede profil resmine tıkla
3. **Profile** → **Personal Access Tokens**
4. **Create token** tıkla
5. Token adı: `jira-bulk-planner`
6. Token'ı kopyala — **bir daha göremezsin**

---

## Kullanım

### 1. Dosya Hazırla

Excel veya CSV dosyası oluştur. Kolon isimleri büyük/küçük harf duyarsızdır:

| Issue Key | Assignee Email | Story Points | Planned Week Day |
|-----------|---------------|--------------|-----------------|
| PROJ-123 | ali@logo.com.tr | 5 | W24 |
| PROJ-124 | ayse@logo.com.tr | 8 | W25 |
| PROJ-125 | mehmet@logo.com.tr | 3 | W26 |

### 2. Dosyayı Yükle

- Extension'ı aç
- Dosyayı sürükle & bırak veya tıklayarak seç
- Önizleme tablosunda satırları kontrol et

### 3. Doğrula

- **Dry Run açık** → Sadece format kontrolü (Jira'ya bağlanmaz)
- **Dry Run kapalı** → Jira'ya bağlanır, issue ve kullanıcı varlığını kontrol eder
- Doğrulama raporunu incele

### 4. Güncelle

- **Güncelle** butonuna tıkla
- İlerleme çubuğunu izle
- Sonuç raporunu gör

---

## Güncellenen Jira Alanları

| Alan | Jira Field ID |
|------|--------------|
| Assignee | `assignee.accountId` |
| Story Points | `customfield_10016` |
| Planned Week Day | `customfield_16163` |

> Field ID'leri değiştirmek için `src/constants/index.ts` dosyasını düzenle.

---

## Geliştirici Kurulumu

### Gereksinimler
- Node.js v18+
- npm

### Kurulum

```bash
git clone https://github.com/kullanici/jira-planner-ext.git
cd jira-planner-ext
npm install
```

### Geliştirme

```bash
npm run dev        # Geliştirme sunucusu (localhost:5173)
npm run build      # Production build
npm run build:zip  # Build + zip oluştur
```

### Klasör Yapısı
src/
├── popup/
│   ├── components/     # Paylaşılan bileşenler
│   └── pages/          # Sayfa bileşenleri
├── services/
│   ├── fileParser.ts   # CSV/XLSX parse
│   ├── jiraService.ts  # Jira REST API
│   ├── validator.ts    # Validasyon
│   └── updater.ts      # Toplu güncelleme
├── storage/            # Chrome Storage katmanı
├── types/              # TypeScript tipleri
├── constants/          # Sabitler (field ID'leri)
└── utils/              # Yardımcı fonksiyonlar

---

## Sık Karşılaşılan Sorunlar

**"Bağlantı kurulamadı" hatası**
- Base URL sonunda `/` olmamalı: ✅ `https://jira.logo.com.tr` ❌ `https://jira.logo.com.tr/`
- Token'ın süresi dolmuş olabilir, yeni token al
- VPN bağlantını kontrol et

**"Issue bulunamadı" hatası**
- Issue key büyük harf olmalı: ✅ `PROJ-123` ❌ `proj-123`
- O issue'ya erişim yetkin olduğundan emin ol

**"Kullanıcı bulunamadı" hatası**
- Email adresi Jira'daki ile birebir aynı olmalı
- Kullanıcının aktif Jira hesabı olduğundan emin ol

**Büyük dosyalarda yavaşlık**
- 100+ satır için birkaç dakika sürebilir
- Jira API rate limit'e takılabilir, bu normal

---

## Versiyon Geçmişi

### v1.0.0
- İlk sürüm
- CSV ve XLSX desteği
- Dry Run modu
- Jira Server / Data Center desteği

---

## Lisans

MIT