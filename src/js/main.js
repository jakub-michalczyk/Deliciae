let cart = [];
let favourites = [];
let items = [];

let filteredItems = [];
let filteredCategory = [];
let filteredBrand = [];
let filteredSex = null;

let searchInput;
let product = null;

class Item{
    constructor(id, brand, name, price, src, sex, type, sale, doubles, color, sizes){
        this.id = id;
        this.brand = brand;
        this.name = name;
        this.price = price;
        this.src = src;
        this.sex = sex;
        this.type = type;
        this.sale = sale;
        this.doubles = doubles;
        this.color = color;
        this.sizes = sizes;
    }
}

if(location.href.includes('index')){
    mainInit();
}
else if(location.href.includes('news')){
    newsInit();
}
else if(location.href.includes('news')){
    newsInit();
}
else if(location.href.includes('product')){
    productInit()
}
else if(location.href.includes('about')){
    aboutInit()
}
else if(location.href.includes('designer')){
    designerInit()
}
else if(location.href.includes('sale')){
    saleInit()
}
else if(location.href.includes('woman') || location.href.includes('kid') || location.href.includes('man') ){
    clothInit()
}

function clothInit(){
    getSex();
    fixStyles();
    gettingCloths();
    mainInit();

    document.querySelector('#designer div').addEventListener('click', showMore);
    document.querySelector('#menuPrizeTitle').addEventListener('click', showMore);
    document.querySelectorAll('.specifyItem').forEach(item => item.addEventListener('click', specifyItem));
    document.querySelector('#containerContent').style.flexDirection = 'column';
}

function saleInit(){
    fixStyles();

    document.querySelector('#search').style.display = 'flex';
    document.querySelector('#containerContent').style.flexDirection = 'column';
    
    document.querySelector('#designer div').addEventListener('click', showMore);
    document.querySelector('#menuPrizeTitle').addEventListener('click', showMore);
    document.querySelectorAll('.specifyItem').forEach(item => item.addEventListener('click', specifyItem));
    
    quickShowBox();
    productFullpage();
    mainInit();
}

function designerInit(){
    if(document.querySelector('#designerBox') !== null){
        fixStyles();
        getDesigner();
    }

    mainInit();

    document.querySelectorAll('.sexBox').forEach(box => box.addEventListener('click', designerChooseSex));
    document.querySelectorAll('.sexBox').forEach( box => box.addEventListener('mouseover', chooseSexAnimation));
    document.querySelectorAll('.sexBox').forEach( box => box.addEventListener('mouseout', removeChooseSexAnimation));
    document.querySelectorAll('.designer').forEach(designer => designer.addEventListener('click', viewDesignerPage));
}

function aboutInit(){
    mainInit();
    fixStyles();
    
    document.querySelector('#containerContent').style.flexDirection = 'column';
    document.querySelector('#containerContent').style.marginTop = '5%';
}

function productInit(){
    product = JSON.parse(sessionStorage.getItem('product'));

    document.querySelector('#productBuy').addEventListener('click', addToCart);
    document.querySelector('#productFav').addEventListener('click', addToFav);

    document.querySelectorAll('.arrowIcon').forEach( arrow => arrow.addEventListener('click', imageToggle));

    fixStyles();
    mainInit();

    return unpackStorage();
}

function newsInit(){
    fixStyles();
    mainInit();

    document.querySelectorAll('.sexBox img').forEach( box => box.addEventListener('mouseover', chooseSexAnimation));
    document.querySelectorAll('.sexBox img').forEach( box => box.addEventListener('mouseout', removeChooseSexAnimation));
    document.querySelectorAll('.sexBox').forEach( box => box.addEventListener('click', chooseSex));

    document.querySelector('#menuToggle').addEventListener('click', menuToggle);
    document.querySelector('nav').style.zIndex = '9999';
}

function mainInit(){
    //Check if there is favourite arr saved in localStorage
    JSON.parse(localStorage.getItem('favourite')) !== null ? favourites = JSON.parse(localStorage.getItem('favourite')) : favourites = [];

    mainTools();
    
    document.querySelector('#menuToggle').addEventListener('click', menuToggle);
    document.querySelector('#cart').addEventListener('click', showCart);
    document.querySelector('#favourite').addEventListener('click', showFavourites);
    
    if(document.querySelector('#search i') !== null){
        document.querySelector('#search i').addEventListener('click', searchClothes);
    }

    if(document.querySelector('#pages') !== null){
        changingPage();
    }
}

function mainTools(){
    createItemsArr();
    changeFavouriteColor();
    filterSex();
    productFullpage();
    checkStorageForCart();
    createItemsInCartBall();
}

function searchClothes(e){
    if(e.target.nodeName === 'INPUT') return;

    if(document.querySelector('#search input') === null){
        const input = document.createElement('input');
        input.dataset.width = '10';

        document.querySelector('#search').insertBefore(input, document.querySelector('#search i'));
        document.querySelector('#search input').addEventListener('keydown', startSearchingItems);
        document.querySelector('#search').style.margin = '0 20px 0 10px';
        document.querySelector('#cart').style.display = 'none';
        document.querySelector('#favourite').style.display = 'none';
        
        resizeInput();
    }
    else{
        document.querySelector('#search').style.margin = '0 20px';
        scaleInput()
    }
}

function resizeInput(){
    let input = document.querySelector('#search input');

    if(parseInt(input.dataset.width) >= 65){
            input.dataset.width = '60';
            return cancelAnimationFrame(searchInput)
    }
    else{
        let data = parseInt(input.dataset.width);
        input.style.width = `${data += 10}%`;
        input.dataset.width = data;
    }

    searchInput = requestAnimationFrame(resizeInput)
}

function scaleInput(){
    let input = document.querySelector('#search input');

    if(parseInt(input.dataset.width) === 0){
        input.dataset.width = '60';
        cancelAnimationFrame(searchInput);
        setTimeout(() => {
            input.remove();
            document.querySelector('#cart').style.display = 'block';
            document.querySelector('#favourite').style.display = 'block';
        }, 250);
        return;
    }
    else{
        let data = parseInt(input.dataset.width);
        input.style.width = `${data -= 10}%`;
        input.dataset.width = data;
    }
     
    searchInput = requestAnimationFrame(scaleInput)
}

function startSearchingItems(){
    let val = document.querySelector('#search input').value;
    let typedItems = [];

    items.forEach( item => {
        let name = item.name.toLowerCase().trim();
        let brand = item.brand.toLowerCase().trim();

        if(name.includes(val.toLowerCase()) || brand.includes(val.toLowerCase())){
            if(item.sex === filteredSex){
                typedItems.push(item);
            }
        }
    });

    typedItems.length > 0 && val.length > 1 ? generateListings(typedItems) : filterSex();
}

function changingPage(){
    document.querySelector('#previousPage').addEventListener('click', goPreviousPage);
    document.querySelector('#nextPage').addEventListener('click', goNextPage);
}

function goPreviousPage(){
    let actualPage = document.querySelector('#actualPage').textContent.slice(7, 8);

    if(actualPage !== '1'){
        filterSex();
        document.querySelector('#actualPage').textContent = document.querySelector('#actualPage').textContent.replace(actualPage, parseInt(actualPage) - 1)
    }
}

function goNextPage(){
    let actualPage = document.querySelector('#actualPage').textContent.slice(7, 8).trim();
    let lastPage = document.querySelector('#actualPage').textContent.slice(11).trim();

    if(actualPage !== lastPage){
        document.querySelector('#listings').innerHTML = '';
        //Generate listings with id 21 and more from saved in storage arr
        generateListings(JSON.parse(sessionStorage.getItem('nextPageListings')));
        document.querySelector('#actualPage').textContent = document.querySelector('#actualPage').textContent.replace(actualPage, parseInt(actualPage) + 1)
    }
}

