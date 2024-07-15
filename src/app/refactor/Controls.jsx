// Controls.js
const Controls = ({ onHide, onOpacityChange }) => (
    <div className="absolute top-2 left-2 bg-white p-4 rounded-lg shadow-lg">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={onHide}
      >
        Hide
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        className="mt-2 w-full"
        onChange={onOpacityChange}
      />
    </div>
  );
  
  export default Controls;
  