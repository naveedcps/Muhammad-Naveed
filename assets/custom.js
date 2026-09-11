class TissoProductGrid extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const addToCartBtn = this.querySelector("#add_to_cart");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => this.addToCart());
    }

    const closeButton = this.querySelector("span.close");
    if (closeButton) {
      closeButton.addEventListener("click", () => this.hideHotspotWrapper());
    }

    const openButton = this.querySelector("div.hotspot");
    if (openButton) {
      openButton.addEventListener("click", () => this.showHotspotWrapper());
    }

    const colorRadios = this.querySelectorAll('input[name="color"]');
    colorRadios.forEach((radio) => {
      radio.addEventListener("click", (event) =>
        this.addActiveClassToLabel(event)
      );
    });
  }

  addToCart() {
    //Get selected color & Size
    const selectedColor = this.querySelector(
      'input[name="color"]:checked'
    )?.value;

    const selectedSize = this.querySelector('select[name="size"]').value;

    //Get Product Handler
    const productHandle =
      this.querySelector("#add_to_cart").getAttribute("product-data");

    fetch(`${window.Shopify.routes.root}products/${productHandle}.js`)
      .then((response) => response.json())
      .then((product) => {
        // Find the matching variant based on selected options
        const matchingVariant = product.variants.find(
          (variant) =>
            variant.option1 === selectedColor &&
            variant.option2 === selectedSize
        );

        if (matchingVariant) {
          // Prepare cart data
          let formData = {
            items: [
              {
                id: matchingVariant.id,
                quantity: 1,
              },
            ],
          };

          // Check if we need to add a bonus variant
          if (selectedColor === "Black" && selectedSize === "M") {
            const bonusVariantId = 46030701363415;
            formData.items.push({
              id: bonusVariantId,
              quantity: 1,
            });
          }

          // Add to cart request
          fetch(window.Shopify.routes.root + "cart/add.js", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          })
            .then((response) => response.json())
            .then((data) => console.log("Added to cart:", data))
            .catch((error) => console.error("Error adding to cart:", error));
          const viewCart = this.querySelector(".view-cart");
          console.log(viewCart, "viewCart");
          if (viewCart) {
            viewCart.style.display = "block";
          }
        } else {
          console.log("No matching variant found.");
        }
      })
      .catch((error) => console.error("Error fetching product:", error));
  }

  hideHotspotWrapper() {
    const hideHotspotWrapper = this.querySelector(".hotspot-wrapper");
    if (hideHotspotWrapper) {
      hideHotspotWrapper.style.display = "none";
    }
  }

  showHotspotWrapper() {
    const hideHotspotWrapper = this.querySelector(".hotspot-wrapper");
    if (hideHotspotWrapper) {
      hideHotspotWrapper.style.display = "block";
    }
  }

  addActiveClassToLabel(event) {
    this.querySelectorAll("label").forEach((label) =>
      label.classList.remove("active")
    );

    const clickedRadio = event.target;
    const parentLabel = clickedRadio.closest("label");

    if (parentLabel) {
      parentLabel.classList.add("active");
    }
  }
}

customElements.define("tisso-product", TissoProductGrid);

class MobileMenuOpen extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const openMenu = this;
    if (openMenu) {
      openMenu.addEventListener("click", () => this.MenuOpenFunc());
    }
  }

  MenuOpenFunc() {
    const mobileMenu = this.querySelector(".mobile-menu");
    const mobileMenuIconContainer = this.querySelector(".menu-mobile-icon");
    console.log(mobileMenuIconContainer, "mobileMenuIconContainer");

    if (mobileMenuIconContainer) {
      mobileMenuIconContainer.classList.toggle("active");
    }

    if (mobileMenu) {
      mobileMenu.style.display =
        mobileMenu.style.display === "block" ? "none" : "block";
    }
  }
}

customElements.define("mobile-menu", MobileMenuOpen);