function createItemsArr(){
    //For each listing create and object representation
    document.querySelectorAll('.listing').forEach( item => {
        items.push( new Item(item.dataset.id, item.dataset.brand, item.dataset.name, item.dataset.price, item.children[0].src.split('/')[item.children[0].src.split('/').length - 1], item.dataset.sex, item.dataset.type, item.dataset.sale, 1, item.dataset.color, item.dataset.sizes))
    });
}

function filterSex(){
    let filteredSexArr = [];

    if(filteredSex !== null){
        items.forEach( item => {
            if(item.sex === filteredSex){
                filteredSexArr.push(item);
            }
        });
       
        return generateListings(filteredSexArr);
    }
}

function productFullpage(){
    document.querySelectorAll('.listing img').forEach( item => item.addEventListener('click', e => {
        items.forEach( item => {
            if(e.target.parentNode.dataset.id === item.id){
                //Save product object in storage and href to product page
                sessionStorage.setItem('product', JSON.stringify(item));
                window.location.href = '../html/product.html';
            }
        });
    }));
}

function menuToggle(){
    const hamburger = document.querySelector('#menuToggle');
    const lines = [
        document.querySelector('#menuToggle #line1'), 
        document.querySelector('#menuToggle #line2'), 
        document.querySelector('#menuToggle #line3')
    ];

    if(hamburger.dataset.type === 'hide'){
        hamburger.dataset.type = 'show';

        lines[2].style = `margin-top:-15px;`;

        setTimeout( () => lines[0].style.transform = `rotate(45deg)`, 200);
        setTimeout( () => {
          lines[1].style.transform += `translateY(-185%) rotate(-45deg)`;
          lines[2].style.opacity = `0`;
        });

        document.querySelector('#arrivals') !== null ? document.querySelector('#arrivals').style.marginLeft = '25%' : null;

        document.querySelector('nav').style.opacity = '1';
        document.querySelector('nav').style.left = '0%';

        document.querySelectorAll('.line').forEach( line => line.style.backgroundColor = '#000');
    }
    else{
        hamburger.dataset.type = 'hide';

        lines[2].style = `margin-top:5px;`;
        
        setTimeout( () => {
            lines[1].style.transform = `translateY(0.5px)`;
            lines[0].style.transform = `rotate(0deg)`;
            lines[1].style.transform = `translateY(0%) rotate(0deg)`;
            lines[2].style.opacity = `1`;
        }, 200);

        document.querySelector('#arrivals') !== null ? document.querySelector('#arrivals').style.marginLeft = '0%' : null;

        document.querySelector('nav').style.opacity = '0';
        document.querySelector('nav').style.left = '-30%';

        document.querySelectorAll('.line').forEach( line => line.style.backgroundColor = '#fff');
    }
}

function determineSex(target){
    if(target.nodeName === 'DIV'){
        target.className === 'sexBox' ? target = target.children[1] : null;
        if (target.textContent.includes('Mężczyzna')) {
            filteredSex = 'man';
        }
        else if (target.textContent.includes('Kobieta')) {
            filteredSex = 'woman';
        }
        else if (target.textContent.includes('Dziecko')) {
            filteredSex = 'kid';
        }
    }
    else{
        if (target.src.includes('woman')) {
            filteredSex = 'woman';
        }
        else if (target.src.includes('man')) {
            filteredSex = 'man';
        }
        else if (target.src.includes('kid')) {
            filteredSex = 'kid';
        }
    }
}

function chooseSexAnimation(e){
    e.target.parentNode.children[0].style.filter = 'brightness(100%)';
    e.target.parentNode.children[1].style.letterSpacing = '15px';
}

function removeChooseSexAnimation(e){
    e.target.parentNode.children[0].style.filter = 'brightness(50%)';
    e.target.parentNode.children[1].style.letterSpacing = '3px';
}

function fixStyles(){
    document.querySelector('#containerContent').style.flexDirection = 'row';
    document.querySelector('#container').style.backgroundImage = 'none';
    document.querySelector('#container').style.justifyContent = 'flex-start';
    document.querySelector('#container').style.flexDirection = 'row';
    document.querySelector('#container').style.alignItems = 'flex-start';
    document.querySelector('#container').style.height = 'auto';
    document.querySelector('#container').style.marginBottom = '50px';
}

function viewSalePrice(target, item){
    if(target !== null){
        if(item.dataset.sale !== 'null'){
            target.innerHTML = `<div class="previousPrice">${item.dataset.price}$</div> ${item.dataset.sale}`;
        }
        else{
            target.innerHTML = `${item.dataset.price}`;
        }
    }
    else{
        if(item.dataset.sale !== 'null'){
            return `<div class="previousPrice">${item.dataset.price}$</div> ${item.dataset.sale}`;
        }
        else{
           return `${item.dataset.price}`;
        }
    }
}

function quickShowBox() {
    document.querySelectorAll('.listing').forEach(listing => {
        listing.addEventListener('mouseover', hoveringItem);
        listing.addEventListener('mouseleave', hideHoveringItem);
    });
}

function showMore(e){
    let elem = '';

    e.stopPropagation();
    e.preventDefault();

    if(e.target.className !== 'containerElem'){
        if(e.target.nodeName === 'DIV'){
            elem = e.target.parentNode;
        }
        else{
            elem = e.target.parentNode.parentNode;
        }
    }
    else{
        elem = e.target;
    }

    if(elem.children[0].children[0].textContent === 'arrow_drop_down'){
        showMoreContent(elem);
    }
    else if(elem.children[0].children[0].textContent === 'arrow_drop_up'){
        hideContent(elem)
    }

    if(document.querySelector('#priceFilter') !== null){
        document.querySelector('#priceFilter').addEventListener('click', priceFilter);
    }

    document.querySelectorAll('.specifyItem div').forEach( item => item.addEventListener('click', specifyItem));
    document.querySelectorAll('.choosedBrand').forEach( li => li.addEventListener('click', filterItems));
}

function showMoreContent(elem){
    let content = '';

    elem.style.flexDirection = 'column';

    if (elem.id === 'designer') {
        document.querySelector('#containerMenuBox').style.height = 'auto';
        document.querySelector('#designer').style.cursor = 'default';
        content = showDesigners();
    }
    else if (elem.id === 'menuPrize') {
        document.querySelector('#menuPrize').style.cursor = 'default';
        content = showMenuPrize()
    }

    elem.innerHTML += content;
    elem.children[0].children[0].textContent = 'arrow_drop_up';

    document.querySelector('#designer div').addEventListener('click', showMore);
    document.querySelector('#menuPrizeTitle').addEventListener('click', showMore);
}

function hideContent(elem){
    let content = '';
    let name = '';

    elem.style.flexDirection = 'row';

    if (document.querySelectorAll('.choosedBrand') === null) {
        document.querySelector('#containerMenuBox').style.height = '100vh';
    }

    if (elem.id === 'category') {
        name = 'Kategoria'
    }
    else if (elem.id === 'designer') {
        name = 'Projektant'
    }
    else if (elem.id === 'menuPrize') {
        name = 'Cena'
    }

    if (name === 'Kategoria') {
        document.querySelectorAll('.specifyItem').forEach(item => item.style.cursor = 'pointer');
        content = `<div>${name} <i style="font-size:30px;" class="material-icons">arrow_drop_down</i></div>`;
    }
    else if (name === 'Projektant') {
        document.querySelector('#designer').style.cursor = 'pointer';
        content = `<div id="designerWrap">${name} <i style="font-size:30px;" class="material-icons">arrow_drop_down</i></div>`;
    }
    else if (name === 'Cena') {
        document.querySelector('#menuPrize').style.cursor = 'pointer';
        content = `<div id="menuPrizeTitle">${name} <i style="font-size:30px;" class="material-icons">arrow_drop_down</i></div>`;
    }

    elem.innerHTML = content;
    elem.children[0].children[0].textContent = 'arrow_drop_down';

    document.querySelector('#designer div').addEventListener('click', showMore);
    document.querySelector('#menuPrizeTitle').addEventListener('click', showMore);
}

