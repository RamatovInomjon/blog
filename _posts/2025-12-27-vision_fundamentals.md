---
title: "Computer vision, mashinalarga ko‘rishni o‘rgatish haqida."
author: "Inomjon Ramatov"
date: 2025-12-27
tags: [computer-vision, AI, machine-learning, ko‘rish, texnologiya, fundamentals]
site_url: https://inomjonramatov.uz/
excerpt: "Kompyuterga ko‘rishni o‘rgatish, unga fikrlashni o‘rgatishda birinchi qadamdir. "
---

# Vision

Ko'pchiligimiz Quyosh nuri Yerdagi hayotni saqlab turishini bilamiz. Ammo bu nur bizning hayotimizni qanday shakllantirganini o'ylab ko'rganmisiz? Deyarli barcha tirik mavjudotlar quyoshni qandaydir yo'l bilan his qiladi (hatto ba'zi bakteriyalar va bir hujayrali organizmlar ham). Insonlar ham shu qobiliyatga ega, lekin bizda yorug‘lik bilan o‘zaro aloqada bo‘lishning ancha murakkab tizimi mavjud.

Ko‘zimizdagi linza yorug‘likni ushlab oladi va uni elektr signaliga aylantiradi. Bu signal nerv tizimi orqali uzatiladi va miyamizda qayta ishlanib, atrofdagi manzarani tasavvur qilish imkonini beradi.

Bu jarayon **ko‘rish**, ya’ni **vision** deb ataladi. Bu inson evolyutsiyasining eng muhim bosqichlaridan biri. Olimlarning taxminicha, markazlashgan nerv tizimining paydo bo‘lishi (keyinchalik miyamizning kattalashishiga olib kelgan) aynan ko‘rish qobiliyati rivojlanishi bilan bog‘liq. Chunki agar tashqi ma’lumotlarni sezadigan sensorlar bo‘lmasa, ularga ishlov beruvchi tizimni yaratish uchun resurs sarflashning foydasi bo‘lmaydi.

## Ko‘rishning inson hayotidagi ahamiyati

To‘p tepganingizni tasavvur qiling. Sizning miyangiz shu bir lahzada juda ko‘p jarayonlarni avtomatik bajaradi: to‘pni aniqlaydi, harakatini kuzatadi, yo‘nalishini taxmin qiladi, tezligini hisoblaydi, oyog‘ingiz harakatini muvofiqlashtiradi va signal yuboradi. Shu signal tufayli oyoq zarba beradi.

Tasvirni (ko‘z retinasidan olingan signalni) kiruvchi ma’lumot sifatida qabul qilib, uni ma’noga ega harakatga aylantirish **kompyuter ko‘rishining (computer vision)** asosidir.

Qiziq tomoni — biz bularning birortasini o‘qib o‘rganmaganmiz. Hech kim "To‘pni qanday tepish" degan darsga qatnashmagan. Biz bu narsani bolalikdagi tajriba orqali o‘rganganmiz. Dasturlar esa, asosan, **qoidalar asosida ishlaydi**.

Endi miyamizning birinchi vazifasini, to‘pni aniqlashni, dasturiy tarzda takrorlashni tasavvur qilaylik. To‘p nima ekanini aniqlash va uni tasvirdan izlash kerak. Ammo bu oson emas: to‘pning o‘lchami turlicha bo‘lishi mumkin, shakli ham doimo mukammal sfera emas. Har bir sfera esa to‘p emas — shishalar, konfetlar yoki hatto Yer sayyorasi ham shunday bo‘lishi mumkin.

## Sof dasturlash yondashuvi va mashinaviy o‘rganish yondashuvi

Keling, "to‘p — bu sport yoki o‘yinda ishlatiladigan sfera shaklidagi obyekt" deb aniqlaymiz. To‘g‘riga o‘xshaydi, lekin bu ham yetarli emas. Ular sport o‘ynayotganini qanday bilamiz? Balki bu itning to‘pi? Balki odamlar yo‘q? Balki u shunchaki yerda yotgan to‘p? Yoki badmintonning **shuttlecock**ini olaylik u bilan o‘ynaymiz, lekin uni to‘p demaymiz.
Biz bularni o‘zimiz farqlay olamiz, lekin kompyuter uchun bu juda murakkab. Chunki bizda yillar davomida to‘plangan vizual tajriba — **mental model** mavjud. Masalan, tukli yoki kichik obyektni ko‘rsak ham, "bu to‘p" yoki " to‘p emas" deb tezda ajratamiz.

Bu inson miyasining **kontekstni tushunish** va **umumlashtirish** qobiliyatidan dalolat beradi. Dasturlarda esa bu tabiiy emas. Qoidaga asoslangan tizimlar bunday moslashuvchanlikka ega emas.

Shuning uchun bizga yangi turdagi tizimlar kerak — **moslashuvchan**, **kontekstni anglay oladigan**, **o‘rganishga qodir** tizimlar. Shuning uchun ham **computer vision** sun’iy intellekt bilan chambarchas bog‘liq.

Masalan, Indiana Jonesning orqasidan katta tosh dumalab kelayotgan sahnani oling. To‘p bor, yugurish bor lekin bu sport emasligini biz darhol bilamiz. Chunki kontekst bor: tosh juda katta, muhit g‘or, yuzdagi vahima, kiyim sport formasiga o‘xshamaydi. Bularning barchasi **kontekst belgilaridir**.

## Inson ko‘rishini va tafakkurini sun’iy tizimlarda modellashtirish motivatsiyasi

Inson ko‘rishi va kompyuter ko‘rishi o‘xshash natija beradi, lekin jarayonlari boshqacha. Kompyuter ko‘rishi — tasvirlarni tahlil qilish va ularning mazmuniga qarab qaror chiqaruvchi **algoritmlar va modellar**ni ishlab chiqish sohasi. Uning maqsadi inson ko‘rishini aynan takrorlash emas. Balki inson uchun **mashaqqatli, sekin, qimmat yoki xatolarga moyil** vazifalarni avtomatlashtirish.

To‘pni kuzatish modeli unchalik foydali ko‘rinmasligi mumkin, ammo u sport translatsiyalarida **tez va adolatli qarorlar** chiqarishga yordam beradi. Yoki, **image-to-text** va **text-to-speech** texnologiyalari bilan birgalikda, ko‘zi ojiz insonlar uchun o‘yin jarayonini ovoz orqali tasvirlab beruvchi tizim yaratish mumkin.

Shunday qilib, hatto oddiy obyektni aniqlash modeli ham **ijtimoiy foydali** bo‘lishi mumkin.

Bugun biz **AI inqilobi** davrida yashayapmiz. Endi modellardan faqat obyekt aniqlash emas, balki **matndan tasvir generatsiyasi** va **tasvirdan matn yaratish** uchun ham foydalanish mumkin. Hatto bu ishlarni smartfon orqali qilish mumkin.

**Computer vision** endi faqat ko‘rish bilan cheklanmaydi — u yaratuvchanlikni ham o‘z ichiga olgan soha. Chegaralar kengaydi, imkoniyatlar bizning qo‘limizda.

**Computer vision olamiga xush kelibsiz.** 
Stay tuned, oldinda ajoyib sayohat kutmoqda 🚀

