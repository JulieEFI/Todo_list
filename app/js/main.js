
/* объект с функциями приложения */
const App = {
	/* инициализация, добавление событий в листеннер*/
	initBuilder: () => {

		const ShowFormBtn = document.querySelectorAll('.board__stage-show'); // кнопка добавить карточку с +
		App.bind(ShowFormBtn, App.showForm);

		const hideFormBtn = document.querySelectorAll('.board__stage-close'); // кнопка из добавить карточку Х
		App.bind(hideFormBtn, App.hideForm);

		const addCardBtn = document.querySelectorAll('.board__stage-add'); // кнопка, которая непосредственно добавляет карточку
		App.bind(addCardBtn, App.addCard);

		const delAllCardsBtn = document.querySelectorAll('.board__delete-all-btn'); // кнопка, которая удаляет все карточки
		App.bind(delAllCardsBtn, App.delAllCards);

	},
    /* добавление карточки*/
	addCard: (event) => {
		const text = event.target.previousElementSibling.value;

		if (text.trim().length > 0) {
			const list = event.target.parentNode.previousElementSibling;
			const next = event.target.dataset.next;
			App.appendCard(list, text, next);
			App.hideForm(event);

		}
	},
	/*добавление содержимого карточки */
	appendCard: (list, text, next) => {
		const card = document.createElement('div');
		card.classList.add('board__stage-card');

		const date = document.createElement('p');
		date.appendChild(document.createTextNode(text));

		const name = document.createElement('p');
		name.appendChild(document.createTextNode(text));


		const labelText = document.createElement('pre');
		labelText.appendChild(document.createTextNode(text));

		card.appendChild(date);
		card.appendChild(name);
		card.appendChild(labelText);

		if (next !== undefined) {
			const nextBtn = document.createElement('button');
			nextBtn.appendChild(document.createTextNode('=>'));
			nextBtn.classList.add('board__add-btn');
			nextBtn.addEventListener('click', App.changeStage);
			nextBtn.dataset.next = next;

			const delBtn = document.createElement('button');
			delBtn.appendChild(document.createTextNode(''));
			delBtn.innerHTML = '<i class="fa fa-trash"></i>';
			delBtn.classList.add('board__delete-btn');
			delBtn.addEventListener('click', () => {
				delBtn.parentNode.querySelector(".board__stage-card");

				swal({
						title: "Вы уверены?",
						text: "После удаления карточка не сможет быть восстановлена!",
						icon: "warning",
						buttons: true,
						dangerMode: true,
					})
					.then((willDelete) => {
						if (willDelete) {
							delBtn.parentNode.remove();
							swal("Карточка была удалена!", {
								icon: "success",
							});
						} else {
							swal("Карточка в безопасности!");
						}
					});

			});

			const editBtn = document.createElement('button');
			editBtn.appendChild(document.createTextNode('Edit'));
			editBtn.classList.add('board__edit-btn');
			editBtn.addEventListener('click', () => {
				editBtn.parentNode.querySelector('.board__stage-card');

				if (editBtn.textContent == "Edit") {
					editBtn.textContent = "Ok";
					editBtn.parentNode.contentEditable = true;
					editBtn.parentNode.focus();
				} else {
					editBtn.textContent = "Edit";
					editBtn.parentNode.contentEditable = false;
				}
			});

			card.appendChild(nextBtn);
			card.appendChild(delBtn);
			card.appendChild(editBtn);

		}

		list.appendChild(card);

		let listOfNameUsers = document.getElementById("board__users");
		let selectedNameOfUser = listOfNameUsers.options[listOfNameUsers.selectedIndex].text;
		name.innerHTML = selectedNameOfUser;

		let calendar = document.querySelector('.board__calendar');
		date.innerHTML = calendar.value;
		
	},
	/*отобразить форму ввода */
	showForm: ({
		target
	}) => {
		target.style.display = 'none';
		target.previousElementSibling.style.display = 'block';
	},
	/*скрыть форму ввода */
	hideForm: (event) => {
		console.log(event);
		event.target.parentNode.style.display = 'none';
		event.target.parentNode.nextElementSibling.style.display = 'block';
		event.target.parentNode.querySelector('textarea').value = '';
	},

	changeStage: ({
		target
	}) => {
		const stages = {
			'todo': 'in-progress',
			'in-progress': 'done'
		};
		const next = target.dataset.next;
		const nextList = document.querySelector('.board__stage-list[data-stage=' + next + ']');
		const text = target.parentNode.querySelector('pre').textContent;

		App.appendCard(nextList, text, stages[next]);

		target.parentNode.remove();
	},

    /*удаление карточек*/
	delAllCards: (event) => {
		const cards = event.target.parentNode.querySelector('.board__stage-list');

		if (!document.querySelector('.board__stage-card')) {
			swal({
				title: "Нет элементов для удаления!!!",
				icon: "warning",
				dangerMode: true,
			})
		} else {

			swal({
					title: "Вы уверены?",
					text: "После удаления карточка не сможет быть восстановлена!",
					icon: "warning",
					buttons: true,
					dangerMode: true,
				})
				.then((willDelete) => {
					if (willDelete) {
						cards.innerHTML = "";
						swal("Карточка была удалена!", {
							icon: "success",
						});
					} else {
						swal("Карточка в безопасности!");
					}
				});
		}


	},
	/**вспомогательная перебор массива объектов и выполнение по нему функции*/
	bind: (objectList, callback) => {

		if (objectList.length > 1) {
			objectList.forEach(el => {
				el.addEventListener('click', callback);
			});
		} else {
			objectList[0].addEventListener('click', callback);
		}
	}

};

/**прием пользователей */
fetch('https://jsonplaceholder.typicode.com/users')
	.then(function (response) {
		return response.json();// декодирует ответ в формате JSON
	})
	.then(function (data) {
		appendDataToUsersFromTodo(data);
	})
	.catch(function (err) {
		alert('Ошибка авторизации пользователей: ' + err);
	});

/**добавление из полученого списка пользователя имен в список */
function appendDataToUsersFromTodo(data) {
	let containerWithNamesOfUsers = document.getElementById("board__users");
	for (let i = 0; i < data.length; i++) {
		let option = document.createElement("option");
		option.setAttribute('selected', 'selected');
		option.innerHTML = data[i].username;
		option.setAttribute('id', data[i].id);
		containerWithNamesOfUsers.appendChild(option);
	}

}

/**добавление событий в приложение, запуск */
document.addEventListener('DOMContentLoaded', App.initBuilder()); // происходит когда весь HTML был полностью загружен и пройден парсером