"use strict"

// Выход из личного кабинета
const logoutButton = new LogoutButton();
logoutButton.action = () => {
    const callback = (response) => {
        if(response.success) {
            location.reload();
        }
    };

    ApiConnector.logout(callback);
}

// Получение информации о пользователе
ApiConnector.current((response) => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
    }
})

// Получение текущих курсов валюты
const ratesBoard = new RatesBoard();

const updateRatesBoard = () => {
    ApiConnector.getStocks((response) => {
        if(response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    })
}

updateRatesBoard();

setInterval(() => {
    updateRatesBoard();
}, 60000);

// Операции с деньгами
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => {
    const {currency, amount} = data;

    const callback = (response) => {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, "Успешное пополнение баланса");
        } else {
            moneyManager.setMessage(response.success, response.error);
        }
    };

    ApiConnector.addMoney({currency, amount}, callback);
}

moneyManager.conversionMoneyCallback = (data) => {
    const {fromCurrency, targetCurrency, fromAmount} = data;

    const callback = (response) => {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, "Успешное конвертирование баланса");
        } else {
            moneyManager.setMessage(response.success, response.error);
        }
    };

    ApiConnector.convertMoney({fromCurrency, targetCurrency, fromAmount}, callback);
}

moneyManager.sendMoneyCallback = (data) => {
    const {to, currency, amount} = data;

    const callback = (response) => {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, "Успешный перевод средств");
        } else {
            moneyManager.setMessage(response.success, response.error);
        }
    };

    ApiConnector.transferMoney({to, currency, amount}, callback);
}

// Работа с избранным
const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((response) => {
    if(response.success) {
        ratesBoard.clearTable();
        ratesBoard.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});

favoritesWidget.addUserCallback = (data) => {
    const {id, name} = data;

    const callback = (response) => {
        if(response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(response.success, "Успешное добавление пользователя в Адресную книгу");
        } else {
            favoritesWidget.setMessage(response.success, response.error);
        }
    };

    ApiConnector.addUserToFavorites({id, name}, callback);
}

favoritesWidget.removeUserCallback = () => {
    const id = data;
    
    const callback = (response) => {
        if(response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(response.success, "Успешное удаление пользователя из Адресной книги");
        } else {
            favoritesWidget.setMessage(response.success, response.error);
        }
    };

    ApiConnector.removeUserFromFavorites(id, callback);
}