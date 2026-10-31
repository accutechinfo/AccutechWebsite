<?php
return [
    // Explicit opt-in because the PostgreSQL database is shared with live CodeIgniter.
    'allow_writes' => env('CUSTOMER_AUTH_ALLOW_WRITES', false),
];
