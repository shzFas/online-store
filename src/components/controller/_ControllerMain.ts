import { numberArrayObject } from '../typingTS/_type'
import { IitemDATA, IFilter, IBascetLocalStorage, IPromoList } from '../typingTS/_interfaces'
import CreateFilterData from '../model/_ModelCreateFilterData'
import ViewHeader from '../view/_ViewHeader';
import ViewMainPage from '../view/_ViewMainPage';
import ViewFooter from '../view/_ViewFooter';
import ViewItemCardPage from '../view/_ViewItemCardPage';
import ViewBasketPage from '../view/_ViewBasketPage';
import ViewNotFound from '../view/_ViewNotFoundPage';
import ViewNotBasket from '../view/_ViewNotBasketPage';
import ViewValidation from '../view/_ViewValidation';
import CustomElement from '../utils/_createCustomElement';
import FormatURL from '../utils/_formatUrl';
import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';

class ControllerMain {
  BascetLocalStorage: IBascetLocalStorage[]
  routes: {
    [key: string]: {
      name: string;
      routesPage: (x: string) => void;
    }
  };
  customElement: CustomElement
  MODEL: CreateFilterData;
  ViewHEADER: ViewHeader;
  ViewMainPAGE: ViewMainPage;
  ViewFOOTER: ViewFooter;
  ViewItemCardPAGE: ViewItemCardPage;
  ViewBASKETPAGE: ViewBasketPage;
  ViewNotFound: ViewNotFound;
  ViewNotBasket: ViewNotBasket;
  ViewValidation: ViewValidation;
  _formatURL: FormatURL;
  FILTER: IFilter;
  BODY: HTMLElement
  HEADER: HTMLElement
  MAIN: HTMLElement
  FOOTER: HTMLElement
  readonly startCategoryData: numberArrayObject;
  readonly startBrandData: numberArrayObject;
  readonly startServerData: IitemDATA[];
  readonly startPriceOfFILTER: number[];
  readonly startStockOfFILTER: number[];
  readonly startSearchOfFILTER: string[];
  protected priceOfFILTER: number[];
  protected stockOfFILTER: number[];
  readonly searchOfFILTER: string[];
  sortOfFILTER: string[];
  viewOfFILTER: string[];
  promocodeInfo: IPromoList;

  constructor() {
    const readlocalStorage = localStorage.getItem('BascetLocalStorage')
    if (readlocalStorage) {
      this.BascetLocalStorage = JSON.parse(readlocalStorage)
    } else {
      this.BascetLocalStorage = []
    }
    const readlocalStoragePromoCount = localStorage.getItem('listPromo')
    if (readlocalStoragePromoCount) {
      this.promocodeInfo = JSON.parse(readlocalStoragePromoCount);
    } else {
      this.promocodeInfo = {
        count: 0,
        list: []
      };
    }
    this.customElement = new CustomElement();
    this._formatURL = new FormatURL();
    this.BODY = document.body
    this.HEADER = this.customElement.createElement('header', { className: "page-header _main-container" });
    this.MAIN = this.customElement.createElement('main');
    this.FOOTER = this.customElement.createElement('footer', { className: "page-footer _main-container" });
    this.customElement.addChildren(this.BODY, [this.HEADER, this.MAIN, this.FOOTER])
    this.MODEL = new CreateFilterData();
    this.ViewHEADER = new ViewHeader();
    this.ViewFOOTER = new ViewFooter();
    this.ViewNotFound = new ViewNotFound();
    this.ViewNotBasket = new ViewNotBasket();
    this.ViewValidation = new ViewValidation();
    this.FILTER = this.MODEL.FILTER
    this.startCategoryData = this.MODEL.startCategoryData
    this.startBrandData = this.MODEL.startBrandData
    this.startServerData = this.MODEL.startServerData
    this.startPriceOfFILTER = this.MODEL.startPriceOfFILTER
    this.startStockOfFILTER = this.MODEL.startStockOfFILTER
    this.startSearchOfFILTER = this.MODEL.startSearchOfFILTER
    this.priceOfFILTER = this.MODEL.priceOfFILTER
    this.stockOfFILTER = this.MODEL.stockOfFILTER
    this.searchOfFILTER = this.MODEL.searchOfFILTER
    this.sortOfFILTER = this.MODEL.sortOfFILTER
    this.viewOfFILTER = this.MODEL.viewOfFILTER
    this.ViewMainPAGE = new ViewMainPage(this.startServerData,
      this.startCategoryData,
      this.startBrandData,
      this.startPriceOfFILTER,
      this.startStockOfFILTER,
      this.sortOfFILTER,
      this.viewOfFILTER
    );
    this.ViewItemCardPAGE = new ViewItemCardPage(this.startServerData[0]);
    this.ViewBASKETPAGE = new ViewBasketPage(this.startServerData);
    this.ListenersController()

    this.routes = {
      '/page404': {
        name: 'Ошибка 404',
        routesPage: this.pageNotFound.bind(this)
      },
      '/nonbasket': {
        name: 'Корзина пуста',
        routesPage: this.pageNotBasket.bind(this)
      },
      '/product': {
        name: 'Товар',
        routesPage: this.renderItemCardPAGEFromRouter.bind(this)
      },
      '/basket': {
        name: 'Корзина',
        routesPage: this.renderBacket.bind(this)
      },
      '/validation': {
        name: 'Проверка',
        routesPage: this.renderValidation.bind(this)
      },
      '/': {
        name: 'Главная',
        routesPage: this.renderMainPageFromRouter.bind(this)
      },
    };

  }

