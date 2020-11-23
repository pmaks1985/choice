1. Создать скрипт, который будет отправлять AJAX-запрос с помощью jQuery (п.1) и получать ответ.
2. Сделать обработку этого ответа: написать цикл, который будет проходить по всем вопросам и создавать html-код (записывать его в текстовую переменную).
3. после того, как пользователь дал все ответы на вопросы, нужно отправить запрос на

https://abdpo-lk.ru/lk/ChoosingProgramAlgo/choosingprogramquestions_api_ext.php?action=getResults

со следующим контентом

{
 "answer1Id": 14,
 "answers": [3, 4, 16]
}

где
answer1Id - это id ответа на первый вопрос
answers - массив из id остальных ответов

На запрос будет дан следующий ответ со списоком программ
{
"programs": [
 {
"programTypeId": "3",
"programTypeTitle": "ОПП",
"programTypeFullTitle": "Оказание первой помощи (16 ч)",
"programId": "16",
"programTitle": "ОПП_01",
"programText": "Оказание первой помощи пострадавшим на производстве",
"inspector": null,
"normativeDocument": null,
"professions": [
 {
"title": "Преподаватель",
"comment": "(или руководитель)"
},
 {
"title": "Тьютор",
"comment": ""
}
],
},
 {
"programTypeId": "10",
"programTypeTitle": "АЗ",
"programTypeFullTitle": "Антитеррористическая защищенность (40 ч)",
"programId": "60",
"programTitle": "АЗ_01",
"programText": "Антитеррористическая защищенность образовательной организации",
"inspector": null,
"normativeDocument": null,
"professions": [
 {
"title": "Преподаватель",
"comment": "(или руководитель)"
},
 {
"title": "Директор",
"comment": "(или руководитель)"
}
],
},
 {
"programTypeId": "10",
"programTypeTitle": "АЗ",
"programTypeFullTitle": "Антитеррористическая защищенность (40 ч)",
"programId": "60",
"programTitle": "АЗ_01",
"programText": "Антитеррористическая защищенность образовательной организации",
"inspector": null,
"normativeDocument": null,
"professions": [
 {
"title": "test",
"comment": ""
}
],
}
],
}

где programs - это массив из объектов, в которых
programTypeId - id типа программы
programTypeTitle - краткое название типа программы
programTypeFullTitle - полное название типа программы
programId - id программы
programTitle - код программы
programText - название программы
inspector - кто проверяет
normativeDocument - нормативное обоснование
professions - массив из объектов с профессиями, где title - название профессии, а comment - комментарий
