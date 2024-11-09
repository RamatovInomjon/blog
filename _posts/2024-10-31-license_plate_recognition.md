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

<!-- <video width="640" height="360" controls>
  <source src="https://www.youtube.com/watch?v=d4xTktY-lrw" type="video/mp4">
  Your browser does not support the video tag.
</video> -->

<p style="text-align: justify">
Shu yerda birinchi qism yakuniga yetdi, bizda mashina davlat raqamini aniqlovchi algoritm tayyor. 
2-qism avtomobil davlat raqamini tanib olish. Bu qismini qanday bajarmoqchiman?! Odatda bu qismi OCR(optical character recognition) modellar orqali bajariladi, yani tasvirda davlat raqami joylashgan joy qirqib olinib OCR modelga beriladi, bu model o'z navbatida berilgan tasvirda qanday belgilar borligini aniqlab beradi. 
Men no-odatiy usuldan foydalanib, yana bir detection model train qilishga qaror qildim, yani 36ta belgilini aniqlaydigan model, yolov8 yordamida, bular 10 ta raqam hamda 26ta lotin harflari. Lekin dataset ni qayerdan olaman, axir bunday dataset open source bo'lmaydi! Synthetic dataset generate qildim, yani sythetic uzb license plate generate qildim. 
Bu mavzuni o'zi alohida post qilishga arzigulik bo'lganligi uchun,hozircha generate qilingan dataset namunalari bilan bo'lishib qo'ya qolaman. 
</p>
![data samples](http://inomjonramatov.uz/images/data_samples.png)
![labeling process](http://inomjonramatov.uz/images/label.png)

Umumiy hisoblaganda ~18k tasvir labellari bilan hosil qilindi. Agar kimgadir qiziqsa bu dataset bilan ham bo'lishishim mumkin. Endi ikkinchi modelimizni ham o'qitishni boshlaymiz. Dataset ni train/val/test set larga bo'lib chiqamiz. Men 80/10/10 ulushlarda bo'lib oldim. 
<br>Belgilarni tanib olish qismini ham o'qitishni boshlaymiz:

```bash
yolo task=detect mode=train data=plate_recognition/data.yaml model=yolov8s.pt epochs=200 imgsz=640,128 batch=64
```

Training yakuniga yetdi, quyida ikkinchi qism training natijalari:

![Training result](http://inomjonramatov.uz/images/results_2.png)

![Validation result](http://inomjonramatov.uz/images/val_batch2_pred_2.jpg)

Endi esa o'qitilgan modellarimizni birgalikda ishlashi uchun python script yozamiz. Hazillashdim, chatGPT dan iltimos qilamiz yozib ber deb. Quyida natija:


```python
import cv2
from ultralytics import YOLO


# Map character classes to actual characters
character_map = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
                    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
                    'U', 'V', 'W', 'X', 'Y', 'Z']

# Load YOLOv8 models
license_plate_model = YOLO("weights/detection.pt")  # Replace with your license plate model
character_model = YOLO("weights/recognition.pt")          # Replace with your character model

# Open video or camera
cap = cv2.VideoCapture('test.mp4')  # or 0 for webcam

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Step 1: Detect license plates in the frame
    license_plates = license_plate_model(frame)
    for plate in license_plates[0].boxes:
        x1, y1, x2, y2 = map(int, plate.xyxy[0])  # Get bounding box coordinates
        cropped_license_plate = frame[y1:y2, x1:x2]

        # Step 2: Detect characters in the cropped license plate
        characters = character_model(cropped_license_plate)

        # Collect detected characters and their x-coordinates
        detected_characters = []
        for char in characters[0].boxes:
            x1_char, y1_char, x2_char, y2_char = map(int, char.xyxy[0])
            character_class = int(char.cls[0])  # Detected character class index
            detected_characters.append((character_class, x1_char))

        # Sort characters by x-coordinate
        detected_characters.sort(key=lambda char: char[1])
        
        license_text = ''.join([character_map[char[0]] for char in detected_characters])

        # Print the result
        print("Detected License Plate Text:", license_text)
        
        # Draw bounding box and text on the frame
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, license_text, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

    # Display the frame
    cv2.imshow("License Plate Recognition", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
```


[![Results](https://i9.ytimg.com/vi_webp/pVJje-Dvqxw/mq3.webp?sqp=CPzRvrkG-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgYChVMA8=&rs=AOn4CLBN9e-cc4i3hU3nr_yCBxtMnKa5vA)](https://youtu.be/pVJje-Dvqxw)


Natija yomon emas! [Bu yerda](https://github.com/RamatovInomjon/license_plate_recognition) github dan kod hamda modellarni yuklab olib testlab ko'rishingiz mumkin. Mavzu yoqqan bo'lsa do'stalringiz bilan bo'lishing, yanada qiziqarli "real world" proektlar esa hali oldinda. Rahmat! 