  updateBascetLocalStorage(id: number, key: boolean = true): IBascetLocalStorage[] {
    const index = this.BascetLocalStorage.findIndex((el) => {
      return el.id === id
    })
    if (index === -1) {
      this.BascetLocalStorage.push(this.convertIDtoBascetObject(id))
    } else if (index !== -1 && key) {
      this.BascetLocalStorage.splice(index, 1);
    }
    localStorage.setItem('BascetLocalStorage', JSON.stringify(this.BascetLocalStorage));
    localStorage.setItem('listPromo', JSON.stringify(this.promocodeInfo));
    return this.BascetLocalStorage
  } 
  convertIDtoBascetObject(id: number): IBascetLocalStorage {
    return {
      id: id,
      price: this.MODEL.startServerData[id - 1].price,
      count: 1,
      total: this.MODEL.startServerData[id - 1].price,
      stock: this.MODEL.startServerData[id - 1].stock,
    }
  }
  init() {
    this.startRouteListenner();
    this.handleLocation();
    this.HEADER.append(this.ViewHEADER.create())
    this.FOOTER.append(this.ViewFOOTER.create())
    this.updateBascetCountAndTotaPriseHeader()
  }
  renderValidation(name: string) {
    document.title = `Store - ${name}`;
    this.MAIN.innerHTML = '';
    this.MAIN.append(this.ViewValidation.create())
    this.updateBascetCountAndTotaPriseHeader()
  }
  renderMainPageFromRouter(name: string) {
    document.title = `Store - ${name}`;
    const search = new URLSearchParams(window.location.search);
    const filter = this._formatURL.createObjectFromURLSearchParams(search)
    this.MODEL.setFILTER(filter)
    this.rerenderMainPageComponents()
  }
  rerenderMainPageComponents() {
    if (this.MAIN.firstChild === this.ViewMainPAGE.pageMain) {
      this.viewMainPAGEupdate();
    } else {
      this.MAIN.innerHTML = ''
      this.viewMainPAGEupdate()
      this.MAIN.append(this.ViewMainPAGE.create(this.MODEL.filtredData,
        this.MODEL.filtredCategoryData,
        this.MODEL.filtredBrandData,
        this.priceOfFILTER,
        this.stockOfFILTER,
        this.sortOfFILTER,
        this.viewOfFILTER,
      ))
    }
    if (document.querySelector('.noUi-base') === null) {
      this.fnSliderPrice();
      this.fnSliderStock();

    } else {
      (this.ViewMainPAGE.silderPrice as noUiSlider.target).noUiSlider?.destroy();
      this.fnSliderPrice();
      (this.ViewMainPAGE.silderStock as noUiSlider.target).noUiSlider?.destroy();
      this.fnSliderStock()
    }
    this.updateTextContent()
    this.updateBascetCountAndTotaPriseHeader()
  }
  viewMainPAGEupdate() {
    this.MODEL.updateFiltredData()
    this.sortOfFILTER = this.MODEL.sortOfFILTER
    this.priceOfFILTER = this.MODEL.priceOfFILTER
    this.stockOfFILTER = this.MODEL.stockOfFILTER
    this.viewOfFILTER = this.MODEL.viewOfFILTER
    this.ViewMainPAGE.updateCardList(this.MODEL.filtredData, this.viewOfFILTER)
    this.ViewMainPAGE.updateBrandBlock(this.MODEL.filtredBrandData)
    this.ViewMainPAGE.updateCategoryBlock(this.MODEL.filtredCategoryData)
    this.ViewMainPAGE.updateSearchValue(this.MODEL.searchOfFILTER[0])
  }
  renderItemCardPAGEFromRouter(name: string) {
    document.title = `Store - ${name}`;
    const search = new URLSearchParams(window.location.search);
    const id = this._formatURL.createFromURLSearchParams<URLSearchParams>(search).id
    this.MAIN.innerHTML = ''
    this.MAIN.append(this.ViewItemCardPAGE.create(this.MODEL.startServerData[Number(id) - 1]))
    this.updateBascetCountAndTotaPriseHeader()
  }
  renderBacket(name: string = 'Backet') {
    document.title = `Store - ${name}`;
    const search = new URLSearchParams(window.location.search);
    const basketObject = search.toString() ? this._formatURL.createFromURLSearchParams<URLSearchParams>(search) : {
      items: 3,
      pages: 1,
    }
    this.MAIN.innerHTML = ''
    this.MAIN.append(this.ViewBASKETPAGE.create(this.generateProductsForBascet(), basketObject))
    this.updateBascetCountAndTotaPriseHeader()
  }

