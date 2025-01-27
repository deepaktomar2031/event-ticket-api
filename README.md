# Backend Engineering Take-Home Exercise

Taylor Swift needs your help - while existing ticketing systems work, they are failing to enable her true fans to come to concerts at face value. 
You've been tasked to implement a simplified event ticketing purchasing system, which allows users to purchase tickets on a specific release date smoothly. 

# Context
* Ticket platforms are burst based in nature - everyone tries to buy tickets at an exact point in time, and then no traffic
* Bots also try to purchase tickets, and we do not want this.

## Time Expectation
* Expected time: 2-3 hours
* Please don't spend more than 3 hours on this exercise

## Core Features

### 1. Event Management
* Each event should have basic details (name, date, venue, etc.)
* Events can have multiple ticket types (e.g., VIP, General Admission) as well as seats, which are tied to a specific seat in a venue.

### 2. Ticket Inventory
* Track available tickets for each ticket type
* Handle concurrent ticket purchases safely
* Handle basic reservation mechanism

### 3. Checkout Flow
* Create a ticket checkout endpoint

## Technical Requirements

1. Use TypeScript

## What We're Looking For

* Clean architecture and separation of concerns
* Type safety and proper interfaces
* Concurrency handling
* Ideas on how to handle load/bots

## Getting Started

Take a look at the `domains` folder to see some sample interfaces to get started. Please feel free to modify them as you see fit, they are merely a framework to get started. They are by no means correct (not very scalable) or necessary for you implementation/ideas.

## Must dos

* There are quite a few considerations when building a ticketing platform. Ideally, you would outline things you would do given more time, and things you need to look out for. Future scalability, expanding to other use cases, etc is nice.

## Submission Guidelines

1. Share your code with me via email
2. Include a README.md with:
   * Architecture decisions and tradeoffs
   * What you would improve with more time

## Evaluation Criteria

* Organization and architecture
* General handling of weird cases & potential pitfalls
* How robust the overall checkout flow would be given any number of variables