---
title: "Feature Description: kompyuter ko'radigan belgilar tili"
date: 2026-01-06
categories:
  - Tutorial
tags: [computer vision, feature extraction, SIFT, SURF, image processing]
excerpt: "Feature va descriptor nima, ular qanday saqlanadi va yaxshi descriptor nimasi bilan yaxshi? SIFT va SURF algoritmlarini solishtiramiz."
---

Tasavvur qiling, Computer Vision tizimi rasmga qaraydi, lekin “bu nima?” degan savolga javob berishi uchun unga ishonchli ishoralar kerak. Ana shu ishoralar: feature (xususiyatlar, atributlar). Model avval feature’larni o‘rganadi, keyin yangi rasmlarda ham shu belgilar orqali tanib oladi.

### 1) Feature’larni data structure’larda qanday saqlaymiz?
Feature’lar turlicha bo‘lishi mumkin: son, kategoriya, rasm, matn va hokazo. Ularni to‘g‘ri ko‘rinishda saqlash keyingi ishlov (processing) uchun juda muhim.

Numerical features (sonli feature’lar):
- Array/List: eng sodda ko‘rinish. Har bir element alohida feature.
- Tensor: ko‘p o‘lchovli massiv. Katta hajmdagi ma’lumotlar bilan ML framework’larda eng ko‘p ishlatiladi.

Categorical features (kategoriya feature’lar):
- Dictionary/List: kategoriyani label qilib saqlash (yoki to‘g‘ridan-to‘g‘ri qiymat sifatida).
- One-hot encoding: kategoriya uchun binary vektor, har bir bit alohida kategoriyani bildiradi.

Image features (rasm feature’lar):
- Pixel values: rasmni matritsa yoki multi-dimensional array sifatida saqlash.
- CNN features: pre-trained Convolutional Neural Network (CNN) orqali “tayyor” feature’larni ajratib olish.

### 2) Yaxshi descriptor nimasi bilan “yaxshi”?
Descriptor: rasm ichidagi obyekt yoki sahnaning muhim axborotini siqilgan, ammo mazmunli ko‘rinishda ifodalovchi feature to‘plami.

Yaxshi descriptor quyidagilarga ega bo‘ladi:
- Transformatsiyalarga invariant: rotation, translation, scaling, yoritish (illumination) o‘zgarsa ham “xulqini” yo‘qotmaydi.
- Distinctiveness: obyektni boshqasidan ajratib bera oladi.
- Dimensionality: juda katta bo‘lmasdan, yetarli axborotni saqlaydi.
- Locality: lokal nuqtalar yoki kichik regionlarni yaxshi tasvirlaydi.
- Repeatability: shovqin yoki kichik farqlar bo‘lsa ham bir xil obyekt uchun barqaror chiqadi.
- Matching algoritmlariga mos: masofa metric’lari yoki ML asosidagi matching bilan yaxshi ishlaydi.
- Computational efficiency: tez hisoblanadi, real-time uchun muhim.
- Adaptability: vaqt o‘tishi bilan data’ga moslasha olishi foydali.
- Noise robustness: shovqinda ham buzilib ketmaydi.

### 3) Feature descriptor’lar: SIFT va SURF
Bu yerda ikkita klassik “detektiv” bor: biri aniqlikni yaxshi ko‘radi (SIFT), biri tezlikni (SURF). Ikkalasi ham rasm ichidan keypoint topadi va ularni taqqoslash uchun descriptor yaratadi.

#### SIFT (Scale-Invariant Feature Transform)
SIFT rasmda turli scale’larda barqaror keypoint’larni topib, har biri uchun descriptor beradi.

Ishlash bosqichlari:
- Scale Space Extrema detection: Difference of Gaussian (DoG) orqali ko‘p scale’da max/min nuqtalarni topadi.
- Keypoint Localization: sub-pixel aniqlikda joylashuvni aniqlaydi, past kontrast va edge’ga yaqin noto‘g‘ri keypoint’larni chiqarib tashlaydi.
- Orientation Assignment: lokal gradient’lardan dominant yo‘nalish topadi, shu bilan rotation’ga invariant bo‘ladi.
- Descriptor Generation: keypoint atrofidagi gradient axborotidan descriptor hosil qiladi.
- Descriptor Matching: ikki rasm orasida mos keypoint’larni topish uchun descriptor’lar taqqoslanadi.

Qo‘llanishlar: object recognition, image stitching, 3D reconstruction.

SIFT linklar:
- https://docs.opencv.org/4.x/da/df5/tutorial_py_sift_intro.html
- https://www.educative.io/answers/what-is-sift
- https://www.cse.iitb.ac.in/~ajitvr/CS763/SIFT.pdf

#### SURF (Speeded Up Robust Features)
SURF ham lokal feature topadi, lekin tezlik uchun optimizatsiya qilingan. Bu tezlikda uning asosiy “quroli”: integral image va Haar wavelet’lar.

Ishlash bosqichlari:
- Integral images: to‘rtburchak sohalar yig‘indisini juda tez hisoblashga yordam beradi.
- Blob detection: Hessian matrix orqali intensity o‘zgarishi kuchli bo‘lgan “blob” regionlarni topadi.
- Scale selection: turli scale’da Hessian determinant’ini tekshirib barqaror keypoint’larni tanlaydi.
- Orientation assignment: keypoint atrofida Haar wavelet response’lar bilan dominant yo‘nalishni belgilaydi.
- Descriptor matching: hosil bo‘lgan feature vector’lar orqali keypoint’larni moslaydi.

Kuchli tomonlari: scale, rotation, illumination o‘zgarishlariga robust bo‘lishi va real-time’ga yaqin ishlashga mosligi.

SURF linklar:
- https://docs.opencv.org/3.4/df/dd2/tutorial_py_surf_intro.html
- https://www.ijtra.com/view/feature-extraction-using-surf-algorithm-for-object-recognition.pdf

Yakuniy takeaway:
Feature va descriptor: modelning “ko‘rish lug‘ati”. Qanchalik lug‘at aniq va barqaror bo‘lsa, tanib olish va matching shunchalik ishonchli bo‘ladi. SIFT ko‘proq robust va aniqlik tarafdori, SURF esa tezlik va samaradorlikka urg‘u beradi.