  updateBascetFROMLocalStorage() {
    const readlocalStorage = localStorage.getItem('BascetLocalStorage')
    if (readlocalStorage) {
      this.BascetLocalStorage = JSON.parse(readlocalStorage)
    } else {
      this.BascetLocalStorage = []
    }
  }

  updatePromoFROMLocalStorage() {
    const readlocalStoragePromoCount = localStorage.getItem('listPromo')
    if (readlocalStoragePromoCount) {
      this.promocodeInfo = JSON.parse(readlocalStoragePromoCount);
    } else {
      this.promocodeInfo = {
        count: 0,
        list: []
      };
    }
  }

  generateProductsForBascet(localData: IBascetLocalStorage[] = this.BascetLocalStorage): IitemDATA[] {
    this.updateBascetFROMLocalStorage()
    return this.startServerData.filter((el) => {
      for (let index = 0; index < localData.length; index++) {
        if (el.id === localData[index].id) return true
      }
    })
  }

  pageNotFound(name: string) {
    document.title = `Store - ${name}`;
    this.MAIN.innerHTML = ''
    this.MAIN.append(this.ViewNotFound.create())
    window.history.pushState({}, '', `/page404`)
    this.updateBascetCountAndTotaPriseHeader()
  }

  pageNotBasket(name: string) {
    document.title = `Store - ${name}`;
    this.MAIN.innerHTML = ''
    this.MAIN.append(this.ViewNotBasket.create())
    window.history.pushState({}, '', `/nonbasket`)
    this.updateBascetCountAndTotaPriseHeader()
  }

  startRouteListenner() {
    window.onpopstate = (event: PopStateEvent) => {
      event.preventDefault()
      this.handleLocation()
    };
  }

  handleLocation() {
    const path = window.location.pathname;
    const route = this.routes[path] || this.routes['/page404'];
    route.routesPage(route.name);
  }

  pushStateFilter(filter = this.MODEL.FILTER) {
    const params: URLSearchParams = this._formatURL.createURLSearchParams(filter)
    if (JSON.stringify(this.FILTER) === JSON.stringify(this.MODEL.startServerFILTER)) {
      window.history.replaceState({}, '', '/')
    } else {
      window.history.pushState({}, '', `/?${params}`)
    }
  }

  updateTextContent() {
    this.MODEL.updateFILTER_Price_Stock()
    this.ViewMainPAGE.itemPriceNumberFrom.textContent = this.MODEL._FILTERpriceTEXT[0].toString()
    this.ViewMainPAGE.itemPriceNumberTo.textContent = this.MODEL._FILTERpriceTEXT[1].toString()
    this.ViewMainPAGE.itemStockNumberFrom.textContent = this.MODEL._FILTERstockTEXT[0].toString()
    this.ViewMainPAGE.itemStockNumberTo.textContent = this.MODEL._FILTERstockTEXT[1].toString()
  }

