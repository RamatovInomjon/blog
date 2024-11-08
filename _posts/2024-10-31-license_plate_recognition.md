---

title: "Avtomobil davlat raqamini tanish (Yolov8)"
date: 2024-11-07
tags: [computer vision, yolov8]
site_url: https://inomjonramatov.uz/
header:
   image:"/images/ml-p1/ml-p1-background.jpeg"
categories:
  - Tutorial
excerpt: "Assalomu alaykum qadrli do’stlar! "


---

# YOLOv8 yordamida avtomobil raqamini tanib olish
<p style="text-align: justify">
Assalomu alaykum qadrli do'stlar! 
Bugun sizlar bilan bir qiziqarli proekt haqida gaplashamiz. Bu proekt ustida 3-4 yil oldin ishlagandim, demak boshladik.
<br>Qanday proekt: Uzb License plate recognition, Yani o'zbekistondagi avtomobil raqamlarini tanib olish uchun dasturiy vosita yaratish.
<br>Qayerlarda ishlatiladi: Aqilli turargohlar uchun, aqilli uylar uchun (garaj yoki uy darvozasini ochish uchun) hullas qayerda avtomobil raqamini tanib olish muhim bo'lsa o'sha joylarda ishlatish mumkin.
<br>Algoritm ikki qismdan iborat, yani men yozmoqchi bo'lgan algoritm shunday ishlaydi, ( lekin end2end license plate recognition algoritmlar ham mavjud). Birinchi qism. License plate detection yani avtomobil davlat raqmini aniqlash, ikkinchi qism license plate recognition yani avtomobil raqamini tanib olish.</p>

Biz bu algoritmni yozishda yolov8 frameworkidan foydalanamiz, agar yolov8 haqida bilmasangiz [shu yerda](https://inomjonramatov.uz/tutorial/yolo/) o'qishingiz mumkin
<br>Bu tizmni ishlab chiqishda eng muhim, eng murakkab va eng ko'p vaqt oladigan qismi data collection and labeling. Bu proekt o'rganish va tajriba orttirish uchun bo'lganligi sabab open source dataset larga murojaat qildim. Google do'stimizdan "license plate detection yolov8" deb so'ragan edim [quyidagi natijlar](https://www.google.com/search?q=license+plate+detection+yolov8&client=ubuntu-chr&sca_esv=f9c5db1b7e09e798&sxsrf=ADLYWIK_xLdnASI5dUOt93AKII0Z9b6e_w%3A1730982167066&ei=F7EsZ7W2A42HwPAP4taayQk&ved=0ahUKEwj1nbiJm8qJAxWNAxAIHWKrJpkQ4dUDCA8&uact=5&oq=license+plate+detection+yolov8&gs_lp=Egxnd3Mtd2l6LXNlcnAiHmxpY2Vuc2UgcGxhdGUgZGV0ZWN0aW9uIHlvbG92ODIKECMYgAQYJxiKBTIGEAAYFhgeMggQABiABBiiBDIIEAAYgAQYogRIyR9Q1QZYlx1wAXgBkAEAmAHSAaABpQ-qAQYwLjEyLjG4AQPIAQD4AQGYAgqgAuUKwgIKEAAYsAMY1gQYR8ICDBAjGIAEGBMYJxiKBcICCBAAGIAEGMsBmAMAiAYBkAYIkgcFMS44LjGgB5lX&sclient=gws-wiz-serp) kelib chiqdi. 

<br>Agar sizga o'zbekistondagi avtomashinalar rasmlari muhim bo'lsa web scrapping orqali olx, avtoelonuz kabi saytlardan olishingiz, [labelImg](https://github.com/HumanSignal/labelImg) yoki [roboflow](https://roboflow.com/) kabi saytlarda data labeling qilishingiz mumkin. Kimdir qiziqsa DM, dataset bilan bo'lishishim mumkin, faqat kichkina shartlarni bajarish kerak bo'ladi.
<br>So'rov natijalarni ko'rib chiqqach, [quyidagi datasetni](https://universe.roboflow.com/roboflow-universe-projects/license-plate-recognition-rxg4e/dataset/4) yuklab oldim, hamda o'zimda bor custom datasetni qo'shdim. Dataset uch qismga ajratib chiqildi, umumiy hisoblaganda training uchun 24k+ tasvir, validation uchun 2k+ hamda testing uchun 2k+ tasvir yig'ildi. Demak eng qiyin va muhim qism yakunlandi, bizda dataset tayyor. Endi yana bir muhim ish, bu model hyperparameter tanlash, yani training jarayonini effective bo'lishi uchun, batch size, image size etc, kabi parameterlarni belgilash. Keling boshlanishiga bu parameterlarni default qiymatlarini qoldiramiz, va o'qitish jarayonini boshlaymiz. 

```bash
yolo task=detect mode=train data=LP_detection/data.yaml model=yolov8s.pt batch=32 imgsz=640
```
Training yakuniga yetdi, quyida training natijalari:
![Training result](http://inomjonramatov.uz/images/results.png)

![Validation result](http://inomjonramatov.uz/images/val_batch2_pred.jpg)

<video width="640" height="360" controls>
  <source src="https://www.youtube.com/watch?v=d4xTktY-lrw" type="video/mp4">
  Your browser does not support the video tag.
</video>


Ushbu dataset yolov8 algoritmi orqali o'qitildi. Shu yerda birinchi qism yakuniga yetdi, bizda mashina davlat raqamini aniqlovchi algoritm tayyor. 
2-qism avtomobil davlat raqamini tanib olsih. Bu qismni qanday bajarmoqchiman,
