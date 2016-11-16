<?php

namespace Models;
class Cart extends \Shared\Model {
    /**
     * @column
     * @readwrite
     * @type integer
     * @index
     * 
     * @validate required
     * @label ID of the User
     */
    protected $_user_id;

    /**
     * @column
     * @readwrite
     * @type integer
     * @index
     * 
     * @validate required
     * @label ID of the User
     */
    protected $_book_id;

}
