//variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const containerModal = document.querySelector(".container-modal");
const modalBtn = document.querySelector(".product-img");
const modalDOM = document.querySelector(".modal");
const modalOverlay = document.querySelector(".modal-overlay");
const closeModal = document.querySelector(".close-modal");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//cart
let cart = [];
//buttons
let buttonsDOM = [];
//buttons Modal
let buttonsModal = [];

// este consulta el json y obtiene los productos
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map((item) => {
        const { category, description, title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return {
          category,
          description,
          title,
          price,
          id,
          image,
        };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}
// display prodcuts
class UI {
  displayProducts(products) {
    let result = "";
    console.log(products);
    products.forEach((product) => {
      result += `
             <!--single product-->
            <article class="product">
                <div class="img-container">
                    <img class="product-img"
                        src=${product.image}
                        alt="product"
                        data-id=${product.id}>
                    
                    <h3>${product.title}</h3>
                    <h4>$${product.price}</h4>
                    <div class="hearth">
                        <i class="fas fa-heart"></i>
                    </div>
                    <div class="card-footer">
                        <div class="stars">
                            <i class = "far fa-star"></i>
                            <i class = "far fa-star"></i>
                            <i class = "far fa-star"></i>
                            <i class = "far fa-star"></i>
                            <i class = "far fa-star"></i>
                        </div>
                        <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        add to cart
                    </button>
                    </div>
                </div>
            </article>
            <!--///single product-->
            `;
    });
    productsDOM.innerHTML = result;
  }
  showModal(products) {
    const btnOpenModal = [...document.querySelectorAll(".product-img")];
    buttonsModal = btnOpenModal;
    btnOpenModal.forEach((buttonId) => {
      buttonId.addEventListener("click", () => {
        let modalId = buttonId.dataset.id - 1;
        console.log(products[modalId]);
        const modalView = `
            <div class="modal__header">
                    <div class="modal__header__logo"><img src="https://i.imgur.com/ppBo4m1.png" alt="logo" /></div>

                </div>
                <div class="modal__detalle">
                    <div class="modal__detalle__imagen"><img src=${products[modalId].image} alt="producto" />
                    </div>
                    <div class="modal__detalle__info">
                        <h2>${products[modalId].title}</h2>
                        <p> ${products[modalId].description}</p>
                        <p class="precio">$${products[modalId].price}</p>
                        
                    </div>
                </div>
        `;
        containerModal.innerHTML = modalView;

        //   <button class="bag-btn" data-id=${products[modalId].id}>ADD TO CART</button>

        if (!modalOverlay.classList.contains("showOverlayModal")) {
          modalOverlay.classList.add("showOverlayModal");
          modalDOM.classList.add("showModal");
        }
      });
      closeModal.addEventListener("click", () => {
        if (modalOverlay.classList.contains("showOverlayModal")) {
          modalOverlay.classList.remove("showOverlayModal");
          modalDOM.classList.remove("showModal");
        }
      });
    });
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];

    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        //get product from products
        let cartItem = {
          ...Storage.getProduct(id),
          amount: 1,
        };
        //ad product to the cart
        cart = [...cart, cartItem];
        //save cart in local storage
        Storage.saveCart(cart);
        //set cart values
        this.setCartValues(cart);
        //display cart item
        this.addCartItem(cartItem);
        //show the cart
        this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    console.log(cartTotal, cartItems);
    if (itemsTotal === 0) {
      cartItems.classList.add("off");
    } else {
      cartItems.classList.remove("off");
    }
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
          <img src=${item.image}
                        alt="product">
                    <div>
                        <h4>${item.title}</h4>
                        <h5>$${item.price}</h5>
                        <span class="remove-item" data-id=${item.id}>remove</span>
                    </div>
                    <div>
                        <i class="fas fa-chevron-up" data-id=${item.id}></i>
                        <div class="item-amount">${item.amount}</div>
                        <i class="fas fa-chevron-down" data-id=${item.id}></i>
                    </div>`;
    cartContent.appendChild(div);
  }
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  setupApp() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
  modalLogic() {
    modalBtn.addEventListener("click", this.showModal);
  }

  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }
  cartLogic() {
    //clear cart button
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    //cart funcionality
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }
  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
  }
  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }
  //   getModalButton() {
  //     return buttonsModal.find((buttonId) => buttonId.dataset.id === id);
  //   }
}

//local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  //setup app
  ui.setupApp();
  //get all products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      ui.showModal(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