  ListenersController() {

    this.MAIN.addEventListener('clickOnCategoryMain', (e) => {
      const target = e.target as HTMLElement;
      this.MODEL.setFILTERCategory(target.id)
      this.rerenderMainPageComponents()
      this.pushStateFilter()
      this.updateTextContent()
    })
    this.MAIN.addEventListener('clickOnBrandMain', (e) => {
      const target = e.target as HTMLElement;
      this.MODEL.setFILTERBrand(target.id)
      this.rerenderMainPageComponents()
      this.pushStateFilter()
      this.updateTextContent()
    })

    this.MAIN.addEventListener('changeOnSearchMain', (e) => {
      const target = e.target as HTMLInputElement;

      this.MODEL.setSearchOfFILTER(target.value)
      this.rerenderMainPageComponents()
      this.pushStateFilter()
      this.updateTextContent()
    })
    this.MAIN.addEventListener('choiceOnSortMain', (e) => {
      const target = e.target as HTMLSelectElement;
      this.MODEL.setSortOfFILTER(target.value)
      this.rerenderMainPageComponents()
      this.pushStateFilter()
      this.updateTextContent()
    })
    this.MAIN.addEventListener('clickOnbuttonResetMain', () => {
      this.MODEL.clearFILTER()
      this.rerenderMainPageComponents()
      this.pushStateFilter()

    })
    this.MAIN.addEventListener('clickOnbuttonViewBlockMain', (e) => {
      const target = e.target as HTMLSelectElement;
      if (target.textContent) {
        this.MODEL.setViewOfFILTER(target.textContent)
      }
      this.rerenderMainPageComponents()
      this.pushStateFilter()

    })

    this.BODY.addEventListener('clickOnBacket', () => {
      const basketObject = {
        items: 3,
        pages: 1,
      }
      const params: URLSearchParams = this._formatURL.createURLSearchParamsBasket(basketObject)
      window.history.pushState({}, '', `/basket?${params}`)
      this.renderBacket()
    })

    this.BODY.addEventListener('clickOnLogo', () => {
      window.history.pushState({}, '', '/')
      this.rerenderMainPageComponents()
      this.pushStateFilter()
      this.updateBascetCountAndTotaPriseHeader()
    })

    this.MAIN.addEventListener('clickOnСardListMain', (e) => {
      const target = e.target as HTMLElement;
      const id = target.id
      this.MAIN.innerHTML = ''
      this.MAIN.append(this.ViewItemCardPAGE.create(this.MODEL.startServerData[Number(id) - 1]))
      window.history.pushState({}, '', `/product?id=${id}`)
    })

    this.MAIN.addEventListener('clickOnProductAddInBascetMain', (e) => {
      const target = e.target as HTMLElement;
      const id = +target.id.split('|')[1];
      const key: boolean = target.id.split('|')[0] === 'button-buy' ? false : true
      this.updateBascetLocalStorage(id, key)
      this.updateBascetCountAndTotaPriseHeader()
    })

    this.MAIN.addEventListener('clickOnProductPlus', (e) => {
      const target = e.target as HTMLElement;
      const card = target.closest('.itemBasket');
      const cardId = Number(card?.id);

      const oneLocalStorage = this.BascetLocalStorage.map((item) => {
        if (cardId === item.id) {
          if (item.stock > item.count) {
            item.count = item.count + 1;
          }
        }
        return item
      });

      localStorage.setItem('BascetLocalStorage', JSON.stringify(oneLocalStorage));
      this.updateBascetCountAndTotaPriseHeader();
    })

    this.MAIN.addEventListener('clickOnProductMinus', (e) => {
      const target = e.target as HTMLElement;
      const card = target.closest('.itemBasket');
      const cardId = Number(card?.id);

      const oneLocalStorage = this.BascetLocalStorage.map((item) => {
        if (item.id === cardId) {
          if (item.count >= 1) {
            item.count = item.count - 1;
          }
        }
        return item
      });

      const twoLocalStorage = oneLocalStorage.filter((item) => item.count !== 0);
      localStorage.setItem('BascetLocalStorage', JSON.stringify(twoLocalStorage));
      this.updateBascetCountAndTotaPriseHeader();
    })

    this.MAIN.addEventListener('clickOnProductAddInBascetBuy', () => {
      window.history.pushState({}, '', `/validation`)
      this.MAIN.innerHTML = ''
      this.MAIN.append(this.ViewValidation.create())
    });

    this.BODY.addEventListener('clickOnPromoAdd', (e) => this.updatePromoAdd(e));
    this.BODY.addEventListener('clickOnPromoRemove', (e) => this.updatePromoRemove(e));
  }

  updatePromoAdd(event: Event) {
    const target = event.target as HTMLElement;
    const summaryInfo = target.closest('.summaryInfo');
    const currentCodeElement = summaryInfo?.querySelector('.summaryInfo__search');
    const currentCode = (currentCodeElement as HTMLInputElement).value;
    if (this.promocodeInfo.list.includes(currentCode)) return
    this.promocodeInfo.list.push(currentCode);
    this.promocodeInfo.count++
    localStorage.setItem('listPromo', JSON.stringify(this.promocodeInfo));
    this.updateBascetCountAndTotaPriseHeader();
  }