function showDesigners(){
    return `<ul class="subMenu" id="designersList">
        <li class="specifyItem choosedBrand">Alexander McQueen</li>
        <li class="specifyItem choosedBrand">Balenciaga</li>
        <li class="specifyItem choosedBrand">Bally</li>
        <li class="specifyItem choosedBrand">Balmain</li>
        <li class="specifyItem choosedBrand">Burberry</li>
        <li class="specifyItem choosedBrand">Dior</li>
        <li class="specifyItem choosedBrand">Dolce & Gabanna</li>
        <li class="specifyItem choosedBrand">Fendi</li>
        <li class="specifyItem choosedBrand">Givenchy</li>
        <li class="specifyItem choosedBrand">Gucci</li>
        <li class="specifyItem choosedBrand">Kenzo</li>
        <li class="specifyItem choosedBrand">Lanvin</li>
        <li class="specifyItem choosedBrand">MCM</li>
        <li class="specifyItem choosedBrand">Moncler</li>
        <li class="specifyItem choosedBrand">OFF-WHITE</li>
        <li class="specifyItem choosedBrand">Phillip Plein</li>
        <li class="specifyItem choosedBrand">Prada</li>
        <li class="specifyItem choosedBrand">Saint Laurent</li>
        <li class="specifyItem choosedBrand">Tom Ford</li>
        <li class="specifyItem choosedBrand">Versace Collection</li>
    </ul>`
}

function showMenuPrize(){
    return `<div>Od</div>
        <div>
            <input class="priceInput" id="from" type="text" value="0"> 
        </div>
        <div>Do</div> 
        <div>
            <input class="priceInput" id="upTo" type="text" value="${getMostExpensiveItem()}">
        </div>
        <div id="priceFilter">
            Filtruj
        </div>`
}

function specifyItem(e) {
    let target;

    e.stopPropagation();
    e.preventDefault();
    
    if(e.target.nodeName === 'I'){
        target = e.target.parentNode;
    }
    else{
        target = e.target;
    }

    if (target.nodeName !== 'DIV') {
        return;
    }

    if (target.children[0].textContent.includes('up')) {
        hideItemsList(target);
    }
    else {
        showItemsList(target);
    }
    
    document.querySelectorAll('.specifyItem').forEach(item => item.style.cursor = 'default');
}

function showItemsList(target){
    target.parentNode.style.flexDirection = 'column';
    
    if (target.textContent.includes('Ubrania')) {
        target.children[0].textContent = target.children[0].textContent.replace('down', 'up');
        target.parentNode.innerHTML +=
            `<ul class="specifedItems">
                <li class="choosedItemCategory">T-shirty i koszulki Polo</li>
                <li class="choosedItemCategory">Swetry i bluzy</li>
                <li class="choosedItemCategory">Kurtki i marynarki</li>
                <li class="choosedItemCategory">Koszule i garnitury</li>
                <li class="choosedItemCategory">Spodnie</li>
            </ul>`
    }
    else if (target.textContent.includes('Buty')) {
        target.children[0].textContent = target.children[0].textContent.replace('down', 'up');
        target.parentNode.innerHTML +=
            `<ul class="specifedItems">
                <li class="choosedItemCategory">Sneakersy</li>
                <li class="choosedItemCategory">Obuwie wysokie</li>
                <li class="choosedItemCategory">Obuwie eleganckie</li>
            </ul>`
    }
    else if (target.textContent.includes('Akcesoria')) {
        target.children[0].textContent = target.children[0].textContent.replace('down', 'up');
        target.parentNode.innerHTML +=
            `<ul class="specifedItems">
                <li class="choosedItemCategory">Czapki</li>
                <li class="choosedItemCategory">Okulary</li>
                <li class="choosedItemCategory">Plecaki</li>
                <li class="choosedItemCategory">Paski</li>
            </ul>`
    }

    document.querySelectorAll('.choosedItemCategory').forEach(li => li.addEventListener('click', filterItems));
}

function hideItemsList(target){
    let item = null;

    if(target.textContent.includes('Ubrania')){
        item = 'Ubrania';
    }
    else if(target.textContent.includes('Buty')){
        item = 'Buty';
    }
    else if(target.textContent.includes('Akcesoria')){
        item = 'Akcesoria';
    }

    target.parentNode.innerHTML = `<div>${item} <i style="font-size:24px;color:#ff1a1a;" class="material-icons">arrow_drop_down</i></div>`;
    target.style.flexDirection = 'row';
}

function getMostExpensiveItem(){
    let prices = [];
    document.querySelectorAll('.listing').forEach( listing => prices.push(listing.dataset.price));

    if(prices.length === 0){
        prices.push(0);
    }

    return `${Math.max.apply(Math, prices)}`;
}

function priceFilter(){
    let filteredPrice = [];
    let from = document.querySelector('#from').value;
    let upTo = document.querySelector('#upTo').value;

    if(upTo === '' && from === ''){
        //If both inputs are empty
        return filterSex();
    }
    else if(upTo === ''){
        //If the max price input is empty
        items.forEach(item => {
            if(item.price >= parseInt(from)){
                if(item.sex === filteredSex){
                    filteredPrice.push(item)
                }
            }
        });
    }
    else{
        //If both inputs are filled
        items.forEach(item => {
            if(item.price >= parseInt(from) && item.price <= parseInt(upTo)){
                if(item.sex === filteredSex){
                    filteredPrice.push(item)
                }
            }
        });
    }
    
    generateListings(filteredPrice);
}

function showFavourites(){
    let data;
    const popup = document.createElement('div');
    const overlayer = document.createElement('div');

    //Create local arr to not edit a global one
    if (localStorage.getItem('favourite') === null) {
        data = [];
        favourites.forEach( fav => data.push(fav));
    }
    else {
        data = JSON.parse(localStorage.getItem('favourite'));
    }
    
    overlayer.id = 'overlayer';
    popup.id = 'favouriteBox';

    document.body.style.overflow = 'hidden';

    popup.innerHTML = 
          `<div id="closeFavourites">
                <i id="closeFav" style="font-size:35px" class="material-icons">close</i>
            </div>
            <div>
                <h1>Twoje ulubione przedmioty</h1>
            </div>`;

    document.body.append(overlayer, popup);

    renderFavouriteBox(data, popup);

    document.querySelector('#closeFavourites').addEventListener('click', () => closeFavourites(popup, overlayer));
    fixFavouritesBox();
}

function closeFavourites(popup, overlayer){
    document.body.style.overflowY = 'scroll';
    popup.remove();
    overlayer.remove();
}

function fixFavouritesBox(){
    if(favourites.length < 3){
        document.querySelector('html').style.scrollBehaviour = 'smooth';
        window.scrollTo(0, 0);
        document.body.style.overflowY = 'hidden';
        document.querySelector('#favouriteBox').style.top = '50%';
        document.querySelector('#favouriteBox').style.transform = 'translateX(-50%) translateY(-50%)';
    }
    else{
        document.body.style.overflowY = 'scroll';
        document.querySelector('#favouriteBox').style.top = '10%';
        document.querySelector('#favouriteBox').style.transform = 'translateX(-50%)';
    }
}

function renderFavouriteBox(data, popup){
    if(data.length > 0){
        data.forEach( fav => {
            document.querySelector('#favouriteBox').innerHTML += 
                `<div class="favItem">
                    <div id="favItemBox">
                        <div id="favItemInfo">
                            <div id="favBrand">
                                ${fav.brand}
                            </div>
                            <div id="favName">
                                ${fav.name}
                            </div>
                        </div>
                        <img src='../img/cloths/${fav.src}'>
                    </div>
                    <div class="favProductBtn">
                        <div class="favRemove">Usuń przedmiot</div>
                        <div class="favProduct">Zobacz przedmiot</div>
                    </div>
                 </div>`
        });
        
        document.querySelectorAll('.favProduct').forEach(item => item.addEventListener('click', goToFavouriteProductPage));
        document.querySelectorAll('.favRemove').forEach(remove => remove.addEventListener('click', removeFavouriteItem));
    }
    else{
        popup.innerHTML += `<div id="noFavs">Nie masz żadnych ulubionych przedmiotów</div>`
    }
}

