import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Flashcard from './Flashcard.jsx';

describe('Flashcard', () => {
  let mockOnFlip, mockOnUndo;

  beforeEach(() => {
    mockOnFlip = vi.fn();
    mockOnUndo = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders word.en on front side (English)', () => {
    const word = { en: 'hello', ja: 'こんにちは' };
    const { container } = render(<Flashcard word={word} showAnswer={false} onFlip={mockOnFlip} onUndo={mockOnUndo} canUndo={false} />);

    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('ENGLISH')).toBeInTheDocument();
  });

  test('renders word.ja on back side when showAnswer=true', () => {
    const word = { en: 'hello', ja: 'こんにちは' };
    const { container } = render(<Flashcard word={word} showAnswer={true} onFlip={mockOnFlip} onUndo={mockOnUndo} canUndo={true} />);

    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('こんにちは')).toBeInTheDocument();
  });

  test('calls onFlip when card is clicked', async () => {
    const word = { en: 'hello', ja: 'こんにちは' };
    const { container } = render(<Flashcard word={word} showAnswer={false} onFlip={mockOnFlip} onUndo={mockOnUndo} canUndo={false} />);

    const card = container.firstChild;
    await userEvent.click(card);

    expect(mockOnFlip).toHaveBeenCalledTimes(1);
  });

  test('undo button exists when canUndo=true', () => {
    const word = { en: 'hello', ja: 'こんにちは' };
    const { container } = render(<Flashcard word={word} showAnswer={false} onFlip={mockOnFlip} onUndo={mockOnUndo} canUndo={true} />);

    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
  });

  test('undo button disabled when canUndo=false', () => {
    const word = { en: 'hello', ja: 'こんにちは' };
    const { container } = render(<Flashcard word={word} showAnswer={false} onFlip={mockOnFlip} onUndo={mockOnUndo} canUndo={false} />);

    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
  });
});

  // Test 1: Renders word.en on front side (English)
  test('renders word.en on front side (English)', () => {
    render(<Flashcard {...defaultProps} />);

    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('ENGLISH')).toBeInTheDocument();
  });

  // Test 2: Renders word.ja on back side when showAnswer=true
  test('renders word.ja on back side when showAnswer=true', () => {
    render(<Flashcard {...defaultProps} showAnswer={true} />);

    expect(screen.getByText('こんにちは')).toBeInTheDocument();
    expect(screen.getByText('JAPANESE')).toBeInTheDocument();
  });

  // Test 3: Calls onFlip when card is clicked
  test('calls onFlip when card is clicked', async () => {
    const user = userEvent.setup();
    const onFlipMock = vi.fn();

    render(<Flashcard {...defaultProps} onFlip={onFlipMock} />);

    const card = screen.getByText('hello').closest('.cursor-pointer');
    await user.click(card);

    expect(onFlipMock).toHaveBeenCalledTimes(1);
  });

  // Test 4: Undo button exists when canUndo=true
  test('undo button exists when canUndo=true', () => {
    render(<Flashcard {...defaultProps} canUndo={true} />);

    const undoButton = screen.getByRole('button', { name: 'Undo' });
    expect(undoButton).toBeInTheDocument();
    expect(undoButton).toBeEnabled();
  });

  // Test 5: Undo button disabled when canUndo=false
  test('undo button disabled when canUndo=false', () => {
    render(<Flashcard {...defaultProps} canUndo={false} />);

    const undoButton = screen.getByRole('button', { name: 'Undo' });
    expect(undoButton).toBeInTheDocument();
    expect(undoButton).toBeDisabled();
  });
});
