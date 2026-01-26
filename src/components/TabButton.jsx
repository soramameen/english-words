import { MODE_COLORS } from '../utils/constants';

/**
 * TabButton Component
 * 
 * A reusable button component for switching between learning modes.
 * Displays mode label, icon, and word count with active state styling.
 * 
 * @component
 * @example
 * <TabButton
 *   isActive={currentMode === 'learning'}
 *   onClick={() => setCurrentMode('learning')}
 *   count={words.length}
 *   icon={Layers}
 *   label="Learning"
 *   color="blue"
 * />
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isActive - Whether this tab is currently active
 * @param {Function} props.onClick - Callback when button is clicked
 * @param {number} props.count - Number of words in this mode (displayed below label)
 * @param {React.ComponentType} props.icon - Lucide-react icon component
 * @param {string} props.label - Button label text (e.g., "Learning", "Reviewing")
 * @param {string} props.color - Color variant: 'blue', 'yellow', or 'green'
 * @returns {JSX.Element} Styled tab button
 */
const TabButton = ({ isActive, onClick, count, icon, label, color }) => {
  const Icon = icon;

  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 flex flex-col items-center justify-center transition-all border-b-2 ${
        isActive ? MODE_COLORS[color] : 'border-transparent text-gray-400 hover:text-gray-600'
      }`}
    >
      <div className="flex items-center space-x-1">
        <Icon size={18} />
        <span className="text-xs font-bold uppercase">{label}</span>
      </div>
      <span className="text-xs font-mono mt-0.5">{count}</span>
    </button>
  );
};

export default TabButton;
