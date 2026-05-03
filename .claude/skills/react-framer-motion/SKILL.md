---
name: react-framer-motion
description: React/Vite projelerinde Framer Motion kullanarak profesyonel animasyonlar, scroll reveal, hover effects, page transitions ve staggered UI motion eklemek için kullanılır.
---

# React Framer Motion Skill

Bu projede Framer Motion, premium ve kontrollü animasyonlar için ana animasyon kütüphanesidir.

## Kullanım Kuralları

- Önce framer-motion package kurulu mu kontrol et.
- Kurulu değilse kurulum komutu öner.
- Mevcut component yapısını bozmadan motion ekle.
- Animasyonlar transform ve opacity ağırlıklı olmalı.
- Gereksiz karmaşık animation logic yazma.

## Standart Animation Variants

Genel reveal animasyonu:

```js
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
}