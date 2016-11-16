<?php

namespace Models;
class User extends \Shared\Model {

    /**
     * @column
     * @readwrite
     * @type text
     * @length 100
     * 
     * @validate required, min(3), max(32)
     * @label first name
     */
    protected $_name;

    /**
     * @column
     * @readwrite
     * @type text
     * @length 100
     * @uindex
     * 
     * @validate required, max(100)
     * @label email address
     */
    protected $_email;

    /**
     * @column
     * @readwrite
     * @type text
     * @length 100
     * @index
     * 
     * @validate required, min(8), max(32)
     * @label password
     */
    protected $_password;

    /**
     * @column
     * @readwrite
     * @type text
     * @length 15
     * @index
     * 
     * @validate required
     * @label Phone Number
     */
    protected $_phone;
    
    /**
    * @column
    * @readwrite
    * @type boolean
    */
    protected $_admin = false;

}
