<?php
use Framework\RequestMethods as RM;
class Account extends Auth {
	/**
	 * @before _secure
	 */
	public function index() {
		$this->seo(['title' => 'Account']);


	}
}