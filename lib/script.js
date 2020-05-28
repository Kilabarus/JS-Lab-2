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
  return ("0" + date.getDate()).slice(-2) + "." + ("0" + (date.getMonth() + 1)).slice(-2) + "." + date.getFullYear();
}

function isInRange(num, min, max) {
  return (num > min) && (num < max);
}

class Person {
/*
  Ошибки в зависимости от сида:
  0.0 < seed < 0.1 — Название страны
  0.1 < seed < 0.2 — Название города
  0.2 < seed < 0.3 — Несоответствие страны и города
  0.3 < seed < 0.4 — Цель визита
  0.4 < seed < 0.5 — Дата въезда
  0.5 < seed < 0.6 — Время пребывания
*/
  constructor() {
    let seed = Math.random();
    this.valid = seed > 0.6;

    // Имя, Фамилия
    let rnd = getRandomInt(0, 2); // Пол
    this.firstName = 
      (rnd ? M_FIRST_NAMES[getRandomInt(0, M_FIRST_NAMES.length)] 
           : F_FIRST_NAMES[getRandomInt(0, F_FIRST_NAMES.length)]);
    this.lastName = LAST_NAMES[getRandomInt(0, LAST_NAMES.length)];
    if (!rnd) 
      this.lastName += "a";

    // Страна, город
    let t = COUNTRIES.length / 2;
    rnd = getRandomInt(0, t);

    this.country = COUNTRIES[rnd + (t * isInRange(seed, 0, 0.1))];
    this.city = CITIES[rnd + (t * isInRange(seed, 0.1, 0.2))];
    if (isInRange(seed, 0.2, 0.3))
      this.city = 
        CITIES[(rnd + getRandomInt(1, t)) % t];

    // Цель визита, дата въезда, время пребывания
    t = GOALS_OF_VISITING.length / 2;
    rnd = 
      getRandomInt(0, t) + (t * isInRange(seed, 0.3, 0.4));

    this.goalOfVisiting = GOALS_OF_VISITING[rnd];

    this.dateOfEntry = new Date();
    this.dateOfEntry.setDate(curDate.getDate() 
      + getRandomInt(1, 3) * isInRange(seed, 0.4, 0.5));

    if (rnd <= 4)
      if (isInRange(seed, 0.5, 0.6))
        this.daysToStay = DAYS_TO_STAY[rnd] + getRandomInt(1, 4);
      else
        this.daysToStay = getRandomInt(1, DAYS_TO_STAY[rnd] + 1)      
    else 
      this.daysToStay = getRandomInt(1, 30);
  }
}

const peoplePassToWin = 30; // Кол-во правильно пропущенных людей для победы
const errorsToFail = 3; // Кол-во допущенных ошибок для конца игры
const timeToDecide = 1000; // Время в мс. на решение


let personDiv; // Элемент с описанием человека
let currentPerson; // Обрабатываемый в этот момент человек
let timeLeft = timeToDecide / 100; // Оставшееся время на решение в с.
let score = 0; // Счёт

// Блок с описаниями людей
let listOfPersonsDiv = document.getElementById("listOfPersons");
// Блок с таймером
let timerDiv = document.getElementById("timer");

// Добавление описания нового человека в соответствующий блок
function addPerson() {
  currentPerson = new Person;

  personDiv = document.createElement('div');
  personDiv.className = "person";  
  personDiv.innerHTML = 
    `${currentPerson.firstName} ${currentPerson.lastName}<br>
    Страна: ${currentPerson.country}<br>
    Город: ${currentPerson.city}<br>
    Цель визита: ${currentPerson.goalOfVisiting}<br>
    Дата въезда: ${getFormatDate(currentPerson.dateOfEntry)}<br>
    Время пребывания: ${currentPerson.daysToStay} суток`;
  
  listOfPersonsDiv.prepend(personDiv);
  score += timeLeft; 
  timeLeft = timeToDecide / 100;
  timerDiv.innerText = timeLeft;
}

let errors = 0; // Кол-во совершенных ошибок
let peoplePassed = 0; // Кол-во правильно пропущенных людей
let peopleChecked = 0; // Общее кол-во просмотренных людей

// Блок с доп. информацией
let otherInfoDiv = document.getElementById("otherInfo"); 

// Обновление доп. информации в соответствующем блоке
function updateInfo() {
  otherInfoDiv.innerHTML = 
    `Осталось пропустить людей: ${peoplePassToWin - peoplePassed}<br><br>
    Проверено людей: ${peopleChecked}<br>
    Ошибок: ${errors}<br>`;
}

let playingTime = 0; // Счётчик прошедшего времени

// Таймер
function reduceTime() {
  ++playingTime;
  if (--timeLeft > 0)
    timerDiv.innerText = timeLeft;
  else
    if (++errors == errorsToFail)
      endGame(false);
    else {
      personDiv.remove();
      ++peopleChecked
      updateInfo();
      addPerson();      
    }    
}

// Обработчик события пропуска человека
document.getElementById("accept").onclick = function() {
  if (currentPerson.valid)
    if (++peoplePassed == peoplePassToWin)
      endGame(true);
    else {   
      personDiv.classList.add('rightAccept');
      ++peopleChecked;
      updateInfo();
      addPerson();
    }      
  else
    if (++errors == errorsToFail)
      endGame(false);
    else
      {
        personDiv.classList.add('wrongAccept');
        ++peopleChecked;
        updateInfo();
        addPerson();
      }
}

// Обработчик события непропуска человека
document.getElementById("decline").onclick = function() {
  personDiv.remove();
  if (currentPerson.valid)
    if (++errors == errorsToFail)
      endGame(false);
    else
      {        
        ++peopleChecked;
        updateInfo();
        addPerson();
      } 
  else {
    ++peopleChecked;
    updateInfo();
    addPerson();
  }
}

// Конец игры, вывод результата
function endGame(win) {
  clearInterval(tenSeconds);
  let end = document.createElement('div');
  end.className = "end";
  if (win)
    end.innerHTML = 
      `Поздравляю, ты победил!<br>
      Потраченного впустую времени: ${playingTime} секунд<br>
      Счёт: ${score}`;
  else {
    end.style.color = "red";
    end.innerText = "Ты проиграл!";
  }
  
  document.body.prepend(end);
  document.getElementById("game").style.display = "none";
}

updateInfo();
addPerson();
let tenSeconds = setInterval(reduceTime, timeToDecide);