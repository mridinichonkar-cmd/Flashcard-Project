Flash Learning

This project is a creative answer to the common student's organisation and time management issues. When studying for exams and content heavy subjects that require both memorisation and interpretation of information, the best way to prepare is active recall. 

This webapp allows users to input questions and answers to their personal flashcard stack and start studying straight away. Instead of hand cutting cards and writing every question and its answer, this app allows users to save time and get straight to studying, providing ability to change and add more cards to their match their needs.


3) an illustration of the technical stack, including frontend, styling, routing, data, and deployment (if applicable). 

For the tech stack I've chosen to use React paired with Vite and CSS  for frontend and Node.js and Express for backend API calls aswell as logic handling. The database is MongoDB and Mongoose for connection. Ive used Ant design and React icons for styling. JWT via HTTP-only cookies was used for authentication

![alt text](image.png)


Make sure you have these installed before running the app:

- Node.js (v18 or higher)
- npm
- A MongoDB Atlas account or a local MongoDB instance

How to run the app.

1. Clone the Main branch to your local device,
 - git clone https://github.com/mridinichonkar-cmd/Flashcard-Project.git
 - cd Flashcard-Clean

2. Set up the backend and frontend

- cd server
- npm install

- cd client
- npm install

3. run the backend and client side in two different terminals(bash) 

- cd server
- npm run dev

- cd client
- npm run dev



4. Open the link from the client terminal to see the app.

4) Feature List: 
- User stat cards, total cards, studied, amount of decks, remaining cards
- Flashcard creation with question and answer input
- Real-time display of flashcards from the database
- Edit existing flashcards (update functionality)
- Delete flashcards permanently from the database
- Interactive card flip animation to reveal answers
- Disapearring cards after answer is revealed
- Fade-out animation when cards are completed
- Reset study session to restore all flashcards
- Responsive grid layout for displaying flashcards
- Hover effects and 3D tilt for improved user interaction
- Form validation to prevent empty submissions
- Asynchronous data fetching using REST API
- Persistent data storage using MongoDB
- Full CRUD functionality (Create, Read, Update, Delete)
- Single-page application behavior


5) Briefly explain the folder structure. 

This project is split into to two main folders
    Client - for frontend react application
        Pages - for the different app routes 
    Server - for backend files and database connections

<img width="769" height="1077" alt="image" src="https://github.com/user-attachments/assets/7c6fcb0d-9365-4482-982a-259639fe984c" />



6) A summary of challenges overcome

I faced challenges mainly with feature logic contradictions, especially when the inital draft didn't include flipping logic which then had to be refactored in to most of the functions. I also had to differentiate between deleting cards from database and hiding cards after use. Styling and css details also was time consuming and involved refactoring most of the strucutre of the app.jsx to sort out the div and class arrangements. I also had some trouble with github, some commits were stashed and I tried to commit them into a new branch which caused a small crash, I was able to save the stashed changes and push them into development and save those features. Overall the main challenges were refactoring everytime I had a big Ui change and making sure that my changes didnt break and go into conflict with others when triggered. I also struggled with refactoring the folder structure as I introduced authentication, the sudden increase in fetch hooks was difficult to manage without multiple files and so it was a complicated process to organise for each specific requirement.
