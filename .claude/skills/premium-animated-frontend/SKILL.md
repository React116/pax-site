---
name: premium-animated-frontend
description: Mevcut React/Vite/Tailwind web uygulamasını ciddi, premium, modern, akıcı ve profesyonel animasyonlarla geliştirmek için kullanılır. Landing page, SaaS dashboard, ajans sitesi, hero section, scroll animation, micro interaction, premium UI ve visual polish isteklerinde kullan.
---

# Premium Animated Frontend Skill

Bu projede amaç gösterişli ama ucuz görünen animasyonlar yapmak değil; ciddi, premium, kurumsal ve güven veren bir web deneyimi oluşturmaktır.

## Genel Tasarım Hedefi

- Modern SaaS / AI automation company hissi ver.
- Ciddi, minimal, keskin ve premium görünüm üret.
- Gereksiz renk kalabalığı kullanma.
- Büyük tipografi, geniş boşluk, net grid yapısı ve güçlü CTA kullan.
- Animasyonlar kullanıcıyı yormamalı, ürünü daha pahalı ve kaliteli göstermeli.
- “Wow effect” olsun ama site oyun gibi görünmesin.

## Animasyon Tarzı

Kullanılabilecek animasyonlar:

- Hero section fade-in + slide-up
- Staggered text reveal
- Card hover lift
- Subtle glow effect
- Scroll reveal sections
- Smooth page transitions
- Magnetic button hissi
- Soft gradient movement
- Background grid / particles çok hafif kullanılabilir
- Dashboard preview için floating animation
- Feature cards için delay-based entrance animation
- CTA alanlarında dikkat çekici ama kontrollü motion

Kaçınılması gerekenler:

- Aşırı zıplayan animasyonlar
- Çok hızlı hareketler
- Her elementin aynı anda hareket etmesi
- Neon/cyberpunk abartısı
- Çocukça ikon animasyonları
- Performansı düşüren gereksiz 3D/WebGL kullanımı
- Sayfa okunabilirliğini bozan efektler

## Teknik Tercihler

Öncelik sırası:

1. Framer Motion
2. CSS transitions
3. Tailwind animation utilities
4. GSAP sadece karmaşık scroll animasyonları gerekiyorsa
5. Three.js / React Three Fiber sadece kullanıcı özellikle 3D isterse

## React Kuralları

- Mevcut component yapısını bozma.
- Önce mevcut sayfayı analiz et.
- Büyük refactor yapma.
- Animasyonları küçük componentler halinde ekle.
- Her section için ayrı motion wrapper kullanılabilir.
- Reusable animation variants oluştur.
- Kod okunabilir ve sürdürülebilir olmalı.

## Tailwind UI Kuralları

- Premium spacing kullan: py-20, py-24, px-6, max-w-7xl gibi.
- Kartlarda rounded-2xl, soft shadow, border, backdrop blur kontrollü kullanılabilir.
- Gradient background kullanılabilir ama abartılmamalı.
- CTA butonları net, kontrastlı ve güçlü olmalı.
- Mobil responsive görünüm korunmalı.

## Performans Kuralları

- Animasyonlar 60fps hissi vermeli.
- Transform ve opacity animasyonları tercih edilmeli.
- Layout shift yaratacak width/height animasyonlarından kaçın.
- Ağır animasyonları lazy load et.
- prefers-reduced-motion desteğini düşün.
- Mobilde animasyonlar daha hafif olmalı.

## Çalışma Şekli

Bir sayfayı animasyonlu hale getirmeden önce:
1. Mevcut dosyayı analiz et.
2. Hangi componentlere animasyon ekleneceğini listele.
3. Mevcut tasarımı bozmadan iyileştirme planı sun.
4. Sonra minimum ama etkili değişiklik yap.

## Hedef Görünüm

Site şunu hissettirmeli:
- Premium
- Güvenilir
- Teknolojik
- Kurumsal
- AI destekli
- Modern
- Hızlı
- Dönüşüm odaklı