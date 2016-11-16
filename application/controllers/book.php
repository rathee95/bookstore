<?php
use Framework\RequestMethods as RM;

class Book extends Auth {
	public function all() {
		$this->seo(['title' => 'List of books']);
		$view = $this->getActionView();

		$title = RM::get("title");
		$query = [];
		if ($title) {
			$query["name LIKE ?"] = "%{$title}%";
		}

		$books = Models\Book::all($query);
		$view->set('books', $books)
			->set('title', $title);
		
	}

	public function purchased() {
		$this->seo(['title' => 'Purchased Books']);
		$view = $this->getActionView();

		$items = Models\Cart::all(['user_id = ?' => $this->user->id, 'live = ?' => true]);
		$view->set('items', $items);
	}
}