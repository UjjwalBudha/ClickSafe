# Contributing to ClickSafe

Thank you for considering contributing to ClickSafe! We welcome contributions of all kinds, including bug fixes, feature enhancements, and documentation improvements.

## How to Contribute

### Reporting Bugs

If you encounter a bug, please create an issue on GitHub with the following information:

- A clear, descriptive title for the issue.
- A description of the problem, including steps to reproduce the issue.
- Any relevant screenshots or logs.

### Suggesting Enhancements

If you have an idea for a new feature or improvement, please create an issue on GitHub with the following information:

- A clear, descriptive title for the suggestion.
- A detailed description of the proposed enhancement.
- Any relevant mockups, diagrams, or screenshots.

### Submitting Pull Requests

1. **Fork the Repository**: Click the "Fork" button at the top right of the repository page to create a copy of the repository on your GitHub account.

2. **Clone the Forked Repository**: Clone your forked repository to your local machine.
    ```sh
    git clone https://github.com/yourusername/clicksafe.git
    cd clicksafe
    ```

3. **Create a Branch**: Create a new branch for your feature or bug fix.
    ```sh
    git checkout -b feature-name
    ```

4. **Make Your Changes**: Implement your changes in the new branch. Be sure to follow the project's coding standards and include tests if applicable.

5. **Commit Your Changes**: Commit your changes with a clear, concise commit message.
    ```sh
    git add .
    git commit -m "Add feature description"
    ```

6. **Push to Your Fork**: Push your changes to your forked repository.
    ```sh
    git push origin feature-name
    ```

7. **Submit a Pull Request**: Go to the original repository on GitHub and submit a pull request. Include a clear description of your changes and any relevant details.

### Code Style

Please adhere to the following code style guidelines:

- **JavaScript**: Follow the Airbnb JavaScript Style Guide.
- **CSS**: Use BEM naming conventions for CSS classes.
- **HTML**: Ensure HTML is properly indented and formatted.

### Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Development Setup

To set up a local development environment, follow these steps:

1. **Clone the Repository**: Clone the repository to your local machine.
    ```sh
    git clone https://github.com/yourusername/clicksafe.git
    cd clicksafe
    ```

2. **Install Dependencies**: Install any project dependencies. For this project, dependencies are minimal and primarily include JavaScript and CSS libraries.

3. **Load the Extension in Chrome**:
    - Open Chrome and go to `chrome://extensions/`.
    - Enable "Developer mode" by clicking the toggle switch in the top right corner.
    - Click the "Load unpacked" button and select the project directory.

4. **Make Your Changes**: Start making your changes and use Chrome's developer tools to test and debug.

5. **Run Tests**: If the project includes tests, run them to ensure your changes do not break existing functionality.

## Contact

If you have any questions or need further assistance, please feel free to open an issue on GitHub or contact the project maintainers directly.

Thank you for contributing to ClickSafe!
