---
name: frontend-performance-guard
description: Animasyon, UI geliştirme, landing page ve dashboard düzenlemelerinde performansı, mobil uyumu, accessibility ve production güvenliğini korumak için kullanılır.
---

# Frontend Performance Guard Skill

Bu projede görsel kalite artırılırken performans bozulmamalıdır.

## Temel Kurallar

- Mevcut çalışan yapıyı bozma.
- Gereksiz dependency ekleme.
- Büyük görsel, video veya 3D efekt eklemeden önce uyar.
- Animasyonlarda opacity ve transform tercih et.
- width, height, top, left gibi layout tetikleyen animasyonlardan kaçın.
- Mobilde animasyonları daha hafif tut.
- Lazy loading kullan.
- CLS, LCP ve TBT gibi metrikleri kötüleştirecek değişikliklerden kaçın.

## Accessibility

- prefers-reduced-motion desteği düşün.
- Metin kontrastını koru.
- CTA butonları net görünmeli.
- Animasyon bilgiye erişimi engellememeli.
- Klavye navigasyonunu bozma.

## Kod Kalitesi

- Tek dosyaya dev component yazma.
- Tekrar eden animasyonları reusable variant yap.
- Gereksiz inline style kullanma.
- Tailwind class yapısını temiz tut.
- Responsive breakpointleri koru.

## Kontrol Listesi

Her değişiklikten sonra şunları raporla:

- Hangi dosyalar değişti?
- Hangi animasyonlar eklendi?
- Mobilde risk var mı?
- Performans riski var mı?
- Test etmek için hangi sayfaya bakılmalı?