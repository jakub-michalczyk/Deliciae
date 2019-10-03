(function init(){
    fixStyles();

    document.querySelector('#search').style.display = 'flex';
    document.querySelector('#containerContent').style.flexDirection = 'column';
    
    document.querySelector('#designer div').addEventListener('click', showMore);
    document.querySelector('#menuPrizeTitle').addEventListener('click', showMore);
    document.querySelectorAll('.specifyItem').forEach(item => item.addEventListener('click', specifyItem));
    
    quickShowBox();
    productFullpage();
    mainInit();
})();