function goToFavouriteProductPage(e){
    let productSrc = e.target.parentNode.previousSibling.previousSibling.children[1].src;

    favourites.forEach(item => {
        if(productSrc.includes(item.src)){
            //Save in storage product and href to product page
            sessionStorage.setItem('product', JSON.stringify(item));
            window.location.href = '../html/product.html';
        }
    });
}

function removeFavouriteItem(e){
    let item = null;

    for(let i = 0; i < favourites.length; i++){
        if(favourites[i].brand === e.target.parentNode.previousSibling.previousSibling.children[0].children[0].textContent.trim() && favourites[i].name === e.target.parentNode.previousSibling.previousSibling.children[0].children[1].textContent.trim()){
            favourites.splice(i, 1);
            document.querySelectorAll('.favItem')[i].remove();
            break;
        }
    }

    localStorage.setItem('favourite', JSON.stringify(favourites));

    if(favourites.length === 0){
        document.querySelector('#favouriteBox').innerHTML += `<div id="noFavs">Nie masz żadnych ulubionych przedmiotów</div>`;
        document.querySelector('#closeFavourites').addEventListener('click', () => closeFavourites(document.querySelector('#favouriteBox'), document.querySelector('#overlayer')));
    } 
    
    changeFavouriteColor();
    fixFavouritesBox();
}

function checkStorageForCart(){
    if (localStorage.getItem('cart') !== null ){
        let data = JSON.parse(localStorage.getItem('cart'));
        while(data.length !== cart.length){
            //Unpack storage cart to the global one
            data.forEach(item => cart.push(item))
        }
    }
}

function showCart(){
    const popup = document.createElement('div');
    const overlayer = document.createElement('div');

    overlayer.id = 'overlayer';
    popup.id = 'popup';

    if(document.querySelector('#overlayer') === null){
        document.body.appendChild(overlayer);
    }

    document.body.appendChild(popup);

    popup.innerHTML +=
        `<div id="cartInformation">
            <div>Koszyk</div>
            <i id="closeCart" style="font-size:35px" class="material-icons">close</i>
         </div>`;

    if (cart.length > 0 && cart !== null) {
        let fullPrice = 0;

        createCartBox(popup);
        fullPrice = calculateCartFullPrice(fullPrice);
            
        popup.innerHTML += `<div id="fullPrice">Razem do zapłaty ${fullPrice}$</div>`;

        if(document.querySelector('.deleteItem') !== null){
            document.querySelectorAll('.deleteItem').forEach( deleteItem => deleteItem.addEventListener('click', (e) => removeItemFromCart(e)));
        }
    }
    else{
        popup.innerHTML += 
            `<div id="emptyCart">
                Twój koszyk jest pusty
             </div>`
    }

    fixBiggerCart();
    document.querySelector('#closeCart').addEventListener('click', closeCart);
}

function createCartBox(popup){
    let counter = 0;

    cart.forEach(item => {
        popup.innerHTML +=
        `<div id="addedItem" data-id="${item.id}">
            <div id="addedItemFlex">
                <div id="addedItemInfo">
                    <div>${item.brand}</div>
                    ${item.name}
                </div>
                <img style="object-fit: scale-down;" width="100px" height="100px" src='../img/cloths/${item.src}'>
            </div>
            <div class="addedItemInfoWrap"></div>
            <div id="addedItemPrice">
                Do zapłaty: ${makeDoubles(item)}
            </div>
        </div>`
    });

    document.querySelectorAll('.addedItemInfoWrap').forEach( addedItem => {
        checkSizes(addedItem);
        addedItem.style.flexDirection = 'column';
    });
}

function checkSizes(addedItem){
    let sizes = null;
    let itemID = addedItem.parentNode.dataset.id

    cart.forEach(item => {
        if (item.id === itemID) {
            if (item.doubles > 1) {
                sizes = item.sizes.split(' ');
                createNewSizesForItem(item, sizes, addedItem);
            }
            else {
                addedItem.innerHTML =
                    `<div class="multipleSizes">
                         <div class="addedItemInfo">${item.color}</div>
                         <div class="addedItemInfo">${item.sizes}</div>
                         <div class="deleteItem">
                             Usuń przedmiot
                         </div>
                    </div>`
            }
        }
    });
}

function createNewSizesForItem(item, sizes, addedItem){
    sizes.forEach( size => {
        addedItem.innerHTML +=  
            `<div class="multipleSizes">
                <div class="addedItemInfo">${item.color}</div>
                <div class="addedItemInfo">${size}</div>
                <div class="deleteItem">
                    Usuń przedmiot
                </div>
            </div>`
    });
}

function closeCart(){
    document.body.style.overflowY = 'scroll';
    document.querySelector('#popup').remove()
    document.querySelector('#overlayer').remove()
}

function fixBiggerCart(){
    //If in the cart is more than four items it's styles should change to be fully visible
    if(cart.length < 3){
        document.querySelector('html').style.scrollBehaviour = 'smooth';
        window.scrollTo(0, 0);
        document.body.style.overflowY = 'hidden';
        document.querySelector('#popup').style.top = '50%';
        document.querySelector('#popup').style.transform = 'translateX(-50%) translateY(-50%)';
    }
    else{
        document.body.style.overflowY = 'scroll';
        document.querySelector('#popup').style.top = '10%';
        document.querySelector('#popup').style.transform = 'translateX(-50%)';
    }
}

function calculateCartFullPrice(price){
    //Calculate full price of all items
    cart.forEach(item => {
        if(item.sale === "null" || item.sale === undefined){
            price += parseInt(item.price * item.doubles);
        }
        else{
            price += parseInt(item.sale * item.doubles);
        }
    });

    return price
}

function makeDoubles(item){
    if(item.doubles > 1){
        if(item.sale === "null" || item.sale === undefined){
            return `${item.price} <span class="doubles">x${item.doubles}</span>`
        }
        else{
            return `<span style="text-decoration: line-through;color:#ff1a1a">${item.price}$</span><span style="margin-left:10px">${item.sale}$</span> <span class="doubles">x${item.doubles}</span>`
        }
    }
    else{
        if(item.sale === "null" || item.sale === undefined){
            return `<span>${item.price}$</span>`
        }
        else{
            return `<span style="text-decoration: line-through;color:#ff1a1a">${item.price}$</span><span style="margin-left:10px">${item.sale}$</span>`
        }
    }
}

function removeItemFromCart(e){
    let newCart = [];

    //Filter all items without one that was deleted to new array
    cart.forEach(item => {
        if (item.id === e.target.parentNode.parentNode.parentNode.dataset.id) {
            if(item.doubles > 1){
                let searchingSize = [];
                let newSizes = [];
                let deletedSize = e.target.previousSibling.previousSibling.textContent.trim();

                //If item that was going to be deleted was multiple times in cart change it's quantity
                item.doubles--;

                item.sizes.split(' ').forEach( size => {
                    if(size === deletedSize){
                        searchingSize.push(size);
                    }
                });

                for(let i = 0; i < searchingSize.length - 1; i++){
                    newSizes.push(searchingSize[i])
                }

                item.sizes.split(' ').forEach( size => {
                    if(size !== deletedSize){
                        newSizes.push(size);
                    }
                });

                item.sizes = newSizes.join(' ');
                newCart.push(item);
            }
        }
        else{
            newCart.push(item);
        }
    });

    clearArr(cart);

    newCart.forEach(item => cart.push(item));

    popup.remove();
    addToStorage(cart);
    createItemsInCartBall();

    return showCart();
}

