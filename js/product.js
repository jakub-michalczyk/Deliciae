let product = null;

(function init(){
    product = JSON.parse(sessionStorage.getItem('product'));

    document.querySelector('#productBuy').addEventListener('click', addToCart);
    document.querySelector('#productFav').addEventListener('click', addToFav);

    document.querySelectorAll('.arrowIcon').forEach( arrow => arrow.addEventListener('click', imageToggle));

    fixStyles();
    mainInit();

    return unpackStorage();
})();

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
