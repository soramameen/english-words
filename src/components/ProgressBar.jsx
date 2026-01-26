/**
 * ProgressBar Component
 * 
 * Displays a visual progress indicator with a smooth animation.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {number} props.progress - Progress percentage (0-100)
 * @returns {React.ReactElement} Progress bar element
 */
const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 h-1.5 shrink-0">
      <div 
        className="bg-green-500 h-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
