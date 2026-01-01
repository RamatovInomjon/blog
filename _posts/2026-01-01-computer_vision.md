---
title: "Computer Vision nima?"
date: 2026-01-01
tags: [computer vision, tutorial]
site_url: https://inomjonramatov.uz/
categories:
  - Tutorial
excerpt: "Computer Vision nima, u qanday vazifalarni bajaradi va nega deep learning bu sohaga renessans olib keldi? Ushbu postda image understanding darajalari, asosiy CV tasklar va amaliy qo'llanmalardagi muhim etik nuqtalar haqida tushunarli, texnik izoh beriladi."
mathjax: true
---


Oldingi bobdagi misolimizga qaytaylik: to'p tepish. Ko'rganimizdek, bu jarayon miyamiz bir lahzada bajara oladigan bir nechta vazifalardan iborat. Tasvirdan (image input) mazmunli axborotni ajratib olish Computer Vision (kompyuter ko'rish)ning markazida turadi. Ammo Computer Vision aslida nima?

## Ta'rif

Computer Vision bu mashinalarni ko'ra oladigan qilish ilmi va texnologiyasidir. U vizual ma'lumotlarni olish, qayta ishlash, tahlil qilish va tushunish uchun nazariy hamda algoritmik usullarni ishlab chiqishni, shuningdek shu axborotdan dunyo haqida mazmunli reprezentatsiyalar, tavsiflar va talqinlar (interpretation) hosil qilishni o'z ichiga oladi (*Forsyth & Ponce, Computer Vision: A Modern Approach*).


![Computer vision nima](https://huggingface.co/datasets/hf-vision/course-assets/resolve/743a2a115b53f258c9e6bc7744534d9e03b8a124/CV_in_defintiion.png)


## Deep Learning va Computer Vision renessansi

Computer Vision evolyutsiyasi fanlararo yo'nalishlar ichida va ular kesishgan nuqtalarda ketma-ket, bosqichma-bosqich yutuqlar bilan belgilangan. Har bir keyingi qadam yangi algoritmlar, apparat imkoniyatlari va ma'lumotlar (data)dagi sakrashlarni yuzaga chiqargan, natijada soha yanada kuchli va moslashuvchan bo'lib borgan. Shunday sakrashlardan biri deep learning usullarining ommaviy qo'llanilishiga o'tish bo'ldi.

Dastlab tasvirdan axborot ajratib olish va o'rganish uchun, avvalo, image preprocessing (tasvirni oldindan qayta ishlash) texnikalari orqali xususiyatlar (features) chiqarib olinadi (Pre-processing for Computer Vision Tasks). Tasvirni tavsiflaydigan xususiyatlar to'plami tayyor bo'lgach, shu xususiyatlar datasetiga klassik machine learning algoritmi qo'llanadi. Bu yondashuv qattiq kodlangan qoidalar (hard-coded rules)ga qaraganda ancha soddaroq, lekin baribir soha bilimiga (domain knowledge) va puxta feature engineeringga kuchli tayangan holda ishlaydi. Zamonaviyroq yondashuv esa deep learning va yirik datasetlar uchrashgan joyda paydo bo'ladi. Deep Learning (DL) mashinalarga xom ma'lumot (raw data)dan murakkab xususiyatlarni avtomatik o'rganish imkonini beradi. Ana shu paradigmadagi o'zgarish (paradigm shift) yanada moslashuvchan va murakkab modellarni qurishga yo'l ochdi va sohada renessansni boshlab berdi.

Computer Vision urug'lari deep learning modellari ko'tarilishidan ancha oldin, 1960-yillarda sepilgan. David Marr va Hans Moravec kabi pionerlar fundamental savol bilan kurashgan: mashinalarni ko'ra oladigan qila olamizmi? Chegaralarni aniqlash (edge detection) algoritmlari, obyektni tanish (object recognition) kabi ilk yutuqlar zukkolik va "brute-force" yondashuv aralashmasi bilan erishilgan va bu, rivojlanayotgan Computer Vision tizimlari uchun poydevor bo'lib xizmat qilgan. Vaqt o'tishi bilan tadqiqotlar, ishlanmalar va apparat imkoniyatlari rivojlangani sayin, Computer Vision hamjamiyati keskin kengaydi. Bugun bu jonli hamjamiyat butun dunyo bo'ylab turli sohalardan kelgan tadqiqotchilar, muhandislar, data scientistlar va ishtiyoqli havaskorlardan iborat. Open-source va community-driven loyihalar tufayli ilg'or vositalar hamda texnologiyalarga kirish imkoniyati demokratlashmoqda, bu esa sohada yana bir renessansni tezlashtiryapti.

## Boshqa sohalar bilan fanlararo bog'liqlik va tasvirni tushunish

Sun'iy intellekt (Artificial Intelligence) bilan Computer Vision o'rtasida aniq chiziq tortish qiyin bo'lgani kabi, Computer Visionni unga qo'shni yo'nalishlardan ham ajratish oson emas. Masalan, image preprocessing va analysis (tasvirni oldindan qayta ishlash va tahlil)ni olaylik. Vaqtinchalik, taxminiy ajratish shundan iboratki, image analysisda kirish ham, chiqish ham doim tasvir bo'ladi. Biroq bu qarash tor doiradagi yondashuv. Hatto sodda vazifalar, masalan tasvirning o'rtacha (medium) qiymatini hisoblash ham Computer Vision doirasiga kirishi mumkin. Farqlarni aniqroq tushuntirish uchun "image understanding" (tasvirni tushunish) degan yangi tushunchani kiritamiz.

Image understanding bu tasvir tarkibining mazmunini anglash jarayoni. Uni uch darajada ta'riflash mumkin:

**Past darajadagi jarayonlar (low-level processes)** tasvir ustida ibtidoiy amallar (masalan, tasvirni o'tkirlash, kontrastni o'zgartirish). Kirish ham, chiqish ham tasvir bo'ladi.

**O'rta darajadagi jarayonlar (mid-level processes)** segmentatsiya, obyektlarni tavsiflash, obyekt klassifikatsiyasini o'z ichiga oladi. Axborot tasvirdan keladi, lekin natija tasvirga bog'langan atributlar ko'rinishida bo'ladi. Buni image preprocessing va ML algoritmlarining kombinatsiyasi bilan bajarish mumkin.

**Yuqori darajadagi jarayonlar (high-level processes)** tasvirning butun mazmunini anglash bilan bog'liq: ma'lum obyektni tanish, sahnani rekonstruksiya qilish (scene reconstruction), image-to-text. Odatda bular inson kognitsiyasi bilan bog'liq vazifalar sifatida qaraladi.

Image analysis asosan past va o'rta darajadagi jarayonlar bilan shug'ullanadi. Computer Vision esa o'rta va yuqori darajadagi jarayonlarga ko'proq qiziqadi. Shuning uchun image analysis va Computer Vision o'rtasida o'rta darajadagi jarayonlar bo'yicha kesishuv mavjud.

Buni eslab qolish muhim, chunki data kam bo'lgan (data-poor) holatlarda yoki sodda tasvirlar uchun murakkab model (masalan, neural network) ishlab chiqishga resurs ajratish doim ham to'g'ri bo'lmasligi mumkin. Biznes nuqtayi nazaridan model ishlab chiqish vaqt va pul talab qiladi, shuning uchun qaysi vaziyatda qaysi vositani ishlatishni bilish zarur.

Ko'pincha kuchliroq modelga o'tishdan oldin "preprocessing" qatlamini qo'shib ishlash odatiy hol.
Boshqa tomondan, ba'zan neural network qatlamlari bunday ishlarni o'zi avtomatik bajaradi va explicit preprocessingga ehtiyoj qolmaydi. Image analysis data sciencega yaqin bo'lganlar uchun exploratory data analysisning birinchi qadami sifatida ham ishlashi mumkin. Yana, klassik image analysis usullari Computer Vision modellari uchun training data sifatini va xilma-xilligini oshirish maqsadida data augmentationda ham qo'llanadi.

## Computer Vision vazifalari bo'yicha umumiy ko'rinish

Avval ham ko'rganimizdek, Computer Vision kompyuterlar uchun juda qiyin, chunki ular dunyo haqida oldindan shakllangan bilimga ega emas. Bizning misolda esa biz avvaldan to'p nima ekanini bilamiz, uning harakatini kuzatishni, obyektlar odatda fazoda qanday harakatlanishini, to'p qachon bizga yetib kelishini taxminlashni, oyog'ingiz qayerdaligini, oyoq qanday harakatlanishini va to'pni tepish uchun qancha kuch kerakligini baholashni bilamiz. Buni aniq Computer Vision vazifalariga ajratsak, quyidagilar chiqadi:
  - Scene Recognition
  - Object Recognition
  - Object Detection
  - Segmentation (instance, semantic)
  - Tracking
  - Dynamic Environment Adaptation
  - Path Planning

Computer Visionning asosiy vazifalari haqida siz Computer Vision Tasks bobida ko'proq o'qiysiz. Lekin Computer Vision bajara oladigan ishlar bundan ancha ko'p. Quyida to'liq bo'lmagan ro'yxat:
  - Image Captioning
  - Image Classification
  - Image Description
  - Anomaly Detection
  - Image Generation
  - Image Restoration
  - Autonomous Exploration
  - Localization

## Vazifa murakkabligi

Image analysis va Computer Vision doirasida ma'lum bir vazifaning murakkabligi faqatgina vazifa qanchalik "ulug'vor" yoki bilimli auditoriyaga qanchalik qiyin tuyulishiga bog'liq emas. Asosiy omil, ko'pincha tahlil qilinayotgan tasvir yoki ma'lumotning xususiyatlaridir. Masalan, tasvirdan piyodani aniqlash vazifasini olaylik. Inson uchun bu ko'pincha sodda ko'rinadi, chunki biz odamlarni tez tanib olamiz. Lekin hisoblash nuqtayi nazaridan bu vazifaning murakkabligi yoritish sharoiti, obyektning to'silib qolishi (occlusion), tasvir rezolyutsiyasi va kamera sifati kabi omillarga qarab keskin o'zgaradi. Yorug'lik past bo'lgan holatlarda yoki piksellashgan tasvirlarda, hatto "oddiy" tuyuladigan piyoda aniqlash ham Computer Vision algoritmlari uchun juda murakkablashib ketishi mumkin va buning uchun ilg'or image enhancement hamda machine learning texnikalari talab etiladi. Demak, image analysis va Computer Visiondagi haqiqiy qiyinchilik ko'pincha vazifaning "sha'ni"da emas, balki vizual ma'lumotning nozik tafsilotlari va undan mazmunli xulosa chiqarish uchun kerak bo'ladigan hisoblash usullarida yotadi.

## Computer Vision ilovalari bilan bog'lanish

Computer Vision jamiyatdagi ahamiyatini tobora oshirib boryapti. Uning qo'llanilishida ko'plab etik masalalar mavjud. Masalan, saratonni aniqlash uchun deploy qilingan model saraton namunani sog'lom deb klassifikatsiya qilsa, oqibatlari juda og'ir bo'lishi mumkin. Kuzatuv (surveillance) texnologiyalari, masalan odamlarni kuzata oladigan tracking modellari ham maxfiylik (privacy) bo'yicha jiddiy xavotirlarni keltirib chiqaradi. Bu mavzu "Unit 12 - Ethics and Biases"da batafsil muhokama qilinadi. Shuningdek, "Applications of Computer Vision" bo'limida sohaning qiziqarli qo'llanilishlariga ham qisqacha kirish qilamiz.
