# Contributing to DevTest

First off, thank you for considering contributing to DevTest! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one.

When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem** in as many details as possible
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed** after following the steps
* **Explain which behavior you expected to see** instead and why
* **Include screenshots and animated GIFs** if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description** of the suggested enhancement
* **Provide specific examples** to demonstrate the steps
* **Describe the current behavior** and the expected behavior
* **Include screenshots and animated GIFs** if applicable

### Pull Requests

* Fill in the required template
* Follow the TypeScript / JavaScript styleguides
* End all files with a newline
* Avoid platform-dependent code

## Development Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/devtest.git
cd devtest

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Install dependencies
pnpm install

# 4. Start development servers
pnpm dev

# 5. Make your changes
# Edit files in backend/src or frontend/src

# 6. Run tests
pnpm test

# 7. Commit with conventional commits
git commit -m "feat: add amazing feature"

# 8. Push and create pull request
git push origin feature/your-feature-name
```

## Styleguides

### Git Commit Messages

* Use the present tense ("add feature" not "added feature")
* Use the imperative mood ("move cursor to..." not "moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

**Conventional Commits:**
```
feat: add new analysis feature
fix: resolve crash in report parser
docs: update installation guide
style: format code with prettier
refactor: reorganize components
test: add unit tests for IPA analyzer
chore: update dependencies
```

### TypeScript/JavaScript Code Style

* Use const/let instead of var
* Use arrow functions where applicable
* Use descriptive variable names
* Add JSDoc comments for functions
* Keep functions small and focused

Example:
```typescript
/**
 * Analyzes an IPA file and extracts metadata
 * @param filePath - Path to the IPA file
 * @returns Analysis metadata
 */
export async function analyzeIPA(filePath: string): Promise<IPAAnalysis> {
  // Implementation
}
```

### React Component Style

* Use functional components with hooks
* Use TypeScript for type safety
* Export components with proper types
* Use meaningful prop names

Example:
```typescript
interface FileUploadProps {
  onUploadComplete?: (data: Analysis) => void
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  // Implementation
}
```

### CSS/Tailwind Style

* Use Tailwind CSS classes
* Avoid custom CSS in components
* Use responsive design patterns
* Test on mobile, tablet, and desktop

## Testing

* Write tests for new features
* Run tests before submitting PR: `pnpm test`
* Maintain or improve code coverage
* Test both happy paths and error cases

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter backend test
pnpm --filter frontend test

# Run tests in watch mode
pnpm test:watch

# Check coverage
pnpm test:coverage
```

## Documentation

* Update README.md if you change functionality
* Add comments for complex logic
* Update API docs for endpoint changes
* Include examples for new features

## Pull Request Process

1. **Before you start:**
   - Check if there's an existing issue
   - Create an issue to discuss major changes
   - Fork the repository

2. **Development:**
   - Keep commits atomic and well-described
   - Test locally before pushing
   - Follow the code style guidelines

3. **When ready:**
   - Push your branch to your fork
   - Create a Pull Request with a clear title and description
   - Link related issues
   - Request review from maintainers

4. **PR Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing Done
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests
- [ ] New tests pass locally
```

## Review Process

* Maintainers will review your PR
* Address feedback and make requested changes
* Once approved, your PR will be merged

## Community

* Follow the Code of Conduct
* Be respectful and inclusive
* Help others in discussions
* Share your ideas and feedback

## Questions?

* Check [SETUP.md](SETUP.md) for setup questions
* Check [QUICK_START.md](QUICK_START.md) for quick reference
* Open an issue for discussions
* Email: yedekkcaner@gmail.com

---

**Thank you for contributing to DevTest! 🚀**