function addToStorage(data){
    localStorage.setItem('cart', JSON.stringify(data))
}

function switchImages(e){
    let direction = '';
    let eventTarget;

    e.target.nodeName !== 'DIV' ? eventTarget = e.target.parentNode : eventTarget = e.target;
    eventTarget.id === 'arrowRight' ? direction = 'right' : direction = 'left';
    
    if(document.querySelector('#imageBox img').src.includes('2') && direction === 'left'){
        document.querySelector('#imageBox img').src = document.querySelector('#imageBox img').src.replace('_2', '');
    }
    else if(/[a-zA-Z].jpg$/.test(document.querySelector('#imageBox img').src) && direction === 'right'){
        
        document.querySelector('#imageBox img').src = document.querySelector('#imageBox img').src.replace('.jpg', '_2.jpg');
    }
}

function closeShowcase(){
    document.querySelector('#itemShowcase').remove();
    document.querySelector('#overlayer').remove();
    document.body.style.overflowY = 'scroll';
}

function hoveringItem(e){
    if (document.querySelector('#quickShow') === null) {
        let item = '';
        const quickShow = document.createElement('div');

        quickShow.id = 'quickShow'
        quickShow.textContent = 'Quick Show'
        e.target.nodeName !== 'DIV' ? item = e.target.parentNode : item = e.target;

        item.appendChild(quickShow);
        quickShow.addEventListener('click', quickShowing)
    }
}

function hideHoveringItem(e){
    let item = '';
    e.target.nodeName !== 'DIV' ? item = e.target.parentNode : item = e.target;
    document.querySelector('#quickShow').remove();
}

function quickShowing(e){
    if(document.querySelector('#itemShowcase') === null){
        let itemSrc = '';
        let item = '';
        const overlayer = document.createElement('div');
        const itemBox = document.createElement('div');

        e.target.id === 'quickShow' ? item = e.target.parentNode : item = e.target.parentNode.parentNode;
        overlayer.id = 'overlayer';
        itemSrc = item.children[0].src;

        createItemBox(itemSrc, itemBox, item);

        itemBox.id = 'itemShowcase';
        document.body.style = 'overflow:hidden';
        document.body.append(itemBox, overlayer);

        pickItemAddColorAndSizes(item)

        document.querySelector('#addToCartBtn').addEventListener('click', addToCart);
        document.querySelector('#addToFav').addEventListener('click', addToFav);
        document.querySelector('#close').addEventListener('click', closeShowcase);
        document.querySelectorAll('.arrow').forEach( arrow => arrow.addEventListener('click', switchImages) );

        checkIfItemIsFavourite();
    }    
}

function createItemBox(itemSrc, itemBox, item){
    itemBox.innerHTML =
        `<div data-id="${item.dataset.id}" id="productInfo">
                <div id="nameBox">
                    <div id="brand">${item.dataset.brand}</div> 
                    <div id="name">${item.dataset.name}</div>
                </div>
                <div id="quickShowMenu">
                    <div id="addToFav"><i class="fa fa-heart"></i></div>
                    <div id="close"><i style="font-size:35px" class="material-icons">close</i></div>
                </div>
             </div>
             <div id="imageBox">
                <div id="arrowLeft" class="arrow">
                    <i class="material-icons" style="font-size:56px">keyboard_arrow_left</i>
                </div>
                <img src='${itemSrc}'>
                <div id="arrowRight" class="arrow">
                    <i class="material-icons" style="font-size:56px">keyboard_arrow_right</i>
                </div>
             </div>
             <div id="buyingInfo">
                <div id="buyingInfoWrap">
                    <div class="selectWrap">
                        <select id="color"></select>
                    </div>
                    <div id="prize">
                        ${viewSalePrice(document.querySelector('#buyingInfo'), item)}$
                    </div>
                    <div class="selectWrap">
                        <select id="size"></select>
                    </div>
                </div>
                 <div id="addToCartBtn">
                    Add to Cart
                 </div>
             </div>`;
}

function pickItemAddColorAndSizes(editingItem){
    items.forEach( item => {
        if(item.id === editingItem.dataset.id){
            addColorAndSizes(item)
        }
    });
}

function addColorAndSizes(item){
    document.querySelector('#color').innerHTML = `<option>${item.color}</option>`;
    JSON.parse(item.sizes).forEach( size => document.querySelector('#size').innerHTML += `<option>${size}</option>`);
}

function checkIfItemIsFavourite(){
    items.forEach(item => {
        if(document.querySelector('#productInfo').dataset.id === item.id){
            favourites.forEach(fav => {
                if(item.id === fav.id ){
                    //Change color of icon if item is in favourite array
                    document.querySelector('#addToFav').style.color = '#ff1a1a';
                }
            });
        }
    });
}

function generateListings(itemsArr){
    if(filteredSex === null){
        if(filteredBrand === null){
            clearArr(itemsArr);
            items.forEach( item => itemsArr.push(item));
        }
    }

    document.querySelector('#listings').innerHTML = '';

    for(let i = 0; i < itemsArr.length; i++){
        document.querySelector('#listings').innerHTML += 
            `<div data-id="${itemsArr[i].id}" data-sale="${itemsArr[i].sale}" data-sex="${itemsArr[i].sex}" class="listing" data-name="${itemsArr[i].name}" data-brand="${itemsArr[i].brand}" data-price="${itemsArr[i].price}">
                <img style="object-fit: scale-down;" width="250px" height="250px" src="../img/cloths/${itemsArr[i].src}">
            </div>`;
    }

    productFullpage();
    makeNewPage();
    return quickShowBox();
}

function makeNewPage(){
    let nextPageListings = [];
    let sameSexItems = [];

    document.querySelectorAll('.listing').forEach(listing => {
        if(listing.dataset.sex === filteredSex){
            sameSexItems.push(listing)
        }
    });

    //Items with id more than 20 move to new array to be loaded on new page
    if(sameSexItems.length > 20){
        document.querySelectorAll('.listing').forEach(listing => {
            if(parseInt(listing.dataset.id) > 20){
                listing.remove();
                nextPageListings.push(makeItemFromListing(listing));
            }
        });
    }
    
    sessionStorage.setItem('nextPageListings', JSON.stringify(nextPageListings));
}

function makeItemFromListing(listing){
    return new Item(listing.dataset.id, listing.dataset.brand, listing.dataset.name, listing.dataset.price, listing.children[0].src.split('/')[listing.children[0].src.split('/').length - 1], listing.dataset.sex, listing.dataset.type, listing.dataset.sale, 1, listing.dataset.color)
}

function filterItems(e, filterAgain){
    let filter;

    if(filterAgain === undefined){
        filter = e.target.textContent.trim();
        if(e.target.classList[0] === "choosedItemCategory"){
            //CATEGORY
            if(filterAgain === undefined){
                filteredCategory.push(filter);
                createFilterBox(filter, 'category')
            }
        }
        else if(e.target.classList[1] === "choosedBrand"){
            //BRAND 
            if(filterAgain === undefined){
                filteredBrand.push(filter);
                createFilterBox(filter, 'brand')
            }
        }
    }

    clearArr(filteredItems);

    if(filteredBrand.length === 0 && filteredCategory.length === 0){
        //If both filters are empty
        return filterSex();
    }
    else{
        actualFilteringItems();
    }
    
    return generateListings(filteredItems)
}

