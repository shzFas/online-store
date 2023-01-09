import CustomElement from '../utils/_createCustomElement';
import { numberArrayObject } from '../typingTS/_type';
import { IitemDATA } from '../typingTS/_interfaces'
import { createElement } from '../utils/utils';
import { IBascetLocalStorage } from '../typingTS/_interfaces';

class ViewMainPage {
  pageMain: HTMLElement;
  buttonReset: HTMLElement;
  buttonCopy: HTMLElement;
  itemPriceNumberFrom: HTMLElement;
  itemPriceNumberTo: HTMLElement;
  itemPriceInputOne: HTMLElement;
  itemPriceInputTwo: HTMLElement;
  itemStockNumberFrom: HTMLElement;
  itemStockNumberTo: HTMLElement;
  itemStockInputOne: HTMLElement;
  itemStockInputTwo: HTMLElement;
  filterCategoryMain: HTMLElement;
  filterBrandMain: HTMLElement;
  viewSort: HTMLElement;
  viewSearch: HTMLElement;
  findCount: HTMLElement;
  viewBlock: HTMLElement;
  viewList: HTMLElement;
  cardList: HTMLElement;
  filterPrice: HTMLElement;
  silderPrice: HTMLElement;
  silderStock: HTMLElement;
  customElement: CustomElement;
  startCategoryData: numberArrayObject;
  startBrandData: numberArrayObject;
  startPriceOfFILTER: number[];
  startStockOfFILTER: number[];
  startSortOfFILTER: string[];
  startViewOfFILTER: string[];
  startServerData: IitemDATA[];
  BascetLocalStorage: IBascetLocalStorage[];
  EVENT: { [x: string]: Event }
  constructor(startServerData: IitemDATA[],
    startCategoryData: numberArrayObject,
    startBrandData: numberArrayObject,
    startPriceOfFILTER: number[],
    startStockOfFILTER: number[],
    startSortOfFILTER: string[],
    startViewOfFILTER: string[],
  ) {
    const readlocalStorage = localStorage.getItem('BascetLocalStorage')
    if (readlocalStorage) {
      this.BascetLocalStorage = JSON.parse(readlocalStorage)
    } else {
      this.BascetLocalStorage = []
    }
    this.startServerData = startServerData;
    this.startCategoryData = startCategoryData;
    this.startBrandData = startBrandData;
    this.startPriceOfFILTER = startPriceOfFILTER;
    this.startStockOfFILTER = startStockOfFILTER;
    this.startSortOfFILTER = startSortOfFILTER;
    this.startViewOfFILTER = startViewOfFILTER;
    this.customElement = new CustomElement();
    this.pageMain = this.customElement.createElement('div', { className: 'page-main-one _main-container' });
    this.buttonReset = this.customElement.createElement('button', { className: 'stock__reset _btn', textContent: 'Reset Filter' }); 
    this.buttonCopy = this.customElement.createElement('button', { className: 'stock__copy _btn', textContent: 'Copy Link' }); 
    this.filterCategoryMain = this.customElement.createElement('div', { className: 'filter__item filter__category category filter__item-scroll' }); 
    this.filterBrandMain = this.customElement.createElement('div', { className: 'filter__item filter__brand brand filter__item-scroll' }); 
    this.filterPrice = this.customElement.createElement('div', { className: 'filter__item filter__price price' });
    this.silderPrice = this.customElement.createElement('div', { id: 'sliderPrice' }); 
    this.silderStock = this.customElement.createElement('div', { id: 'sliderStock' }); 
    this.itemPriceNumberFrom = this.customElement.createElement('div', { className: 'item-price__from' }); 
    this.itemPriceNumberTo = this.customElement.createElement('div', { className: 'item-price__to' }); 
    this.itemPriceInputOne = this.customElement.createElement('input', { type: 'range', step: '1', id: 'slider1' }); 
    this.itemPriceInputTwo = this.customElement.createElement('input', { type: 'range', step: '1', id: 'slider2' }); 
    this.itemStockNumberFrom = this.customElement.createElement('div', { className: 'item-stock__from' }); 
    this.itemStockNumberTo = this.customElement.createElement('div', { className: 'item-stock__to' }); 
    this.itemStockInputOne = this.customElement.createElement('input', { type: 'range', step: '1', id: 'slider3' });
    this.itemStockInputTwo = this.customElement.createElement('input', { type: 'range', step: '1', id: 'slider4' });
    this.viewSort = this.customElement.createElement('select', { className: 'view__sort', name: 'sort', placeholder: 'Sorting', id: "sorting" }) as HTMLSelectElement;
    this.findCount = this.customElement.createElement('span', { className: 'view__find-count-span', textContent: `${this.startServerData.length}` });
    this.viewSearch = this.customElement.createElement('input', { className: 'view__search', type: 'search', placeholder: 'Поиск' });
    this.viewBlock = this.customElement.createElement('div', { className: 'visible__item viewBlock', textContent: 'Big' });
    this.viewList = this.customElement.createElement('div', { className: 'visible__item viewList', textContent: 'Small' });
    this.cardList = this.customElement.createElement('div', { className: 'right__list cardlist' });
    this.EVENT = {
      clickOnCategoryMain: new Event('clickOnCategoryMain', { bubbles: true }),
      clickOnBrandMain: new Event('clickOnBrandMain', { bubbles: true }),
      changeOnSearchMain: new Event('changeOnSearchMain', { bubbles: true }),
      choiceOnSortMain: new Event('choiceOnSortMain', { bubbles: true }),
      clickOnСardListMain: new Event('clickOnСardListMain', { bubbles: true }),
      clickOnProductAddInBascetMain: new Event('clickOnProductAddInBascetMain', { bubbles: true }),
      clickOnbuttonResetMain: new Event('clickOnbuttonResetMain', { bubbles: true }),
      clickOnbuttonViewBlockMain: new Event('clickOnbuttonViewBlockMain', { bubbles: true }),
    }
    this.listenersMainPage();
  }

