"""A simple Streamlit calculator application."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Dict, List

import streamlit as st


@dataclass(frozen=True)
class Operation:
    """Representation of a binary calculator operation."""

    label: str
    function: Callable[[float, float], float]

    def run(self, left: float, right: float) -> float:
        return self.function(left, right)


def _build_operations() -> Dict[str, Operation]:
    """Create the supported calculator operations."""

    def safe_division(left: float, right: float) -> float:
        if right == 0:
            raise ValueError("Division by zero is not allowed.")
        return left / right

    def safe_modulo(left: float, right: float) -> float:
        if right == 0:
            raise ValueError("Modulo by zero is not allowed.")
        return left % right

    return {
        "Addition (+)": Operation("+", lambda l, r: l + r),
        "Subtraction (-)": Operation("-", lambda l, r: l - r),
        "Multiplication (×)": Operation("×", lambda l, r: l * r),
        "Division (÷)": Operation("÷", safe_division),
        "Power (^)": Operation("^", lambda l, r: l**r),
        "Modulo (%)": Operation("%", safe_modulo),
    }


OPERATIONS = _build_operations()


def format_result(value: float) -> str:
    """Format calculator results with minimal trailing zeros."""

    if value.is_integer():
        return f"{int(value)}"
    return f"{value:.10g}"


def calculate(left: float, right: float, operation_name: str) -> float:
    """Calculate the result of the selected operation."""

    operation = OPERATIONS[operation_name]
    return operation.run(left, right)


def _init_history() -> None:
    if "history" not in st.session_state:
        st.session_state.history: List[str] = []


def main() -> None:
    st.set_page_config(page_title="Streamlit Calculator", page_icon="➗", layout="centered")
    st.title("🧮 Streamlit Calculator")
    st.write(
        "Perform quick arithmetic directly in your browser. Choose an operation, enter two numbers,"
        " and instantly view the result."
    )

    _init_history()

    col_left, col_right = st.columns(2)
    with col_left:
        left_value = st.number_input("First number", value=0.0, format="%0.6f")
    with col_right:
        right_value = st.number_input("Second number", value=0.0, format="%0.6f")

    operation_name = st.selectbox("Operation", list(OPERATIONS.keys()))

    if st.button("Calculate", type="primary"):
        try:
            result = calculate(left_value, right_value, operation_name)
        except ValueError as exc:
            st.error(str(exc))
        else:
            symbol = OPERATIONS[operation_name].label
            formatted_result = format_result(result)
            st.success(f"Result: {format_result(left_value)} {symbol} {format_result(right_value)} = {formatted_result}")
            st.session_state.history.insert(
                0,
                f"{format_result(left_value)} {symbol} {format_result(right_value)} = {formatted_result}",
            )
            st.session_state.history = st.session_state.history[:5]

    if st.session_state.history:
        st.markdown("### Recent calculations")
        for entry in st.session_state.history:
            st.write(f"• {entry}")
    else:
        st.info("No calculations yet. Enter numbers and press **Calculate** to get started.")

    st.markdown("---")
    st.caption(
        "This calculator supports addition, subtraction, multiplication, division, power, and modulo operations."
        " Built with [Streamlit](https://streamlit.io/)."
    )


if __name__ == "__main__":
    main()
