<?php
use Framework\RequestMethods as RM;

class Cart extends Auth {
	public function add($id = null) {
		$this->JSONView(); $view = $this->getActionView();
		if (!$this->user) {
			return $view->set('message', "Please login first");
		}

		$book = Models\Book::first(['id = ?' => $id], ['id']);
		if (!$id || !$book) {
			return $view->set('message', "Invalid Request");
		}

		$cart = Models\Cart::first(['user_id = ?' => $this->user->id, 'book_id = ?' => $id]);
		if (!$cart) {
			$cart = new Models\Cart([
				'user_id' => $this->user->id,
				'book_id' => $id
			]);
			$cart->save();
		}
		$view->set('message', "Book added");
	}

	/**
	 * @before _secure
	 */
	public function remove($id = null) {
		$this->JSONView();
		$view = $this->getActionView();

		$cart = Models\Cart::first(["id = ?" => $id, "user_id = ?" => $this->user->id]);

		if (!$id || RM::type() !== 'DELETE' || !$cart) {
			return $view->set('message', "Invalid Request");
		}
		$cart->delete();
		$view->set('message', 'Cart Updated!!');
	}

	/**
	 * @before _secure
	 */
	public function show() {
		$this->seo(['title' => 'Your Cart']);
		$view = $this->getActionView();

		$cart = Models\Cart::all(['user_id = ?' => $this->user->id, 'live = ?' => false]);
		$view->set('items', $cart);
	}

	/**
	 * @before _secure
	 */
	public function checkout() {
		$this->seo(['title' => 'Thank You']);
		$view = $this->getActionView();

		$items = Models\Cart::all(['user_id = ?' => $this->user->id, 'live = ?' => false]);
		foreach ($items as $i) {
			$i->live = true;
			$i->save();
		}

	}
}