function actualFilteringItems(){
    //If there is filtered brand and category
    if(filteredBrand.length > 0 && filteredCategory.length > 0){
        items.forEach(item => {
            filteredCategory.forEach(category => {
                filteredBrand.forEach(brand => {
                    if(item.brand === brand && item.type.includes(category.toLowerCase()) && item.sex === filteredSex){
                        filteredItems.push(item)
                    }
                });
            });
        });
    }
    //If there is only filtered category
    else if(filteredBrand.length === 0 && filteredCategory.length > 0){
        items.forEach(item => {
            filteredCategory.forEach(category => {
                if(item.type.includes(category.toLowerCase()) && item.sex === filteredSex){
                    filteredItems.push(item)
                }
            });
        });
    }
    //If there is only filtered brand
    else if(filteredBrand.length > 0 && filteredCategory.length === 0){
        items.forEach(item => {
            filteredBrand.forEach(brand => {
                if(item.brand === brand && item.sex === filteredSex){
                    filteredItems.push(item)
                }
            });
        });
    }
}

function removeFilter(e){
    let designerBox = document.querySelector('#designerBox');
    let removedFilter;
    let filterBoxes = document.querySelectorAll('.activeFilter');


    if(e.target.nodeName === 'I'){
        removedFilter = e.target.previousSibling.previousSibling.textContent.trim();
    }
    else if(e.target.nodeName === 'SPAN'){
        removedFilter = e.target.textContent.trim();
    }
    else{
        removedFilter = e.target.children[0].children[0].textContent.trim();
    }

    filterBoxes.forEach(box => {
        if(box.textContent.trim().includes(removedFilter)){
            if (box.dataset.type === 'category') {
                //Remove category
                removeFromArray(filteredCategory, removedFilter)
            }
            else if (box.dataset.type === 'brand') {
                //Remove brand
                removeFromArray(filteredBrand, removedFilter)
            }
            box.remove();
        }
    });

   filterItems(undefined, true)
   productFullpage();
}

function removeFromArray(arr, item){
    let newArr = [];
    
    arr.forEach( filter => {
        if(filter !== item){
            newArr.push(filter)
        }
    });

    clearArr(arr);
    newArr.forEach(filter => arr.push(filter));
}

function clearArr(arr){
    while(arr.length > 0){
        arr.pop();
    }
}

function checkForDoubles(){
    let withoutDoubles = [];

    filteredItems.forEach( item => {
        if(!withoutDoubles.includes(item)){
            withoutDoubles.push(item);
        }
    });

    clearArr(filteredItems);
    withoutDoubles.forEach( item => filteredItems.push(item));
}

function createFilterBox(filter, data){
    let filterText = null;
    const filterBox = document.createElement('div');

    filterBox.className = 'activeFilter';
    filterBox.dataset.type = data;
    
    filterBox.innerHTML = 
        `<div class="closeFilterBox">
            <span>${filter}</span>
            <i style="font-size:20px" class="material-icons">close</i>
         </div>`;

    document.querySelector('#filterBox').appendChild(filterBox)
    filterBox.addEventListener('click', removeFilter);
}

function addToFav(e){
    let target;
    let item;
    let checked;

    e.target.nodeName !== 'I' ? target = e.target : target = e.target.parentNode;
    checked = checkFavs(target);

    //If item was already in favourites array delete it
    if(checked){
        return deleteFavItem(target)
    }

    if(target.id !== 'productFav' && target.parentNode.id !== 'productFav'){
        let id = target.parentNode.parentNode.dataset.id;
        target.style.color = '#ff1a1a';

        //Add to favourites array new item from quick show menu
        items.forEach(addedItem => {
            if(addedItem.id === id){
                item = addedItem;
            }
        });
    }
    else{
        //Add to favourites array new item from product page
        let id = document.querySelector('#productInfoBox').dataset.id;
        let productExist = productFavouritExistCheck(id);

        if(productExist){
            return;
        }

        item = JSON.parse(sessionStorage.getItem('product'));
    }

    favourites.push(item);
    localStorage.setItem('favourite', JSON.stringify(favourites));
    changeFavouriteColor();
}

function productFavouritExistCheck(id){
    let exist = false;

    favourites.some( fav => {
        if(fav.id === id){
            exist = true;
        }
    });

    return exist
}

function deleteFavItem(target){
    let newFavourites = [];
    target.style.color = '#000';

    favourites.forEach( fav => {
        if(fav.id !== document.querySelector('#productInfo').dataset.id){
            newFavourites.push(fav)
        }
    });

    clearArr(favourites)

    if (newFavourites.length > 0) {
        newFavourites.forEach(newFav => favourites.push(newFav));
    }

    localStorage.setItem('favourite', JSON.stringify(favourites));

    changeFavouriteColor();
    return;
}

function checkFavs(target){
    let checking = 0;

    favourites.forEach( item => {
        if(item.id === target.parentNode.parentNode.dataset.id){
            checking++;
        }
    });

   return checking > 0 ? true : false;
}

function changeFavouriteColor(){
    //Change favourite icon color depend of favourites array length
    if(favourites.length > 0){
        document.querySelector('#favourite').style.color = '#ff1a1a';
    }
    else{
        document.querySelector('#favourite').style.color = '#000';
    }
}

function addToCart(e){
    let item = {};
    
    if(e.target.id !== 'productBuy' && e.target.parentNode.id !== 'productBuy'){
        let id = e.target.parentNode.parentNode.children[0].dataset.id;
        addToCartQuickShowing(id, item);
    }
    else{
        let id = e.target.parentNode.parentNode.parentNode.dataset.id;
        addToCartProductPage(id, item);
    }
     
    addToStorage(cart);
    createItemsInCartBall();
}

function addToCartQuickShowing(id, item){
    let exist = checkIfItemExist(id);
    if(exist){
        items.forEach( availableItem => {
            if(availableItem.id === id){
                    item = new Item(
                        availableItem.id,
                        availableItem.brand,
                        availableItem.name,
                        availableItem.price,
                        availableItem.src,
                        availableItem.sex,
                        availableItem.type,
                        availableItem.sale,
                        1,
                        document.querySelector('#color').value, 
                        document.querySelector('#size').value
                    );
            } 
        });

        cart.push(item);
    }
    else{
        multipleItem(item, id);
    }
}

function addToCartProductPage(id, item){
    let exist = checkIfItemExist(id);
    //id, brand, name, price, src, sex, type, sale, doubles, color, sizes
    if(exist){
        //If item isn't in cart create it and add
        item = new Item(
            document.querySelector('#productInfoBox').dataset.id,
            document.querySelector('#productBrand').textContent,
            document.querySelector('#productName').textContent,
            '',
            document.querySelector('#productImageBox img').src.split('/')[document.querySelector('#productImageBox img').src.split('/').length - 1],
            document.querySelector('#productInfoBox').dataset.sex,
            document.querySelector('#productInfoBox').dataset.type,
            '',
            1,
            document.querySelector('#color').value, 
            document.querySelector('#size').value
        );

        item.sale = checkForProductSale();
        item.price = checkForProductPrice();
        cart.push(item);
    }
    else{
        multipleItem(item, id);
    }
}

function checkForProductSale(){
    if(document.querySelector('.productPrice').textContent.split(' ').length > 1){
        return document.querySelector('.productPrice').textContent.split(' ')[1].slice(0, -1)
    }
    else{
        return 'null';
    }
}

function checkForProductPrice(){
    if(document.querySelector('.previousPrice') !== null){
        return document.querySelector('.previousPrice').textContent.slice(0, -1);
    }
    else{
        return document.querySelector('.productPrice').textContent.slice(0, -1);
    }
}

function multipleItem(item, id){
    //If item is already in cart multiply it
    cart.forEach(item => {
        if(item.id === id){
          item.doubles = doubleItem(id);
          item.sizes += ` ${document.querySelector('#size').value}`;
        } 
     });
}

function checkIfItemExist(itemID){
    return cart.every(item => item.id !== itemID)
}

function doubleItem(itemID){
    let counter = 1;
    
    //Calculate how many times one item is in cart
    cart.forEach(item => {
        if(item.id === itemID){
            if(item.doubles !== undefined){
                counter = item.doubles;
                counter++;
            }
            else{
                counter++;
            }
        }
    });

    return counter;
}

