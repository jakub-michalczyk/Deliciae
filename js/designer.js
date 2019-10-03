(function init(){
    if(document.querySelector('#designerBox') !== null){
        fixStyles();
        getDesigner();
    }

    mainInit();

    document.querySelectorAll('.sexBox').forEach(box => box.addEventListener('click', designerChooseSex));
    document.querySelectorAll('.sexBox').forEach( box => box.addEventListener('mouseover', chooseSexAnimation));
    document.querySelectorAll('.sexBox').forEach( box => box.addEventListener('mouseout', removeChooseSexAnimation));
    document.querySelectorAll('.designer').forEach(designer => designer.addEventListener('click', viewDesignerPage));
})();

function viewDesignerPage(e){
    let target = null;
    let designer = {};

    e.target.className !== 'designer' ? target = e.target.parentNode : target = e.target;

    designer.src = target.children[0].src.split('/')[target.children[0].src.split('/').length - 1];
    designer.name = target.children[1].textContent;

    sessionStorage.setItem('designer', JSON.stringify(designer));

    window.location.href = '../html/designer.html';

}

function getDesigner(){
    if(document.querySelector('#designerBox') !== null && sessionStorage.getItem('designer') !== null){
        let designer = JSON.parse(sessionStorage.getItem('designer'));
        const DESIGNER_BOX = document.querySelector('#designerBox');
        const img = new Image();
    
        DESIGNER_BOX.children[0].appendChild(img);
        DESIGNER_BOX.children[0].children[0].src = `../img/designersLogo/${designer.src}`;
        DESIGNER_BOX.children[0].children[0].width = "150px";

        DESIGNER_BOX.dataset.designer = designer.name;

        document.querySelector('#container').style.flexDirection = 'column';
        document.querySelector('#container').style.justifyContent = 'center';
        document.querySelector('#container').style.alignItems = 'center';
    }
}

function designerChooseSex(e){
    determineSex(e.target);

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
            <div id="designerBox" data-designer="${JSON.parse(sessionStorage.getItem('designer')).name}">
                <div id="imgContainer"></div>
            </div>
            <div id="listings"></div>
        </div>`

    document.querySelector('#designer div').addEventListener('click', showMore);
    document.querySelector('#menuPrizeTitle').addEventListener('click', showMore);
    document.querySelectorAll('.specifyItem').forEach(item => item.addEventListener('click', specifyItem));
    document.querySelector('#container').style.flexDirection = 'row';
    document.querySelector('#container').style.alignItems = 'flex-start';

    filteredBrand.push(JSON.parse(sessionStorage.getItem('designer')).name);
    
    gettingCloths();
    mainTools();
    createBrandLogo();
    filterItems(undefined, true)
    productFullpage();
}

function createBrandLogo(){
    document.querySelector('#designerBox').innerHTML = `<img width="150px" height="100px" src="../img/designersLogo/${JSON.parse(sessionStorage.getItem('designer')).name.toLowerCase().trim()}.png">`
}



