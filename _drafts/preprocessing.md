---
title: "Computer Vision vazifalari uchun pre-processing"
date: 2026-01-03
categories:
  - Tutorial
tags: [computer vision, preprocessing, data augmentation, image processing]
excerpt: "Model qurishdan oldin tasvirlar ustida qanday amallar bajariladi? Raqamli tasvirni qayta ishlash amallari, filtrlar, morfologik operatsiyalar va data augmentation texnikalari haqida amaliy qo'llanma."
---

Endi biz tasvirlar (images) nima ekanini, ular qanday olinishi va ularning ta'siri qanday bo‘lishini ko‘rib chiqqanimizdan so‘ng, model qurish jarayonida qaysi amallarni bajarishimiz va ular qanday ishlatilishini tushunish vaqti keldi.

## Raqamli tasvirni qayta ishlashdagi amallar (Operations in Digital Image Processing)

Raqamli tasvirni qayta ishlash (digital image processing)da tasvirlar ustidagi amallar juda xilma-xil bo‘lib, ularni quyidagi toifalarga ajratish mumkin:

- Mantiqiy (Logical)
- Statistik (Statistical)
- Geometrik (Geometrical)
- Matematik (Mathematical)
- Transform amallari (Transform operations)

Har bir toifa ichida turli texnikalar mavjud. Masalan, mantiqiy amallar tarkibida morfologik amallar (morphological operations), transformlar tarkibida esa Fourier transformlari va Principal Component Analysis (PCA) kabi usullar bo‘ladi.

Bu kontekstda morfologiya deganda strukturaviy elementlar (structuring elements)dan foydalanib, pikselning qo‘shni atrofidagi qiymatlariga qarab, o‘sha tasvir bilan bir xil o‘lchamdagi yangi tasvir hosil qiladigan amallar guruhi nazarda tutiladi.

Tasvir bilan ishlashda element-wise va matrix amallar farqini tushunish muhim. Element-wise amallar, masalan tasvirni darajaga oshirish yoki uni boshqa tasvirga bo‘lish, har bir pikselni alohida qayta ishlashni anglatadi. Bu pikselga yo‘naltirilgan yondashuv matrix amallardan farq qiladi, chunki matrix amallar tasvirni manipulyatsiya qilishda matritsa nazariyasiga tayanadi. Qisqasi, tasvirlar bu raqamlardan iborat matritsa bo‘lgani uchun, ular bilan istagancha amallar bajarish mumkin.

## Tasvirni qayta ishlashdagi matematik vositalar (Mathematical Tools in Image Processing)

Raqamli tasvirni qayta ishlashda matematik vositalar ajralmas ahamiyatga ega. Masalan, to‘plamlar nazariyasi (set theory) tasvirlar bilan, ayniqsa binary tasvirlar bilan ishlashni tushunish va amalda bajarishda juda muhim.

Binary tasvirlarda piksellar odatda ikki sinfga ajratiladi: foreground (1) va background (0). To‘plamlar nazariyasida union va intersection kabi amallar piksel koordinatalari orqali ifodalangan xususiyatlar (features) o‘rtasidagi munosabatlarni aniqlashga yordam beradi.

Yana bir muhim yo‘nalish: intensity transformations va spatial filtering. Bu usullar tasvir ichidagi piksel qiymatlarini manipulyatsiya qilishga qaratilgan bo‘lib, operatorlar bitta tasvirga yoki bir nechta tasvirlar to‘plamiga turli maqsadlarda (masalan, shovqinni kamaytirish, noise reduction) qo‘llanadi.

## Spatial filtering texnikalari va tasvirni yaxshilash (Image Enhancement)

Spatial filtering tasvirni qayta ishlashdagi juda keng qo‘llaniladigan yondashuv bo‘lib, u asosan har bir piksel qiymatini uning qo‘shni piksellari qiymatlariga qarab o‘zgartirish orqali tasvirni modifikatsiya qiladi.

Bu yerda quyidagi usullar uchraydi:

- Linear spatial filters: tasvirni blur qilish (low pass filters) yoki sharp qilish (high pass filters) uchun ishlatiladi.
- Turli filter kernel (yadro)larning xossalari va qo‘llanilishlari: masalan Gaussian filter va box filter.

Sharpening filterlar intensivlikdagi o‘tishlarni (transitions) kuchaytiradi va ko‘pincha raqamli differensiallash (digital differentiation) texnikalari orqali amalga oshiriladi. Bunga Laplacian kabi operatorlar misol bo‘lib, u tasvirdagi qirralar (edges) va uzilishlarni (discontinuities) ajratib ko‘rsatishga yordam beradi.