function createItemsInCartBall(){
    let ball = document.createElement('div');
    ball.id = 'cartItemsNumber';

    if(document.querySelector('#cartItemsNumber') === null && cart.length > 0){
        document.querySelector('#cart').appendChild(ball);
        fillCartBall();
    }
    else if(document.querySelector('#cartItemsNumber') !== null && cart.length > 0){
        fillCartBall();
    }
    else{
        if(document.querySelector('#cartItemsNumber') !== null){
            document.querySelector('#cartItemsNumber').remove();
        }
    }
}

function fillCartBall(){
    let all = 0;

    cart.forEach(item => {
        if (item.doubles > 1) {
            all += item.doubles;
        }
        else {
            all++;
        }
    });

    //Add a little ball with number of cart length
    document.querySelector('#cartItemsNumber').textContent = all;
}

function rand(num){
    //Return random number
    return Math.floor(Math.random() * num) + 1;
}

function gettingCloths() {
    let divs = '';
    let combination = new Set();
    let cloth = '';
    let sex = '';
    let type = '';

    if (document.querySelector('#listings') !== null) {
        document.querySelector('#listings').innerHTML = '';
        for (let i = 1; i <= 35; i++) {
            switch (i) {
                case 1:
                    cloth = 'balenciaga_jacket';
                    type = 'kurtki i marynarki';
                    sex = 'man';
                    break;
                case 2:
                    cloth = 'bally_belt';
                    type = 'paski';
                    sex = 'man';
                    break;
                case 3:
                    cloth = 'burberry_pants';
                    type = 'spodnie';
                    sex = 'man';
                    break;
                case 4:
                    cloth = 'dior_tshirt';
                    type = 't-shirty i koszulki polo';
                    sex = 'man';
                    break;
                case 5:
                    cloth = 'fendi_jacket';
                    type = 'kurtki i marynarki';
                    sex = 'man';
                    break;
                case 6:
                    cloth = 'ford_sweater';
                    type = 'swetry i bluzy';
                    sex = 'man';
                    break;
                case 7:
                    cloth = 'gabanna_sunglasses';
                    type = 'akcesoria';
                    sex = 'woman';
                    break;
                case 8:
                    cloth = 'gucci_cap';
                    type = 'czapki';
                    sex = 'man';
                    break;
                case 9:
                    cloth = 'gucci_sneakers';
                    type = 'sneakersy';
                    sex = 'man';
                    break;
                case 10:
                    cloth = 'mcm_backpack';
                    type = 'plecaki';
                    sex = 'man';
                    break;
                case 11:
                    cloth = 'plein_sweatshirt';
                    type = 'swetry i bluzy';
                    sex = 'man';
                    break;
                case 12:
                    cloth = 'balenciaga_tshirt';
                    type = 't-shirty i koszulki polo';
                    sex = 'man';
                    break;
                case 13:
                    cloth = 'versace_shirt';
                    type = 'koszule i garnitury';
                    sex = 'man';
                    break;
                case 14:
                    cloth = 'balmain_jacket';
                    type = 'kurtki i marynarki';
                    sex = 'man';
                    break;
                case 15:
                    cloth = 'balmain_shoes';
                    type = 'obuwie wysokie';
                    sex = 'woman';
                    break;
                case 16:
                    cloth = 'burberry_jacket';
                    type = 'kurtki i marynarki';
                    sex = 'man';
                    break;
                case 17:
                    cloth = 'prada_jacket';
                    type = 'kurtki i marynarki';
                    sex = 'woman';
                    break;
                case 18:
                    cloth = 'dolcegabanna_jacket';
                    type = 'kurtki i marynarki';
                    sex = 'woman';
                    break;
                case 19:
                    cloth = 'fendi_pants';
                    type = 'spodnie';
                    sex = 'woman';
                    break;
                case 20:
                    cloth = 'fendi_tshirt';
                    type = 't-shirty i koszulki polo';
                    sex = 'man';
                    break;
                case 21:
                    cloth = 'givenchy_tshirt';
                    type = 't-shirty i koszulki polo';
                    sex = 'man';
                    break;
                case 22:
                    cloth = 'gucci_hoodie';
                    type = 'swetry i bluzy';
                    sex = 'man';
                    break;
                case 23:
                    cloth = 'gucci_jacket';
                    type = 'kurtki i marynarki';
                    sex = 'man';
                    break;
                case 24:
                    cloth = 'gucci_tshirt';
                    type = 't-shirty i koszulki polo';
                    sex = 'woman';
                    break;
                case 25:
                    cloth = 'mcm_tshirt';
                    type = 't-shirty i koszulki polo';
                    sex = 'woman';
                    break;
                case 26:
                    cloth = 'moncler_jacket';
                    type = 'kurtki i marynarki';
                    sex = 'man';
                    break;
                case 27:
                    cloth = 'offwhite_jacket';
                    type = 'kurtki i marynarki';
                    sex = 'man';
                    break;
                case 28:
                    cloth = 'gucci_pants';
                    type = 'spodnie';
                    sex = 'woman';
                    break;
                case 29:
                    cloth = 'versace_tshirt';
                    type = 't-shirty i koszulki polo';
                    sex = 'man';
                    break;
                case 30:
                    cloth = 'gucci_belt';
                    type = 'akcesoria';
                    sex = 'man';
                    break;
                case 31:
                    cloth = 'gucci_sweater';
                    type = 'swetry i bluzy';
                    sex = 'kid';
                    break;
                case 32:
                    cloth = 'burberry_shirt';
                    type = 'koszule i garnitury';
                    sex = 'kid';
                    break;
                case 33:
                    cloth = 'kenzo_sweatshirt';
                    type = 'swetry i bluzy';
                    sex = 'kid';
                    break;
                case 34:
                    cloth = 'mcqueen_sneakers';
                    type = 'sneakersy';
                    sex = 'kid';
                    break;
                case 35:
                    cloth = 'versace_jacket';
                    type = 'kurtki i marynarki';
                    sex = 'kid';
                    break;
            }

            document.querySelector('#listings').innerHTML +=
                `<div data-id="${i}" data-type="${type}" data-sex="${sex}" class="listing">
                    <img style="object-fit: scale-down;" width="250px" height="250px" src="../img/cloths/${cloth}.jpg">
                 </div>`;
        }

        quickShowBox();
        return getClothNames();
    }
}

