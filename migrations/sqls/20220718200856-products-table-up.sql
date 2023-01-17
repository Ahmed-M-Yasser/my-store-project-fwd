CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE products (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_name VARCHAR(255) UNIQUE,
    price decimal(12,2) NOT NULL
);