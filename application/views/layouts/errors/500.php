<?php header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500); ?>
<!DOCTYPE html>
<html>
    <head>
        <title>SwiftMVC Framework</title>
    </head>
    <body>
        error 500
        <?php if (DEBUG): ?>
            <pre><?php echo print_r($e, true); ?></pre>
        <?php endif; ?>
    </body>
</html>
