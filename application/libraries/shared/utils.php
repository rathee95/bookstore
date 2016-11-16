<?php

class Utils {
	public static function hasClass($el, $name) {
		if (!self::isContentNode($el)) {
			return false;
		}

		if ($el->hasAttribute('class') && ($content->getAttribute('class') === $name)) {
			return true;
		}
		return false;
	}

	public static function isContentNode($node) {
		return is_a($node, 'DOMElement');
	}
}