"use strict"

const curDate = new Date();

const M_FIRST_NAMES = ["Александр", "Максим", "Артём", "Константин", "Роман"];
const F_FIRST_NAMES = ["Софья", "Карина", "Юлия", "Дарья", "Маргарита"];

const LAST_NAMES = ["Смирнов", "Иванов", "Кузнецов", "Новиков", "Фёдоров"];

const COUNTRIES = ["Россия", "Швеция", "Финляндия", "Украина", "Канада", 
                   "Россея", "Швецыя", "Финлундия", "Усраина", "Каната"];

const CITIES = ["Москва", "Стокгольм", "Хельсинки", "Киев", "Оттава",
                "Мозква", "Стокдольм", "Херьсинки", "Кийев", "Отава"];

const GOALS_OF_VISITING = 
  ["Дипломатия", "Работа", "Туризм", "Посещение родственников", "Шоппинг",
   "Терроризм", "Реселлинг", "Политическое убежище", 
                                              "Просто так", "[ДАННЫЕ УДАЛЕНЫ]"];

const DAYS_TO_STAY = [10, 15, 3, 5, 1]; 

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getFormatDate(date) {
  return ("0" + curDate.getDate()).slice(-2) + "." + ("0" + (curDate.getMonth() + 1)).slice(-2) + "." + curDate.getFullYear();
}

class Person {

/*
  
  Ошибки в зависимости от сида:
  0.0 < seed < 0.1    — Название страны
  0.1 < seed < 0.2 — Название города
  0.2 < seed < 0.3 — Несоответствие страны и города
  0.3 < seed < 0.4 — Цель визита
  0.4 < seed < 0.5 — Дата въезда
  0.5 < seed < 0.6 — Время пребывания

*/

  constructor() {
    let seed = Math.random();
alert(seed);
    // Имя, Фамилия
    let gender = getRandomInt(0, 2);
    this.firstName = (gender ? M_FIRST_NAMES[getRandomInt(0, 5)] 
                             : F_FIRST_NAMES[getRandomInt(0, 5)]);
    this.lastName = LAST_NAMES[getRandomInt(0, 5)];
    if (!gender) 
      this.lastName += "a";

    // Страна, город
    let i = getRandomInt(0, 5);
    this.country = COUNTRIES[i + (5 * (seed < 0.1))];
    this.city = CITIES[i + (5 * ((seed > 0.1) && (seed < 0.2)))];
    if (seed > 0.2 && seed < 0.3)
      this.city = CITIES[(i + getRandomInt(1, 5)) % 5];

    // Цель визита, дата въезда, время пребывания
    i = getRandomInt(0, 5) + (5 * ((seed > 0.3) && (seed < 0.4)));
    this.goalOfVisiting = GOALS_OF_VISITING[i];

    this.dateOfEntry = new Date();

    this.dateOfEntry.setDate(curDate.getDate() + getRandomInt(1, 3) * ((seed > 0.4) && (seed < 0.5)));

    if (i <= 4)
    {
      if ((seed > 0.5) && (seed < 0.6))
        this.daysToStay = DAYS_TO_STAY[i] + getRandomInt(1, 4);
      else
        this.daysToStay = getRandomInt(1, DAYS_TO_STAY[i] + 1)      
    }
    else 
      this.daysToStay = getRandomInt(1, 30);
    

alert(this.firstName + " " + this.lastName + "\n"
  + "Страна: " + this.country + "\n" + "Город: " + this.city + "\n"
  + "Цель визита: " + this.goalOfVisiting + "\n"
  + "Дата въезда: " + getFormatDate(this.dateOfEntry) + "\n"
  + "Время пребывания: " + this.daysToStay + " суток\n");
  }
}

let p = new Person();

