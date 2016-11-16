<?php

namespace Models;
class Book extends \Shared\Model {

    /**
     * @column
     * @readwrite
     * @type text
     * @length 100
     * 
     * @validate required, min(3), max(100)
     * @label name
     */
    protected $_name;

    /**
     * @column
     * @readwrite
     * @type text
     * @length 100
     * 
     * @validate required, min(3), max(100)
     * @label Image
     */
    protected $_image;

    /**
     * @column
     * @readwrite
     * @type text
     * @length 5
     * 
     * @validate required
     * @label Price
     */
    protected $_price;

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

}