## Data augmentation

Data augmentation Convolutional Neural Networks (CNNs) yordamida tasvir klassifikatsiyasi (image classification) qilinadigan tizimlarda modelning ishlash sifati va generalization qobiliyatini oshirishda muhim rol o‘ynaydi.

Bu jarayon training datasetni sun'iy ravishda kengaytirishni anglatadi: ya'ni mavjud data pointlarning o‘zgartirilgan variantlarini yaratish yoki deep learning texnikalari orqali butunlay yangi data hosil qilish.

Augmented data odatda mavjud ma'lumotlarga turli modifikatsiyalar qo‘llash orqali yaratiladi. Masalan:

- geometrik transformatsiyalar
- color space transformatsiyalar

Bu orqali original dataset turli ko‘rinishlar bilan boyitiladi.

Bunga qarama-qarshi ravishda, synthetic data butunlay yangi bo‘lib, noldan (scratch) generatsiya qilinadi. Bunda Deep Neural Networks (DNNs) va Generative Adversarial Networks (GANs) kabi ilg‘or usullar ishlatiladi, natijada dataset yanada xilma-xil va hajm jihatdan kattaroq bo‘ladi. Har ikkala yondashuv ham machine learning modellari uchun training jarayonida kerak bo‘ladigan data miqdori va turini sezilarli oshiradi.

Data augmentation faqat tasvirlar uchun emas, balki audio, video, text va boshqa data turlari uchun ham qo‘llanadi. Bu ayniqsa training data cheklangan bo‘lgan holatlarda foydali. U model aniqligini oshiradi, overfittingni kamaytiradi va data labelling hamda cleaning xarajatlarini pasaytiradi. Shunga qaramay, original datasetdagi biaslar saqlanib qolishi va quality assurance qimmatga tushishi kabi muammolar ham mavjud.

Amaliyotda data augmentation texnikalari data turiga qarab farq qiladi:

- Audio uchun: noise injection va pitch adjustments.
- Text uchun: word shuffling va syntax-tree manipulation kabi usullar.
- Image augmentation uchun: flipping, cropping, kernel filterlarni qo‘llash.

Yana ham ilg‘or yondashuvlar mavjud: masalan Neural Style Transfer va GANlar yordamida yangi data point generatsiya qilish. Bunday usullar sog‘liqni saqlashda medical imaging uchun, self-driving carlar uchun synthetic data ishlab chiqishda, va Natural Language Processingda (ayniqsa low-resource language ssenariylarida) juda foydali.

Tasvirlar uchun aniq augmentation amaliyotlariga quyidagilar kiradi:

- random rotations
- brightness adjustments
- shifts
- flips
- zoom

Bular Pytorch, Augmentor, Albumentations, Imgaug va OpenCV kabi vositalar orqali amalga oshiriladi. Ushbu kutubxonalar Gaussian noise qo‘shishdan tortib perspective skewinggacha bo‘lgan turli augmentatsiyalarni qo‘llashga imkon beradi va turli machine learning ehtiyojlariga moslashadi.

Data augmentationning ahamiyati, ayniqsa CNN bilan image classification kontekstida, yanada yaqqol ko‘rinadi. Dastlabki CNN training jarayonida ko‘pincha standart datasetlar ishlatiladi, ularning sample size katta bo‘lgani uchun model accuracy yuqori chiqadi. Ammo bu modellar real dunyo muammolariga qo‘llanganda ko‘pincha performance pasayishi kuzatiladi. Bu esa ko‘proq va xilma-xil data zarurligini ko‘rsatadi.

Data augmentation shu bo‘shliqni to‘ldiradi: datasetdagi rasmlar sonini, qo‘shimcha data yig‘masdan turib ham, sezilarli ko‘paytirish mumkin. Bu nafaqat dataset hajmini oshiradi, balki variativlik (variability) olib kiradi va training jarayonini yanada robust qiladi. Model training vaqtida batch-wise augmentation qo‘llansa, disk xotira ham tejaladi, chunki transformatsiya qilingan rasmlarni alohida saqlash shart bo‘lmaydi.

Umuman olganda, data augmentation shunchaki datasetni kengaytirish usuli emas. U image classification vazifalari uchun samarali va amaliy CNN modellari yaratishda zarur komponent hisoblanadi. Model performance va real dunyoga generalizationni yaxshilash orqali data augmentation deep learning sohasida doimiy ravishda ko‘proq va xilma-xil data talabini qondiradigan tayanch texnika sifatida qaraladi.