function getClothNames() {
    let productName = '';
    let brandName = '';
    let news = '';
    let prize = '';
    let color = '';
    let sizes = null;
    let sale = null;

    document.querySelectorAll('.listing').forEach(listing => {
        if (listing.dataset.id === '1') {
            brandName = 'Balenciaga'
            productName = 'Black parka jacket'
            prize = '1100';
            color = 'Black';
            sizes = ['S', 'M', 'L', 'XL'];
            sale = 'null';
            news = 'true';
        }
        else if (listing.dataset.id === '2') {
            brandName = 'Bally'
            productName = 'Revelsible red belt'
            color = 'Red';
            sizes = ['85', '90', '95'];
            prize = '150';
            sale = 'null';
            news = 'true';
        }
        else if (listing.dataset.id === '3') {
            brandName = 'Burberry'
            productName = 'Checked pants';
            color = 'Orange';
            sizes = ['M', 'L'];
            prize = '350';
            sale = 'null';
            news = 'true';
        }
        else if (listing.dataset.id === '4') {
            brandName = 'Dior'
            productName = 'White T-shirt with small logo';
            color = 'White';
            sizes = ['XS', 'S'];
            prize = '410';
            sale = 'null';
            news = 'true';
        }
        else if (listing.dataset.id === '5') {
            brandName = 'Fendi'
            productName = 'Winter jacket';
            color = 'Brown';
            sizes = ['M'];
            prize = '3200';
            sale = 'null';
            news = 'true';
        }
        else if (listing.dataset.id === '6') {
            brandName = 'Tom Ford'
            productName = 'Cashmiere sweater'
            prize = '500';
            color = 'Grey';
            sizes = ['L', 'XL'];
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '7') {
            brandName = 'Dolce & Gabanna'
            productName = 'Black sunglasses';
            color = 'Black';
            sizes = ['65'];
            prize = '250';
            sale = 'null';
            news = 'true';
        }
        else if (listing.dataset.id === '8') {
            brandName = 'Gucci'
            productName = 'Cap with monogram';
            color = 'Light brown';
            sizes = ['OS'];
            prize = '420';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '9') {
            brandName = 'Gucci'
            productName = 'White sneakers with snake';
            color = 'White';
            sizes = ['40', '41', '42'];
            prize = '670';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '10') {
            brandName = 'MCM'
            productName = 'Leather backpack with monogram';
            color = 'Orange';
            sizes = ['OS'];
            prize = '825';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '11') {
            brandName = 'Phillip Plein'
            productName = 'Black sweatshirt with big logo';
            color = 'Black';
            sizes = ['L', 'XXL'];
            prize = '1125';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '12') {
            brandName = 'Balenciaga'
            productName = 'Black T-shirt with small logo';
            color = 'Black';
            sizes = ['XS', 'S', 'M'];
            prize = '250';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '13') {
            brandName = 'Versace'
            productName = 'White shirt with Ford logo';
            color = 'White';
            sizes = ['L', 'XL'];
            prize = '550';
            sale = 'null';
            news = 'null';
        }

        else if (listing.dataset.id === '14') {
            brandName = 'Balmain'
            productName = 'Black jacket';
            color = 'Black';
            sizes = ['S', 'XL'];
            prize = '1500';
            sale = 'null';
            news = 'true';
        }
        else if (listing.dataset.id === '15') {
            brandName = 'Balmain'
            productName = 'Black high heels';
            color = 'Black';
            sizes = ['38', '39'];
            prize = '1700';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '16') {
            brandName = 'Burberry'
            productName = 'Winter jacket';
            color = 'Navy';
            sizes = ['M', 'L'];
            prize = '1300';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '17') {
            brandName = 'Prada'
            productName = 'Prada military jacket';
            color = 'Dark green';
            sizes = ['XL'];
            prize = '4000';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '18') {
            brandName = 'Dolce & Gabanna'
            productName = 'Flowerly jacket'
            color = 'Black';
            sizes = ['S', 'M'];
            prize = '1250';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '19') {
            brandName = 'Fendi'
            productName = 'Brown pants';
            color = 'Brown';
            sizes = ['S'];
            prize = '1300';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '20') {
            brandName = 'Fendi'
            productName = 'Black T-shirt with picture';
            color = 'Black';
            sizes = ['XXS', 'S'];
            prize = '450';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '21') {
            brandName = 'Givenchy'
            productName = 'Black T-shirt with logo';
            color = 'Black';
            sizes = ['M', 'XL'];
            prize = '350';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '22') {
            brandName = 'Gucci'
            productName = 'Black hoodie';
            color = 'Black';
            sizes = ['S', 'XS'];
            prize = '1000';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '23') {
            brandName = 'Gucci'
            productName = 'Black jacket';
            color = 'Black';
            sizes = ['S', 'L'];
            prize = '1700';
            sale = '1500';
            news = 'null';
        }
        else if (listing.dataset.id === '24') {
            brandName = 'Gucci'
            productName = 'White T-shirt with logo';
            color = 'White';
            sizes = ['L', 'XXL'];
            prize = '450';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '25') {
            brandName = 'MCM'
            productName = 'Black T-shirt with logo';
            color = 'Black';
            sizes = ['M', 'L'];
            prize = '350';
            sale = '275';
            news = 'null';
        }
        else if (listing.dataset.id === '26') {
            brandName = 'Moncler'
            productName = 'Quilted jacket';
            color = 'Navy';
            sizes = ['L'];
            prize = '1700';
            sale = '1200';
            news = 'null';
        }
        else if (listing.dataset.id === '27') {
            brandName = 'OFF-WHITE'
            productName = 'Black jacket with big logo';
            color = 'Black';
            sizes = ['XL', 'XXL'];
            prize = '1425';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '28') {
            brandName = 'Gucci'
            productName = 'Pants with classic pattern';
            color = 'Brown';
            sizes = ['XS', 'S'];
            prize = '1050';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '29') {
            brandName = 'Versace'
            productName = 'Black T-shirt with small logo';
            color = 'Black';
            sizes = ['XS'];
            prize = '125';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '30') {
            brandName = 'Gucci'
            productName = 'Gucci belt with classic buckle';
            color = 'Black';
            sizes = ['95'];
            prize = '420';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '31') {
            brandName = 'Gucci'
            productName = 'Gucci sweater with logo';
            color = 'Black';
            sizes = ['128', '176'];
            prize = '220';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '32') {
            brandName = 'Burberry'
            productName = 'Burberry shirt with classic check';
            color = 'Light brown';
            sizes = ['176'];
            prize = '150';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '33') {
            brandName = 'Kenzo'
            productName = 'Kenzo sweatshirt with logo';
            color = 'Navy';
            sizes = ['140', '164'];
            prize = '130';
            sale = 'null';
            news = 'null';
        }
        else if (listing.dataset.id === '34') {
            brandName = 'Alexander McQueen'
            productName = 'Alexander McQueen sneakers';
            color = 'White';
            sizes = ['28', '32'];
            prize = '510';
            sale = 'null';
            news = 'true';
        }
        else if (listing.dataset.id === '35') {
            brandName = 'Versace'
            productName = 'Versace colorfull jacket';
            color = 'Black-yellow';
            sizes = ['140'];
            prize = '450';
            sale = 'null';
            news = 'true';
        }

        listing.dataset.name = productName
        listing.dataset.brand = brandName
        listing.dataset.price = prize
        listing.dataset.sale = sale;
        listing.dataset.news = news;
        listing.dataset.color = color;
        listing.dataset.sizes = JSON.stringify(sizes);
    });

    document.querySelector('#search').style.display = 'flex';
}

// NEWS

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

// Product

function unpackStorage(){
    document.title = `Delicae - ${product.brand} | ${product.name}`;

    document.querySelector('#productInfoBox').dataset.id = product.id;
    document.querySelector('#productInfoBox').dataset.sex = product.sex;

    addColorAndSizes(product);

    document.querySelector('#productImageBox img').src = `../img/cloths/${product.src}`;
    document.querySelector('#productImageBox img').style.maxWidth = '90%';
    document.querySelector('#productImageBox img').style.maxHeight = '90%';
    
    document.querySelector('#productBrand').textContent = product.brand;
    document.querySelector('#productName').textContent = product.name;

    viewProductSalePrice(product);
}

function viewProductSalePrice(product){
    if(product.sale !== 'null'){
        document.querySelector('.productPrice').innerHTML = `<div class="previousPrice">${product.price}$</div> ${product.sale}$`;
    }
    else{
        document.querySelector('.productPrice').textContent = `${product.price}$`;
    }
}

function imageToggle(e){
   let img = document.querySelector('#productImageBox img').src;

   if(e.target.textContent === 'keyboard_arrow_left'){
        //LEFT
        if(img.includes('2')){
            let firstPart = img.split('.')[0];
            let secondPart = img.split('.')[1];

            firstPart = firstPart.substr(0, firstPart.length - 2);

            document.querySelector('#productImageBox img').src = firstPart += `.${secondPart}`;
        }
   }
    else {
        //RIGHT
        if(!img.includes('2')){
            let firstPart = img.split('.')[0];
            let secondPart = img.split('.')[1];

            firstPart += '_2';

            document.querySelector('#productImageBox img').src = firstPart += `.${secondPart}`;
        }
    }
}

// DESIGNER

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

// CLOTH

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