  create(startServerData: IitemDATA[] = this.startServerData,
    startCategoryData: numberArrayObject = this.startCategoryData,
    startBrandData: numberArrayObject = this.startBrandData,
    startPriceOfFILTER: number[] = this.startPriceOfFILTER,
    startStockOfFILTER: number[] = this.startStockOfFILTER,
    startSortOfFILTER: string[] = this.startSortOfFILTER,
    startViewOfFILTER: string[] = this.startViewOfFILTER,
  ) {

    this.startViewOfFILTER = startViewOfFILTER
    const mainOne = this.customElement.createElement('section', { className: 'main-one _container' });
    this.pageMain.innerHTML = ''
    this.viewSort.innerHTML = ''
    this.customElement.addChildren(this.pageMain, [mainOne]);
    const mainLeft = this.customElement.createElement('div', { className: 'main-one__left filter' });
    this.customElement.addChildren(mainOne, [mainLeft]);
    const containerButtons = this.customElement.createElement('div', { className: 'filter__stock stock' });
    this.customElement.addChildren(mainLeft, [containerButtons]);
    this.customElement.addChildren(containerButtons, [this.buttonReset, this.buttonCopy]);
    this.updateCategoryBlock(startCategoryData)
    this.updateBrandBlock(startBrandData)
    this.customElement.addChildren(mainLeft, [this.filterCategoryMain, this.filterBrandMain]);
    this.customElement.addChildren(mainLeft, [this.renderPriceBlock(startPriceOfFILTER)]);
    this.customElement.addChildren(mainLeft, [this.renderStockBlock(startStockOfFILTER)]);
    const mainRight = this.customElement.createElement('div', { className: 'main-one__right right' });
    this.customElement.addChildren(mainOne, [mainRight]);
    const rightView = this.customElement.createElement('div', { className: 'right__view view' });
    this.customElement.addChildren(mainRight, [rightView]);
    this.viewSort.setAttribute('list', 'sorting');

    [{ value: "SortABC", textContent: "По Алфавиту (по возр.)" },
    { value: "SortCBA", textContent: "По Алфавиту (по убыв.)" },
    { value: "SortByPriceLow", textContent: "Цена (по возр.)" },
    { value: "SortByPriceUp", textContent: "Цена (по убыв.)" },
    { value: "SortByRatingLow", textContent: "Оценка (по возр.)" },
    { value: "SortByRatingUp", textContent: "Оценка (по убыв.)" }].forEach((atributs) => {
      const option = this.customElement.createElement('option', atributs)
      if ((option as HTMLOptionElement).value === startSortOfFILTER[0]) {
        (option as HTMLOptionElement).selected = true
      }
      this.customElement.addChildren(this.viewSort, [option])
    })
    const viewFindCount = this.customElement.createElement('p', { className: 'view__find-count', textContent: 'Найденно продуктов:' });
    this.findCount.textContent = `${startServerData.length}`
    this.customElement.addChildren(viewFindCount, [this.findCount]);
    const viewVisible = this.customElement.createElement('div', { className: 'view__visible visible' });
    this.customElement.addChildren(viewVisible, [this.viewBlock, this.viewList]);
    this.customElement.addChildren(rightView, [this.viewSort, viewFindCount, this.viewSearch, viewVisible]);
    this.customElement.addChildren(mainRight, [this.cardList]);
    this.viewSort.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      target.dispatchEvent(this.EVENT.choiceOnSortMain)
    })
    return this.pageMain
  }

  listenersMainPage() {
    this.viewBlock.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      target.dispatchEvent(this.EVENT.clickOnbuttonViewBlockMain)
    })
    this.viewList.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      target.dispatchEvent(this.EVENT.clickOnbuttonViewBlockMain)
    })
    this.filterCategoryMain.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.getAttribute('type') === "checkbox") {
        target.dispatchEvent(this.EVENT.clickOnCategoryMain)
      }
    })
    this.filterBrandMain.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.getAttribute('type') === "checkbox") {
        target.dispatchEvent(this.EVENT.clickOnBrandMain)
      }
    })
    this.viewSearch.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (target) {
        target.dispatchEvent(this.EVENT.changeOnSearchMain)
      }
    })
    this.cardList.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const card = target.closest('.cardlist__item')
      const addToCard = target.closest('._btn_add-to-card')
      if (card && !addToCard) {
        card.dispatchEvent(this.EVENT.clickOnСardListMain) 
      } else {
        addToCard?.dispatchEvent(this.EVENT.clickOnProductAddInBascetMain);
        this.addProductForButton(e);
      }
    })
    this.buttonCopy.addEventListener('click', () => {
      this.copyPageUrl()
      setTimeout(() => {
        this.buttonCopy.textContent = 'Copy Link'
      }, 1500);
    })
    this.buttonReset.addEventListener('click', () => {
      this.buttonReset.dispatchEvent(this.EVENT.clickOnbuttonResetMain)
    })
  }

  async copyPageUrl() {
    try {
      await navigator.clipboard.writeText(location.href);
      this.buttonCopy.textContent = 'Copied'
    } catch (err) {
      console.error('Не удалось скопировать: ', err);
    }
  }

  renderCategoryBlock(dataFilterCategory: numberArrayObject = this.startCategoryData): HTMLElement[] {
    const itemContainer: HTMLElement[] = [];
    const filterCategoryItemName = this.customElement.createElement('h3', { className: 'filter__item-name category__name', textContent: 'Category' });
    const filterCategory = this.customElement.createElement('div', { className: 'filter__item-container category__container filter__item-container-scroll' });
    for (const key in dataFilterCategory) {
      const itemCategory = this.itemFilterCheckbox(key, dataFilterCategory[key]);
      this.customElement.addChildren(filterCategory, [itemCategory]);
    }
    itemContainer.push(filterCategoryItemName, filterCategory)
    return itemContainer
  }

  renderBrandBlock(dataFilterBrand: numberArrayObject = this.startBrandData): HTMLElement[] {
    const itemContainer: HTMLElement[] = [];
    const filterBrandItemName = this.customElement.createElement('h3', { className: 'filter__item-name brand__name', textContent: 'Brand' });
    const filterBrand = this.customElement.createElement('div', { className: 'filter__item-container brand__container filter__item-container-scroll' });
    for (const key in dataFilterBrand) {
      const itemBrand = this.itemFilterCheckbox(key, dataFilterBrand[key]);
      this.customElement.addChildren(filterBrand, [itemBrand]);
    }
    itemContainer.push(filterBrandItemName, filterBrand)
    return itemContainer
  }

  renderPriceBlock(dataFilterPrice: number[] = this.startPriceOfFILTER): HTMLElement {
    this.filterPrice.innerHTML = ''
    const filterPriceItemName = this.customElement.createElement('h3', { className: 'filter__item-name price__name', textContent: 'Price' });
    const filterPriceContainer = this.customElement.createElement('div', { className: 'inputRange_container price__container' });
    this.customElement.addChildren(this.filterPrice, [filterPriceItemName, filterPriceContainer]);
    const itemPriceNumberContainer = this.customElement.createElement('div', { className: 'filter__item-data item-price' });
    this.customElement.addChildren(filterPriceContainer, [itemPriceNumberContainer, this.silderPrice]);
    this.itemPriceNumberFrom.textContent = `${dataFilterPrice[0]}`;
    this.itemPriceNumberTo.textContent = `${dataFilterPrice[1]}`;
    const itemPriceNumberMid = this.customElement.createElement('div', { textContent: '⟷' });
    this.customElement.addChildren(itemPriceNumberContainer, [this.itemPriceNumberFrom, itemPriceNumberMid, this.itemPriceNumberTo]);
    return this.filterPrice
  }

  renderStockBlock(dataFilterStock: number[] = this.startStockOfFILTER): HTMLElement {
    const filterStock = this.customElement.createElement('div', { className: 'filter__item filter__stock-slider stock-slider' });
    const filterStockItemName = this.customElement.createElement('h3', { className: 'filter__item-name stock-slider__name', textContent: 'Stock' });
    const filterStockContainer = this.customElement.createElement('div', { className: 'inputRange_container stock-slider__container' });
    this.customElement.addChildren(filterStock, [filterStockItemName, filterStockContainer]);
    const itemStockNumberContainer = this.customElement.createElement('div', { className: 'filter__item-data item-stock-slider' });
    this.customElement.addChildren(filterStockContainer, [itemStockNumberContainer, this.silderStock]);
    this.itemStockNumberFrom.textContent = `${dataFilterStock[0]}`;
    this.itemStockNumberTo.textContent = `${dataFilterStock[1]}`;
    const itemStockNumberMid = this.customElement.createElement('div', { textContent: '⟷' });
    this.customElement.addChildren(itemStockNumberContainer, [this.itemStockNumberFrom, itemStockNumberMid, this.itemStockNumberTo]);
    return filterStock
  }

  renderItemCard(dataServerItem: IitemDATA[] = this.startServerData, view = this.startViewOfFILTER) {
    if (dataServerItem.length === 0) { this.cardList.textContent = 'Продуктов Нету' } else { this.cardList.textContent = '' }
    const itemContainer: HTMLElement[] = [];
    for (const item of dataServerItem) {
      const card = this.customElement.createElement('div', { className: 'cardlist__item card', id: `${item.id}` });
      const cardName = this.customElement.createElement('h4', { className: 'card__name', textContent: `${item.title}` });
      const cardInfo = this.customElement.createElement('div', { className: 'card__info' });
      const cardButtons = this.customElement.createElement('div', { className: 'card__btn' });
      this.customElement.addChildren(card, [cardName, cardInfo, cardButtons]);
      const buttonItemAdd = this.customElement.createElement('button', { className: '_btn _btn_add-to-card', id: `_btn_add-to-card|${item.id}`, textContent: 'Add to card' });
      this.checkProductForButton(buttonItemAdd)
      const buttonItemDetails = this.customElement.createElement('button', { className: '_btn', textContent: 'Detais' });
      this.customElement.addChildren(cardButtons, [buttonItemAdd, buttonItemDetails]);
      const cardImg = this.customElement.createElement('img', { className: 'card__info-img', src: `${item.images[0]}` });
      const cardData = this.customElement.createElement('div', { className: 'card__data i-data' });
      if (view[0] === 'Big') {
        this.customElement.addChildren(cardInfo, [cardImg, cardData]);
        card.classList.add('cardlist__item-two');
        this.viewBlock.classList.remove('visible__item-active');
        this.viewList.classList.remove('visible__item-active');
        this.viewBlock.classList.add('visible__item-active');
      } else {
        this.customElement.addChildren(cardInfo, [cardImg]);
        card.classList.remove('cardlist__item-two');
        this.viewBlock.classList.remove('visible__item-active');
        this.viewList.classList.remove('visible__item-active');
        this.viewList.classList.add('visible__item-active');
      }
      const cardDataСategory = this.customElement.createElement('p', { textContent: `Category: ${item.category}` });
      const cardDataBrand = this.customElement.createElement('p', { textContent: `Brand: ${item.brand}` });
      const cardDataPrice = this.customElement.createElement('p', { textContent: `Price: ${item.price}$` });
      const cardDataDiscount = this.customElement.createElement('p', { textContent: `Discount: ${item.discountPercentage}%` });
      const cardDataRating = this.customElement.createElement('p', { textContent: `Rating: ${item.rating}` });
      const cardDataStock = this.customElement.createElement('p', { textContent: `Stock: ${item.stock}` });
      this.customElement.addChildren(cardData, [cardDataСategory, cardDataBrand, cardDataPrice, cardDataDiscount, cardDataRating, cardDataStock]);
      itemContainer.push(card)
    }
    return itemContainer
  }

  updateSearchValue(search: string) {
    (this.viewSearch as HTMLInputElement).value = search
  }

  updateCardList(data: IitemDATA[] = this.startServerData, view = this.startViewOfFILTER) {
    this.cardList.innerHTML = ''
    this.findCount.textContent = `${data.length}`
    this.customElement.addChildren(this.cardList, [...this.renderItemCard(data, view)]);
  }

  updateCategoryBlock(data: numberArrayObject = this.startCategoryData) {
    this.filterCategoryMain.innerHTML = '';
    this.customElement.addChildren(this.filterCategoryMain, [...this.renderCategoryBlock(data)]);
  }

  updateBrandBlock(data: numberArrayObject = this.startBrandData) {
    this.filterBrandMain.innerHTML = ''
    this.customElement.addChildren(this.filterBrandMain, [...this.renderBrandBlock(data)]);
  }

  itemFilterCheckbox(name: string, data: number[]): HTMLElement {
    const temp = `<div class = 'filterCheckbox'>
      <input type="checkbox" id='${name}' ${!data[2] ? '' : 'checked'}>
      <label style="opacity: ${data[0] + 0.5};" for='${name}'>${name}</label>
      <div>(${data[0]}/${data[1]})</div>
    </div>`
    return createElement(temp)
  }

  updateBascetFROMLocalStorage() {
    const readlocalStorage = localStorage.getItem('BascetLocalStorage')
    if (readlocalStorage) {
      this.BascetLocalStorage = JSON.parse(readlocalStorage)
    } else {
      this.BascetLocalStorage = []
    }
  }

  addProductForButton(event: Event) {
    this.updateBascetFROMLocalStorage();
    const target = event.target as HTMLElement;
    if (target.classList.contains('cardlist')) return
    const taretId = +target.id.split('|')[1];
    if (!this.BascetLocalStorage.length) {
      target.classList.remove('red-bg');
      target.textContent = 'Add to cart';
    }

    this.BascetLocalStorage.forEach((item) => {
      if (item.id === taretId) {
        target.classList.add('red-bg');
        target.textContent = 'Drop cart';
      } else {
        target.classList.remove('red-bg');
        target.textContent = 'Add to cart';
      }
    })
  }

  checkProductForButton(button: HTMLElement) {
    this.updateBascetFROMLocalStorage();
    if (!this.BascetLocalStorage) return
    const ButtonId = +button.id.split('|')[1];
    this.BascetLocalStorage.forEach((item) => {
      if (item.id === ButtonId) {
        button.classList.add('red-bg');
        button.textContent = 'Drop cart';
      }
    })
  }
}

export default ViewMainPage