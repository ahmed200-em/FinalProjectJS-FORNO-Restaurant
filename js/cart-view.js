document.querySelector("#cartDrawer").innerHTML = `
  <div class="cart-drawer-header">
    <div class="cart-drawer-title">
      <p>UNE ENVIE PREND FORME</p>
      <h2 id="cartTitle" tabindex="-1">Mon panier</h2>
    </div>
    <button type="button" id="closeCartBtn" class="close-btn" aria-label="Fermer le panier" autofocus>&times;</button>
  </div>
  <div class="cart-drawer-body" role="region" aria-label="Contenu du panier" tabindex="0">
    <form class="order-form" id="orderForm" method="dialog" hidden>
      <fieldset id="methodGroup">
        <legend>Comment souhaitez-vous déguster votre pizza ?</legend>
        <div class="order-method-options">
          <label class="order-method-option">
            <input type="radio" name="orderMethod" value="pickup" checked />
            <span>À emporter</span>
          </label>
          <label class="order-method-option">
            <input type="radio" name="orderMethod" value="dine-in" />
            <span>Sur place</span>
          </label>
          <label class="order-method-option">
            <input type="radio" name="orderMethod" value="delivery" />
            <span>Livraison</span>
          </label>
        </div>
      </fieldset>
      <p class="order-method-note" id="pickupNote">Retrait au comptoir FORNO.</p>
      <p class="order-method-note" id="dineInNote" hidden>Une table sera attribuée au moment de la confirmation.</p>
      <div class="order-field">
        <label for="orderName">Votre nom</label>
        <input type="text" id="orderName" name="orderName" autocomplete="name" required />
      </div>
      <div class="order-field" id="orderPhoneField">
        <label for="orderPhone">Votre téléphone</label>
        <input type="tel" id="orderPhone" name="orderPhone" autocomplete="tel" required />
      </div>
      <fieldset class="order-delivery-fields" id="deliveryFields" hidden disabled>
        <legend>Détails de livraison</legend>
        <div class="order-field">
          <label for="orderAddress">Votre adresse</label>
          <textarea id="orderAddress" name="orderAddress" autocomplete="street-address" rows="2" required></textarea>
        </div>
        <div class="order-field">
          <label for="deliveryZone">Zone de livraison</label>
          <select id="deliveryZone" name="deliveryZone" required>
            <option value="">Choisissez votre zone</option>
            <option value="center">Casablanca centre</option>
            <option value="outskirts">Périphérie de Casablanca</option>
          </select>
        </div>
      </fieldset>
    </form>
    <div class="cart-drawer-items" id="cartItemsContainer"></div>
    <section class="order-receipt" id="orderReceipt" aria-label="Récapitulatif de la commande" hidden>
      <p class="cart-demo-note">Récapitulatif de démonstration, sans envoi ni paiement.</p>
      <dl class="order-receipt-details">
        <div class="cart-drawer-total-row">
          <dt>Nom</dt>
          <dd id="receiptName"></dd>
        </div>
        <div class="cart-drawer-total-row">
          <dt>Mode de commande</dt>
          <dd id="receiptMethod"></dd>
        </div>
        <div class="cart-drawer-total-row" id="receiptDetailRow">
          <dt id="receiptDetailLabel"></dt>
          <dd id="receiptDetail"></dd>
        </div>
      </dl>
      <h3>Vos pizzas</h3>
      <ul class="order-receipt-items" id="receiptItems" role="list"></ul>
      <dl class="cart-drawer-summary">
        <div class="cart-drawer-total-row" id="receiptDeliveryRow" hidden>
          <dt>Livraison</dt>
          <dd id="receiptDeliveryFee"></dd>
        </div>
        <div class="cart-drawer-total-row cart-drawer-total">
          <dt>Total</dt>
          <dd id="receiptTotal"></dd>
        </div>
      </dl>
    </section>
  </div>
  <div class="cart-drawer-footer">
    <dl class="cart-drawer-summary" id="cartSummary" aria-live="polite" aria-atomic="true">
      <div class="cart-drawer-total-row" id="cartSubtotalRow" hidden>
        <dt>Sous-total</dt>
        <dd id="cartSubtotal"></dd>
      </div>
      <div class="cart-drawer-total-row" id="cartDeliveryRow" hidden>
        <dt>Livraison</dt>
        <dd id="cartDeliveryFee"></dd>
      </div>
      <div class="cart-drawer-total-row cart-drawer-total">
        <dt>Total</dt>
        <dd id="cartTotalPrice"></dd>
      </div>
    </dl>
    <p class="cart-demo-note" id="cartDemoNote" hidden>
      Simulation sans envoi ni paiement. Tarifs et nombre de tables fictifs.
    </p>
    <div class="cart-drawer-actions">
      <a class="checkout-btn" id="browseMenuBtn" href="index.html#cartSection">Découvrir la carte</a>
      <button type="button" class="checkout-btn" id="checkoutBtn" hidden>Passer commande</button>
      <button type="submit" class="checkout-btn" id="confirmOrderBtn" form="orderForm" aria-describedby="cartDemoNote" hidden>Préparer la commande</button>
      <button type="button" class="cart-back-btn" id="backToCartBtn" hidden>Modifier le panier</button>
    </div>
  </div>
`;
