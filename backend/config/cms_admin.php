<?php

return [
    'id' => 1,

    'name' => env(
        'CMS_ADMIN_NAME',
        'Accutech Administrator'
    ),

    'email' => env('CMS_ADMIN_EMAIL', ''),

    'password' => env('CMS_ADMIN_PASSWORD', ''),
];
