(function init() {
    getSex();
    fixStyles();
    gettingCloths();
    mainInit();

    document.querySelector('#designer div').addEventListener('click', showMore);
    document.querySelector('#menuPrizeTitle').addEventListener('click', showMore);
    document.querySelectorAll('.specifyItem').forEach(item => item.addEventListener('click', specifyItem));
    document.querySelector('#containerContent').style.flexDirection = 'column';
})();

function getSex() {
    if (document.querySelector('#containerContent h1') === null) {
        filteredSex = null;
    }
    else if (document.querySelector('#containerContent h1').textContent.includes('Kobieta')) {
        filteredSex = 'woman';
    }
    else if (document.querySelector('#containerContent h1').textContent.includes('Mężczyzna')) {
        filteredSex = 'man';
    }
    else if (document.querySelector('#containerContent h1').textContent.includes('Dziecko')) {
        filteredSex = 'kid';
    }
}

