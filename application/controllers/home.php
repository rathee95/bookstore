<?php

use Shared\Controller as Controller;

class Home extends Controller {

    public function index() {
    	$this->seo(["title" => "Home | BookSquare - Buy &amp; Sell Books"]);

    	
    }

    public function render() {
		$cart_count = 0;
		if ($this->user) {
			$cart_count = Models\Cart::count(["user_id = ?" => $this->user->id, "live = ?" => false]);
		}

		if ($this->layoutView) {
			$this->layoutView->set('cart_count', $cart_count);
		}

		if ($this->actionView) {
			$this->actionView->set('cart_count', $cart_count);
		}
		parent::render();
	}
}
