(function init(){
    fixStyles();
    mainInit();

    document.querySelectorAll('.sexBox img').forEach( box => box.addEventListener('mouseover', chooseSexAnimation));
    document.querySelectorAll('.sexBox img').forEach( box => box.addEventListener('mouseout', removeChooseSexAnimation));
    document.querySelectorAll('.sexBox').forEach( box => box.addEventListener('click', chooseSex));

    document.querySelector('#menuToggle').addEventListener('click', menuToggle);
    document.querySelector('nav').style.zIndex = '9999';
})();

function chooseSex(e){
    determineSex(e.target);
    createListingBox();
    gettingCloths();
    filterNews();
    mainTools();
    
    document.querySelector('#designer div').addEventListener('click', showMore);
    document.querySelector('#menuPrizeTitle').addEventListener('click', showMore);
    document.querySelectorAll('.specifyItem').forEach(item => item.addEventListener('click', specifyItem));
}

function createListingBox(){
    document.querySelector('#container').innerHTML =
        `<div id="containerMenuBox">
            <ul id="containerMenu">
                <li class="containerElem" id="category">
                    <span>Kategoria</span>
                    <ul class="subMenu" id="forWho">
                        <li class="specifyItem"><div>Ubrania<i style="font-size:24px;color:#ff1a1a;" class="material-icons">arrow_drop_down</i></div></li>
                        <li class="specifyItem"><div>Buty<i style="font-size:24px;color:#ff1a1a;" class="material-icons">arrow_drop_down</i></div></li>
                        <li class="specifyItem"><div>Akcesoria<i style="font-size:24px;color:#ff1a1a;" class="material-icons">arrow_drop_down</i></div></li>
                    </ul>
                </li>
                <li class="containerElem" id="designer">
                    <div id="designerWrap">Projektant <i style="font-size:30px;" class="containerMenuArrow material-icons">arrow_drop_down</i></div>
                </li>
                <li class="containerElem" id="menuPrize"><div id="menuPrizeTitle">Cena <i style="font-size:30px;" class="containerMenuArrow material-icons">arrow_drop_down</i></div></li>
            </ul>
        </div>
        <div id="containerContent">
            <div id="filterBox"></div>
            <h1>Nowości</h1>
            <div id="listings"></div>
        </div>`
}

function filterNews(){
    document.querySelectorAll('.listing').forEach(listing => {
        listing.dataset.news !== 'true' ? listing.remove() : null;
    });
}