  updatePromoRemove(event: Event) {
    const target = event.target as HTMLElement;
    const targetItem = target.closest('.promoItem');
    const targetCode = targetItem?.querySelector('.promoItem__text');
    this.promocodeInfo.count--
    const newPromoList = this.promocodeInfo.list.filter(item => item !== targetCode?.textContent);
    this.promocodeInfo.list = [...newPromoList]
    localStorage.setItem('listPromo', JSON.stringify(this.promocodeInfo));
    this.updateBascetCountAndTotaPriseHeader();
  }

  updateBascetCountAndTotaPriseHeader() {
    this.updateBascetFROMLocalStorage();
    this.updatePromoFROMLocalStorage();
    const promoCount = Number(this.promocodeInfo.count);
    this.ViewHEADER.updateHeaderBasketCount(this.BascetLocalStorage.reduce((count, el) => count + el.count, 0));
    const summTotal = this.BascetLocalStorage.reduce((summ, el) => summ + el.price * el.count, 0);
    const summTotalNew = Math.round(summTotal * ((10 - promoCount) / 10));
    this.ViewHEADER.updateHeaderTotalPrice(summTotalNew)
    this.ViewBASKETPAGE.summaryInfoSpanTotal.textContent = summTotal.toString();
    this.ViewBASKETPAGE.summaryInfoSpanTotalNew.textContent = summTotalNew.toString();
    this.ViewBASKETPAGE.summaryInfoSpanTotalProducts.textContent = this.BascetLocalStorage.reduce((count, el) => count + el.count, 0).toString();
  }

  fnSliderPrice() {
    if (this.ViewMainPAGE.silderPrice) {
      noUiSlider.create(this.ViewMainPAGE.silderPrice, {
        start: [this.priceOfFILTER[0], this.priceOfFILTER[1]],
        tooltips: true,
        format: {
          to: function (value) {
            return Math.ceil(+value);
          },
          from: function (value) {
            return Math.ceil(+value);
          }
        },
        connect: true,
        step: 1,
        range: {
          'min': this.startPriceOfFILTER[0],
          'max': this.startPriceOfFILTER[1],
        },
      });

      const inputs = [this.ViewMainPAGE.itemPriceNumberFrom, this.ViewMainPAGE.itemPriceNumberTo];
      (this.ViewMainPAGE.silderPrice as noUiSlider.target).noUiSlider?.on('update',
        function (values: (string | number)[], handle: number): void {
          inputs[handle].textContent = String(Math.round(Number(values[handle])));
        });
      (this.ViewMainPAGE.silderPrice as noUiSlider.target).noUiSlider?.on('set', (values) => {
        const valueArray = values.map(el => Math.round(+el))
        this.MODEL.setPriceOfFILTER(valueArray)
        this.rerenderMainPageComponents()
        this.pushStateFilter()
        this.MODEL.updateFILTER_Price_Stock()
        this.ViewMainPAGE.itemStockNumberFrom.textContent = this.MODEL._FILTERstockTEXT[0].toString()
        this.ViewMainPAGE.itemStockNumberTo.textContent = this.MODEL._FILTERstockTEXT[1].toString()
      });

    }
  }

  fnSliderStock() {
    if (this.ViewMainPAGE.silderStock) {
      noUiSlider.create(this.ViewMainPAGE.silderStock, {
        start: [this.stockOfFILTER[0], this.stockOfFILTER[1]],
        tooltips: true,
        format: {
          to: function (value) {
            return Math.ceil(+value);
          },
          from: function (value) {
            return Math.ceil(+value);
          }
        },
        connect: true,
        step: 1,
        range: {
          'min': this.startStockOfFILTER[0],
          'max': this.startStockOfFILTER[1],
        }
      });

      const inputs = [this.ViewMainPAGE.itemStockNumberFrom, this.ViewMainPAGE.itemStockNumberTo];

      (this.ViewMainPAGE.silderStock as noUiSlider.target).noUiSlider?.on('update',
        function (values: (string | number)[], handle: number): void {
          inputs[handle].textContent = String(Math.round(Number(values[handle])));
        });

      (this.ViewMainPAGE.silderStock as noUiSlider.target).noUiSlider?.on('set', (values) => {
        const valueArray = values.map(el => Math.round(+el))

        this.MODEL.setStockOfFILTER(valueArray)
        this.rerenderMainPageComponents()
        this.pushStateFilter()
        this.MODEL.updateFILTER_Price_Stock()
        this.ViewMainPAGE.itemPriceNumberFrom.textContent = this.MODEL._FILTERpriceTEXT[0].toString()
        this.ViewMainPAGE.itemPriceNumberTo.textContent = this.MODEL._FILTERpriceTEXT[1].toString()
      });

    }
  }
}

export default ControllerMain
