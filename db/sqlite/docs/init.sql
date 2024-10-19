-- SQLITE3 Database

-- Business Table
-- BusinessName 
-- BusinessAddress
-- Category
-- BusinessPhone
-- BusinessEmail

CREATE TABLE IF NOT EXISTS business (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_name TEXT NOT NULL,
    business_address TEXT NOT NULL,
    category TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL
);