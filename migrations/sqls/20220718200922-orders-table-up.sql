CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE orders (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    total decimal(12,2) NOT NULL,
    order_date TIMESTAMP NOT NULL DEFAULT NOW(),
    user_id uuid REFERENCES users(id),
    order_status VARCHAR(10) NOT NULL
);