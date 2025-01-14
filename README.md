# Local Roots 

Our idea connects tourists with local businesses to foster cultural integration and support economic growth. It prioritises environmental sustainability and promotes responsible tourism, by creating a platform that allow tourists in a given area to engage with the local businesses and make payments via the application with ease.

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
   - [Prerequisites](#prerequisites)
   - [Setup](#setup)
5. [Usage](#usage)


## Introduction

Local Roots is a web-based marketplace that allows tourists and business travelers to book services from local businesses or freelancers. By leveraging Open Payments API, the platform simplifies cross-border transactions, supporting local economies and creating more sustainable tourism practices.

## Features

- Search and filter local businesses based on location and service category.
- Secure payment integration using Open Payments API.
- Modal-based booking and payment system.
- User-friendly and responsive interface.

## Tech Stack

- **Frontend:** React, TypeScript, CSS
- **Backend:** Node.js, Express
- **Database:** SQLite
- **API Integration:** Open Payments API

## Installation

### Prerequisites

Ensure you have the following tools installed:

- Node.js (v14 or later)
- npm (v6 or later)
- SQLite3

### Setup

1. Clone the repository:
```bash
   git clone https://github.com/IsaTippens/interledger.git
   cd interledger
```
2. Install the dependencies:
 ```bash
   # backend dependencies
   npm install
   # react dependencies
   cd frontend
   npm install
   # initialise database
   npx ts-node ./testing/test_db.ts
```

3. Start the Development Server:
```bash
   # Terminal #1
   npx ts-node ./backend/app.ts

   # Terminal #2
   cd frontend
   npm start
```

### Usage
1. Choose a service from categories like cleaning, gardening, babysitting, and catering.
2. Book and pay for services securely using the Open Payments API.
