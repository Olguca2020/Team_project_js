import { renderCart } from '../cart';
import { postOrders } from '../API';

(() => {
  const refs = {
    openModal: document.querySelector('.cart-form-order-input'),
    closeModalBtn: document.querySelector('.modal-product-close-icon'),
    modal: document.querySelector('.backdrop-cart '),
  };

  const backdrop = document.querySelector('.backdrop-cart');
  if (refs.openModal) {
    refs.openModal.addEventListener('submit', async function (event) {
      event.preventDefault();

      const userEmailInput = document.getElementById('user-email');
      const userEmail = userEmailInput.value;

      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

      if (cartItems.length === 0) {
        alert('Your cart is empty. Add some items before checking out.');
        return;
      }

      const transformedCart = cartItems.map(item => ({
        productId: item._id,
        amount: item.quantity,
      }));

      try {
        await postOrders({ email: userEmail, products: transformedCart });
        toggleModal();
        localStorage.setItem('cart', JSON.stringify([]));
        renderCart([]);
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }

  refs.closeModalBtn.addEventListener('click', toggleModal);
  backdrop.addEventListener('click', handleBackdrop);

  function handleBackdrop(event) {
    if (event.target !== backdrop) {
      return;
    }
    toggleModal();
  }

  document.addEventListener('keydown', handleKey);

  function handleKey(event) {
    if (event.code === 'Escape') {
      toggleModal();
      document.removeEventListener('keydown', handleKey);
    }
  }

  function toggleModal() {
    refs.modal.classList.toggle('is-hidden');
  }
})();
