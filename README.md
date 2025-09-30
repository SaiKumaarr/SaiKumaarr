# Streamlit Calculator

A lightweight Streamlit application that performs common arithmetic operations right in the browser. Enter two numbers, choose an operation, and instantly see the result along with a short history of recent calculations.

## Features
- 🧮 Addition, subtraction, multiplication, division, power, and modulo operations
- ⚡ Instant feedback with clear result formatting
- 📝 Persistent history (last five calculations) stored in the Streamlit session state
- 📱 Responsive layout that works on desktop and mobile browsers

## Getting Started

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Streamlit app**
   ```bash
   streamlit run app.py
   ```

3. **Open your browser**
   Streamlit will display a local URL (typically <http://localhost:8501>). Open it to start calculating.

## Usage
1. Enter the first and second numbers using the numeric inputs.
2. Select the desired arithmetic operation from the dropdown menu.
3. Press **Calculate** to display the result.
4. Review your last few calculations in the history list below the form.

## Project Structure
```
.
├── app.py           # Streamlit user interface and calculator logic
├── requirements.txt # Python dependencies
└── README.md        # Project documentation (this file)
```

## Customisation Tips
- Adjust the `OPERATIONS` dictionary in `app.py` to add more functions (e.g., square root or logarithms).
- Modify `format_result` to change how numbers are displayed.
- Streamlit widgets can be rearranged or styled further using [Streamlit layout primitives](https://docs.streamlit.io/library/get-started/main-concepts#layout).

Enjoy crunching numbers! 🔢
