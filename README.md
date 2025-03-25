# Sorting Hat Technical Description

**Author**: Dhruv  
**Organization**: The Signal Society  

---

## Project Proposal

We would like to create an immersive "sorting hat"-style experience that will be used to sort people in our organization into a **lin**.  

We will use a **root mean squared error** (RMSE) approach for closeness—testing for similarity between a participant’s responses and those of the lin leaders.  

- This application will be **frontend-only**, with **no backend**.  
- It will only be used for **sorting**, not for data collection or storage.  
- Each question will be rated on a scale of **1 to 5**.  
- Each question will have a **custom moniker** for values **1** and **5**.

---

## Proposed Technical Stack

1. **Tailwind CSS**:  
   - For styling  
   - For animations  

2. **React**:  
   - The frontend will be entirely in React  
   - Initialized with `npx create-react-app`

3. **Data**:  
   - Stored in `.csv` files  
   - Parsed into JSON arrays

---

## Data Setup

All data will reside in a `data` subfolder inside the `src` directory.

### Question Model

- `question`: The text of the question  
- `one_moniker`: Descriptor for a response of 1  
- `five_moniker`: Descriptor for a response of 5  

### Score Model

- `lin_name`: Name of the lin  
- `q1`  
- `q2`  
- ...  
- `q13`: Scores for each of the 12 questions
